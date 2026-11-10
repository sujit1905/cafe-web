import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 border border-border shadow-xl space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-ivory-dark flex items-center justify-center text-espresso mx-auto border border-border">
          <Coffee className="w-10 h-10 text-terracotta" />
        </div>

        <div>
          <span className="font-serif text-6xl font-bold text-espresso tracking-tight">
            404
          </span>
          <h1 className="font-serif text-2xl font-bold text-espresso mt-2">
            Oops! Cup is Empty
          </h1>
          <p className="mt-2 text-sm text-latte leading-relaxed">
            The page you're searching for doesn't exist, has been brewed away, or moved elsewhere.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-terracotta hover:bg-terracotta-dark text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/menu"
            className="px-5 py-3 bg-ivory hover:bg-ivory-dark border border-border text-espresso rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <span>Explore Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
