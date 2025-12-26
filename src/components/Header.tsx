import React from 'react';
import { ShoppingCart, UtensilsCrossed } from 'lucide-react'; // Added UtensilsCrossed
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useState, useEffect } from 'react'; // Added useState, useEffect

interface HeaderProps {
  // New props
  totalItems: number;
  openCart: () => void;
  handleNavClick: (section: string) => void;
  scrollToTop: () => void;
  // Old props kept for safety but made optional
  cartItemsCount?: number;
  onCartClick?: () => void;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ totalItems, openCart, handleNavClick, scrollToTop }) => {
  const { siteSettings } = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${isScrolled ? 'opacity-100 bg-iskina-green shadow-md' : 'opacity-0 bg-transparent'
          }`}
      />

      {/* Texture overlay for that "street" feel */}
      <div className={`absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300 ${isScrolled ? 'bg-[url("https://www.transparenttextures.com/patterns/cubes.png")]' : ''
        }`} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center cursor-pointer transform hover:scale-105 transition-transform duration-200" onClick={scrollToTop}>
            {siteSettings?.site_logo ? (
              <img
                src={siteSettings.site_logo}
                alt={siteSettings.site_name}
                className="w-12 h-12 rounded-full mr-3 object-cover shadow-lg ring-2 ring-white/20"
              />
            ) : (
              <div className="w-10 h-10 bg-iskina-gold rounded-full flex items-center justify-center mr-2 shadow-lg ring-2 ring-white/20">
                <UtensilsCrossed className="h-6 w-6 text-iskina-green" />
              </div>
            )}
            <div className="flex flex-col">
              <span className={`font-playfair font-bold text-xl tracking-wider ${isScrolled ? 'text-iskina-gold' : 'text-iskina-dark'
                }`}>
                {siteSettings?.site_name || 'ISKINA PUSO'}
              </span>
              <span className={`text-[10px] uppercase tracking-[0.2em] ${isScrolled ? 'text-white/80' : 'text-iskina-dark/80'
                }`}>
                One Stop Streetfood Shop
              </span>
            </div>
          </div>

          <nav className="flex items-center">

            <button
              onClick={openCart}
              className={`relative p-2 rounded-full transition-all duration-200 hover:scale-110 ${isScrolled
                ? 'text-white hover:bg-white/10'
                : 'text-iskina-dark hover:bg-black/10'
                }`}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-iskina-gold text-iskina-dark text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-bounce-gentle">
                  {totalItems}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;