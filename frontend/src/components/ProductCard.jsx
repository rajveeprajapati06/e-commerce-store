import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Star, ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  // Dynamic rating stars generator
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} class="h-4 w-4 fill-accent text-accent" />);
      } else {
        stars.push(<Star key={i} class="h-4 w-4 text-slate-300" />);
      }
    }
    return stars;
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevents navigating to product details
    if (product.stock > 0) {
      addToCart(product, 1);
    }
  };

  return (
    <div class="group bg-white rounded-2xl overflow-hidden shadow-premium hover:shadow-premiumHover transition-all duration-300 flex flex-col h-full border border-slate-100/80 hover:border-primary/20">
      {/* Product Image Panel */}
      <Link to={`/products/${product._id}`} class="relative block overflow-hidden aspect-[4/3] bg-slate-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay hover details */}
        <div class="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span class="p-3 bg-white/95 rounded-full text-secondary shadow-md hover:bg-primary hover:text-white transition-colors">
            <Eye class="h-5 w-5" />
          </span>
        </div>

        {/* Stock status indicator */}
        {product.stock === 0 && (
          <span class="absolute top-3 left-3 bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Out of Stock
          </span>
        )}

        {/* Category Badge */}
        <span class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
          {product.category}
        </span>
      </Link>

      {/* Card Contents */}
      <div class="p-5 flex flex-col flex-grow">
        {/* Ratings block */}
        <div class="flex items-center gap-1.5 mb-2.5">
          <div class="flex">{renderStars(product.rating)}</div>
          <span class="text-xs font-medium text-slate-400">({product.numReviews})</span>
        </div>

        {/* Title */}
        <Link
          to={`/products/${product._id}`}
          class="font-bold text-slate-800 text-base leading-snug group-hover:text-primary transition-colors flex-grow line-clamp-2 mb-2"
        >
          {product.name}
        </Link>

        {/* Price & Add to Cart section */}
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-slate-100/80">
          <div>
            <span class="text-xs text-slate-400 block font-medium">Price</span>
            <span class="text-xl font-extrabold text-slate-900">${product.price.toLocaleString()}</span>
          </div>

          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              class="p-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full transition-all duration-300 shadow-sm focus:outline-none"
              title="Add to Cart"
            >
              <ShoppingCart class="h-4 w-4" />
            </button>
          ) : (
            <button
              disabled
              class="p-2.5 bg-slate-100 text-slate-400 rounded-full cursor-not-allowed"
              title="Out of Stock"
            >
              <ShoppingCart class="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
