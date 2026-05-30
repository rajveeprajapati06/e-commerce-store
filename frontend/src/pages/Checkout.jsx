import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import {
  createOrderApi,
  initRazorpayOrderApi,
  verifyRazorpayPaymentApi,
  updateOrderToPaidApi,
} from '../services/api';
import { MapPin, ClipboardList, CreditCard, ShieldCheck, HelpCircle } from 'lucide-react';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const {
    cartItems,
    shippingAddress,
    saveShippingAddress,
    clearCart,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useContext(CartContext);

  const navigate = useNavigate();

  // Shipping form fields
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  
  // Checkout status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [mockOrderDetails, setMockOrderDetails] = useState(null);

  // If cart is empty, redirect
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Load Razorpay SDK Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleOrderSubmission = async (e) => {
    e.preventDefault();

    if (!address || !city || !postalCode || !country) {
      setErrorMessage('Please fill in all shipping address fields.');
      return;
    }

    // Save shipping info to context
    const addressPayload = { address, city, postalCode, country };
    saveShippingAddress(addressPayload);

    try {
      setLoading(true);
      setErrorMessage(null);

      // 1. Create order record on backend
      const orderPayload = {
        orderItems: cartItems,
        shippingAddress: addressPayload,
        paymentMethod: 'Razorpay',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      const createdOrder = await createOrderApi(orderPayload);
      const amountInRupees = totalPrice * 80; // Conversion: 1 USD = 80 INR for payment gateway testing

      // 2. Initialize Razorpay Payment Order on backend
      const paymentOrder = await initRazorpayOrderApi(amountInRupees);

      if (paymentOrder.success) {
        // If simulated backend mock mode is activated (either mock keys or custom simulation)
        if (paymentOrder.isMock) {
          setMockOrderDetails({
            orderId: paymentOrder.order_id,
            dbOrderId: createdOrder._id,
            amount: paymentOrder.amount,
          });
          setShowSimulatedModal(true);
          setLoading(false);
          return;
        }

        // Otherwise attempt standard Razorpay modal trigger
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          setErrorMessage('Failed to load Razorpay payment SDK. Check connection or fallback.');
          setLoading(false);
          return;
        }

        const options = {
          key: paymentOrder.key || 'rzp_test_mock_keys',
          amount: paymentOrder.amount,
          currency: 'INR',
          name: 'AuraStore E-Commerce',
          description: `Order checkout payment for ${user.name}`,
          order_id: paymentOrder.order_id,
          handler: async function (response) {
            try {
              setLoading(true);
              // Verify transaction signature
              const verifyPayload = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };

              const verificationResult = await verifyRazorpayPaymentApi(verifyPayload);

              if (verificationResult.success) {
                // Update order to PAID
                await updateOrderToPaidApi(createdOrder._id, {
                  id: verificationResult.payment_id,
                  status: 'PAID',
                  update_time: new Date().toISOString(),
                  email_address: user.email,
                });

                // Clear context & navigate
                clearCart();
                navigate('/orders');
              } else {
                setErrorMessage('Signature verification failed. Payment unauthorized.');
              }
            } catch (err) {
              setErrorMessage('Payment verification processing failed.');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#2563eb', // Aura Primary Color
          },
        };

        const razorpayWindow = new window.Razorpay(options);
        razorpayWindow.open();
        setLoading(false);
      } else {
        setErrorMessage('Failed to initiate transaction order.');
        setLoading(false);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error occurred during checkout process.');
      setLoading(false);
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    if (!mockOrderDetails) return;

    try {
      setLoading(true);
      setShowSimulatedModal(false);

      // Verify simulated transaction
      const verifyPayload = {
        razorpay_order_id: mockOrderDetails.orderId,
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        razorpay_signature: 'simulated_verification_signature',
      };

      const verificationResult = await verifyRazorpayPaymentApi(verifyPayload);

      if (verificationResult.success) {
        // Mark database order PAID
        await updateOrderToPaidApi(mockOrderDetails.dbOrderId, {
          id: verificationResult.payment_id,
          status: 'PAID',
          update_time: new Date().toISOString(),
          email_address: user.email,
        });

        // Reset & navigate
        clearCart();
        navigate('/orders');
      } else {
        setErrorMessage('Failed to verify mock payment.');
      }
    } catch (err) {
      setErrorMessage('Verification processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="space-y-8 fade-in-up relative">
      {/* Title */}
      <div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout Gate</h1>
        <p class="text-slate-400 text-sm mt-1">Finalize shipping and process payment for your order</p>
      </div>

      {errorMessage && (
        <div class="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-semibold text-sm">
          {errorMessage}
        </div>
      )}

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form & Address Details */}
        <div class="lg:col-span-2 space-y-6">
          {/* Shipping Form Card */}
          <form onSubmit={handleOrderSubmission} class="bg-white rounded-2xl p-6 md:p-8 shadow-premium border border-slate-100/80 space-y-6">
            <h2 class="font-bold text-slate-800 text-lg flex items-center gap-2 border-b border-slate-100 pb-4">
              <MapPin class="h-5 w-5 text-primary" /> Delivery Destination
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2 space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="123 Main St, Apartment 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">City</label>
                <input
                  type="text"
                  required
                  placeholder="New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Postal / Zip Code</label>
                <input
                  type="text"
                  required
                  placeholder="10001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div class="md:col-span-2 space-y-1.5">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Country</label>
                <input
                  type="text"
                  required
                  placeholder="United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-primary text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              class="w-full mt-4 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard class="h-4 w-4" />
              {loading ? 'Processing Transaction...' : `Pay $${totalPrice.toLocaleString()} with Razorpay`}
            </button>
          </form>
        </div>

        {/* Right Column: Checkout Items Review Panel */}
        <aside class="space-y-6">
          <div class="bg-white rounded-2xl p-6 shadow-premium border border-slate-100 space-y-6">
            <h2 class="font-bold text-slate-800 text-lg flex items-center gap-2 pb-4 border-b border-slate-100">
              <ClipboardList class="h-5 w-5 text-primary" /> Order Items ({cartItems.length})
            </h2>

            {/* List of items scrolling container */}
            <div class="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product} class="flex items-center gap-4 text-sm font-semibold">
                  <img
                    src={item.image}
                    alt={item.name}
                    class="w-10 h-10 rounded-lg object-cover bg-slate-50 border"
                  />
                  <div class="flex-grow min-w-0">
                    <span class="block text-slate-800 truncate">{item.name}</span>
                    <span class="block text-slate-400 text-xs font-medium">Qty: {item.qty}</span>
                  </div>
                  <span class="text-slate-800">${(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <hr class="border-slate-100" />

            {/* Pricing split */}
            <div class="space-y-3 text-sm font-semibold text-slate-500">
              <div class="flex justify-between">
                <span>Products Cost</span>
                <span class="text-slate-800">${itemsPrice.toLocaleString()}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping Fees</span>
                <span class="text-slate-800">
                  {shippingPrice === 0 ? <span class="text-emerald-600">Free</span> : `$${shippingPrice}`}
                </span>
              </div>
              <div class="flex justify-between">
                <span>GST Tax (12%)</span>
                <span class="text-slate-800">${taxPrice.toLocaleString()}</span>
              </div>
              <hr class="border-slate-100" />
              <div class="flex justify-between text-base font-bold">
                <span class="text-slate-800">Grand Total</span>
                <span class="text-primary">${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* simulated Razorpay Sandbox fallback Modal */}
      {showSimulatedModal && mockOrderDetails && (
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div class="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6 animate-fade-in-up">
            <div class="flex items-center justify-between pb-3 border-b">
              <div class="flex items-center gap-2">
                <div class="h-3 w-3 bg-accent rounded-full animate-ping"></div>
                <h3 class="font-extrabold text-slate-800 text-lg">Razorpay Sandboxed Sim</h3>
              </div>
            </div>

            <div class="space-y-4 bg-slate-50 p-4 rounded-2xl border text-sm">
              <div class="flex justify-between">
                <span class="text-slate-400 font-medium">Razorpay Order ID:</span>
                <code class="text-slate-800 font-bold">{mockOrderDetails.orderId}</code>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400 font-medium">Converted INR Amount:</span>
                <span class="text-slate-800 font-extrabold">₹{(mockOrderDetails.amount / 100).toLocaleString()} INR</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400 font-medium">Equivalent Price USD:</span>
                <span class="text-primary font-extrabold">${totalPrice.toLocaleString()} USD</span>
              </div>
            </div>

            <p class="text-slate-400 text-xs leading-relaxed">
              We detected you are running without active credentials or in standard test modes. Our simulated verification bypass handles payment confirmation automatically for local testing!
            </p>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSimulatePaymentSuccess}
                class="flex-grow py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md"
              >
                Simulate Payment Success
              </button>
              <button
                onClick={() => {
                  setShowSimulatedModal(false);
                  setLoading(false);
                  setErrorMessage('Simulated transaction canceled by customer.');
                }}
                class="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
