import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import connectDB from '../config/db.js';

dotenv.config();

const products = [
  {
    name: 'Apple iPhone 15 Pro Max',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop',
    category: 'Electronics',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
    price: 1199,
    stock: 12,
    rating: 4.8,
    numReviews: 24,
  },
  {
    name: 'Sony WH-1000XM5 ANC Headphones',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33faf9ef?q=80&w=600&auto=format&fit=crop',
    category: 'Electronics',
    description: 'Industry-leading noise cancellation, exceptional sound quality with High-Resolution Audio, crystal-clear hands-free calling, and up to 30 hours of battery life.',
    price: 399,
    stock: 18,
    rating: 4.9,
    numReviews: 42,
  },
  {
    name: 'Nike Air Max 270 Sneakers',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    category: 'Apparel',
    description: 'Nikes first lifestyle Air Max brings you style, comfort and big attitude. Inspired by Air Max icons, it showcases Nikes greatest innovation with its large window.',
    price: 150,
    stock: 25,
    rating: 4.7,
    numReviews: 31,
  },
  {
    name: 'Keychron K2 Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33faf9ef?q=80&w=600&auto=format&fit=crop',
    category: 'Electronics',
    description: 'A 75% layout wireless mechanical keyboard designed for maximum productivity with hot-swappable switches, dynamic RGB backlighting, and solid aluminum bezel.',
    price: 99,
    stock: 15,
    rating: 4.6,
    numReviews: 19,
  },
  {
    name: 'Everlane Minimalist Leather Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    description: 'Crafted from premium Italian leather. A timeless, sleek design with a protective 15-inch laptop compartment, padded straps, and handy external pockets.',
    price: 185,
    stock: 8,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Fujifilm X-T5 Mirrorless Camera',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop',
    category: 'Electronics',
    description: 'The ultimate photography-first mirrorless camera featuring a high-resolution 40.2MP X-Trans CMOS 5 HR sensor and a classic dial-based form factor.',
    price: 1699,
    stock: 5,
    rating: 4.9,
    numReviews: 8,
  },
  {
    name: 'Patagonia Torrentshell Rain Jacket',
    image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=600&auto=format&fit=crop',
    category: 'Apparel',
    description: 'Simple and unpretentious, Nikes standard H2No Performance Standard 3-layer shell waterproof rain jacket provides exceptional comfort and durability.',
    price: 149,
    stock: 30,
    rating: 4.4,
    numReviews: 15,
  },
  {
    name: 'AeroPress Premium Coffee Maker',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
    category: 'Home & Kitchen',
    description: 'Patented 3-in-1 brew technology combines the best of several brew methods into one easy to use, highly portable device for smooth, delicious coffee.',
    price: 49,
    stock: 40,
    rating: 4.8,
    numReviews: 56,
  },
  {
    name: 'Apple MacBook Pro 16 M3 Max',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
    category: 'Electronics',
    description: 'The ultimate pro laptop featuring a brilliant Liquid Retina XDR display, vast ports connectivity, and unbelievable battery life powered by the M3 Max chip.',
    price: 2499,
    stock: 6,
    rating: 4.9,
    numReviews: 18,
  },
  {
    name: 'Sony PlayStation 5 Slim',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600&auto=format&fit=crop',
    category: 'Electronics',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
    price: 499,
    stock: 14,
    rating: 4.7,
    numReviews: 29,
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop',
    category: 'Electronics',
    description: 'An iconic ergonomic mouse remastered with 8,000 DPI tracking on any surface and quiet clicks so you can feel your flow with absolute precision.',
    price: 99,
    stock: 22,
    rating: 4.8,
    numReviews: 61,
  },
  {
    name: 'Nike Sportswear Tech Fleece Hoodie',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
    category: 'Apparel',
    description: 'Our premium, lightweight fleece is smooth both inside and out, giving you plenty of warmth without adding bulk. Ideal for active street look.',
    price: 130,
    stock: 18,
    rating: 4.5,
    numReviews: 22,
  },
  {
    name: 'Ray-Ban Wayfarer Classic Sunglasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop',
    category: 'Accessories',
    description: 'The most recognizable style in the history of sunglasses. Since its initial design in 1952, Wayfarer Classic gained popularity among designers and trendsetters.',
    price: 160,
    stock: 12,
    rating: 4.6,
    numReviews: 14,
  },
  {
    name: 'Kindle Paperwhite (16 GB)',
    image: 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?q=80&w=600&auto=format&fit=crop',
    category: 'Electronics',
    description: 'Now with a 6.8\" display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns.',
    price: 139,
    stock: 20,
    rating: 4.8,
    numReviews: 45,
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true,
    });

    // Create demo customer user
    await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      isAdmin: false,
    });

    console.log('Demo Users created successfully!');

    // Map admin id to seeded products
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser._id };
    });

    await Product.insertMany(sampleProducts);

    console.log('Demo Products seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during data seeding: ${error.message}`);
    process.exit(1);
  }
};

importData();
