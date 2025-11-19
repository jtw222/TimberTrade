import React from 'react';
import { ShoppingCart, Heart, Search, Menu, Instagram, Facebook, Mail } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "The Heritage Frame",
    price: 85.00,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
    category: "Frames"
  },
  {
    id: 2,
    name: "Walnut Hope Chest",
    price: 450.00,
    image: "https://images.unsplash.com/photo-1521985109869-e2474c45be06?auto=format&fit=crop&w=600&q=80", // Placeholder chest-like
    category: "Furniture"
  },
  {
    id: 3,
    name: "Live Edge Shelf",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1556603005-67376426f7e8?auto=format&fit=crop&w=600&q=80", // Shelf
    category: "Decor"
  },
  {
    id: 4,
    name: "Maple Serving Tray",
    price: 65.00,
    image: "https://images.unsplash.com/photo-1602216723667-7bb24d727882?auto=format&fit=crop&w=600&q=80", // Wood texture/tray
    category: "Kitchen"
  }
];

const StorePreview: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-lg overflow-hidden flex flex-col min-h-[800px]">
      {/* Browser Mockup Header */}
      <div className="bg-stone-100 border-b border-stone-200 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 bg-white h-6 rounded text-center text-xs text-stone-400 flex items-center justify-center">
          your-shop-name.com
        </div>
      </div>

      {/* Store Navigation */}
      <nav className="px-8 py-6 border-b border-stone-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6 text-stone-800 md:hidden" />
          <h1 className="text-2xl font-serif font-bold text-stone-800 tracking-tight">TIMBER & GRAIN</h1>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-stone-600">
          <span className="hover:text-stone-900 cursor-pointer">Shop All</span>
          <span className="hover:text-stone-900 cursor-pointer">Frames</span>
          <span className="hover:text-stone-900 cursor-pointer">Furniture</span>
          <span className="hover:text-stone-900 cursor-pointer">About</span>
        </div>
        <div className="flex gap-4 text-stone-800">
          <Search className="h-5 w-5 cursor-pointer" />
          <ShoppingCart className="h-5 w-5 cursor-pointer" />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-96 bg-stone-900 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1601065898512-838446b43947?auto=format&fit=crop&w=1200&q=80" 
          alt="Workshop" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-sm uppercase tracking-widest mb-3 text-amber-400 font-semibold">Handcrafted Quality</p>
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Decor with Deep Roots</h2>
          <button className="bg-white text-stone-900 px-8 py-3 uppercase text-xs font-bold tracking-wider hover:bg-amber-50 transition-colors">
            Shop The Collection
          </button>
        </div>
      </div>

      {/* Featured Products */}
      <div className="p-8 md:p-12 bg-stone-50 flex-1">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-xl font-bold text-stone-800">New Arrivals</h3>
            <p className="text-stone-500 text-sm">Fresh from the workshop bench.</p>
          </div>
          <a href="#" className="text-sm text-amber-700 underline">View all</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-3 aspect-[3/4]">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="h-4 w-4 text-stone-800" />
                </div>
                <button className="absolute bottom-0 left-0 right-0 bg-stone-900 text-white py-3 text-xs uppercase tracking-wider translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  Add to Cart
                </button>
              </div>
              <h4 className="font-medium text-stone-900">{product.name}</h4>
              <p className="text-sm text-stone-500">{product.category}</p>
              <p className="text-stone-800 mt-1 font-semibold">${product.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Mockup */}
      <div className="bg-stone-900 text-stone-400 py-12 px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h5 className="text-white font-bold mb-4">TIMBER & GRAIN</h5>
            <p className="text-sm mb-4">Sustainable wooden goods handcrafted with care for the modern home.</p>
            <div className="flex gap-4">
              <Instagram className="h-5 w-5 hover:text-white cursor-pointer" />
              <Facebook className="h-5 w-5 hover:text-white cursor-pointer" />
              <Mail className="h-5 w-5 hover:text-white cursor-pointer" />
            </div>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4">Customer Care</h5>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Shipping Info</li>
              <li className="hover:text-white cursor-pointer">Returns & Exchanges</li>
              <li className="hover:text-white cursor-pointer">Custom Orders</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-bold mb-4">Newsletter</h5>
            <div className="flex">
              <input type="email" placeholder="Email address" className="bg-stone-800 border-none text-sm px-4 py-2 w-full focus:ring-1 focus:ring-amber-500" />
              <button className="bg-amber-600 text-white px-4 text-sm font-medium">Join</button>
            </div>
          </div>
        </div>
        <div className="text-xs text-center pt-8 border-t border-stone-800">
          © 2024 Timber & Grain Mockup. Powered by TimberTrade.
        </div>
      </div>
    </div>
  );
};

export default StorePreview;