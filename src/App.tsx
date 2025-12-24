import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import Header from './components/Header';
import SubNav from './components/SubNav';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import FloatingCartButton from './components/FloatingCartButton';
import AdminDashboard from './components/AdminDashboard';
import StoreClosedModal from './components/StoreClosedModal';
import RoomModal from './components/RoomModal';
import { useSiteSettings } from './hooks/useSiteSettings';
import { useMenu } from './hooks/useMenu';

function MainApp() {
  const cart = useCart();
  const { menuItems } = useMenu();
  const { siteSettings, loading: settingsLoading } = useSiteSettings();
  const [currentView, setCurrentView] = React.useState<'menu' | 'cart' | 'checkout'>('menu');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [roomNumber, setRoomNumber] = React.useState<string>('');
  const [showRoomModal, setShowRoomModal] = React.useState(true);

  // Check store status
  const [isStoreClosed, setIsStoreClosed] = React.useState(false);

  React.useEffect(() => {
    if (siteSettings) {
      if (siteSettings.is_temporarily_closed) {
        setIsStoreClosed(true);
        return;
      }

      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const [openHour, openMinute] = siteSettings.opening_time.split(':').map(Number);
      const [closeHour, closeMinute] = siteSettings.closing_time.split(':').map(Number);

      const openTime = openHour * 60 + openMinute;
      const closeTime = closeHour * 60 + closeMinute;

      // Handle overnight hours (e.g. 10 PM to 2 AM)
      let isOpen = false;
      if (closeTime < openTime) {
        isOpen = currentTime >= openTime || currentTime <= closeTime;
      } else {
        isOpen = currentTime >= openTime && currentTime <= closeTime;
      }

      setIsStoreClosed(!isOpen);
    }
  }, [siteSettings]);

  const handleRoomSubmit = (room: string) => {
    setRoomNumber(room);
    setShowRoomModal(false);
  };

  const handleViewChange = (view: 'menu' | 'cart' | 'checkout') => {
    setCurrentView(view);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Filter menu items based on selected category
  const filteredMenuItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  // Scroll handlers
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-iskina-warm flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iskina-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-iskina-warm font-inter pt-20">
      <StoreClosedModal
        isOpen={isStoreClosed}
        openingTime={siteSettings?.opening_time || ''}
        closingTime={siteSettings?.closing_time || ''}
        isTemporarilyClosed={siteSettings?.is_temporarily_closed || false}
      />
      {!isStoreClosed && <RoomModal isOpen={showRoomModal} onSubmit={handleRoomSubmit} />}

      <Header
        totalItems={cart.getTotalItems()}
        openCart={() => handleViewChange('cart')}
        handleNavClick={(section) => {
          handleViewChange('menu');
          // simple mapping for now
          if (section === 'menu') scrollToSection('menu-section');
          if (section === 'about') scrollToSection('about-section'); // Assumes these IDs exist
          if (section === 'location') scrollToSection('location-section');
        }}
        scrollToTop={scrollToTop}
        // keeping old props for now to satisfy TS if interface didn't update (though I updated interface in Header.tsx)
        cartItemsCount={cart.getTotalItems()}
        onCartClick={() => handleViewChange('cart')}
        onMenuClick={() => handleViewChange('menu')}
      />

      {/* Hero section removed */}

      <SubNav selectedCategory={selectedCategory} onCategoryClick={handleCategoryClick} />

      {currentView === 'menu' && (
        <Menu
          menuItems={filteredMenuItems}
          addToCart={cart.addToCart}
          cartItems={cart.cartItems}
          updateQuantity={cart.updateQuantity}
        />
      )}

      {currentView === 'cart' && (
        <Cart
          cartItems={cart.cartItems}
          updateQuantity={cart.updateQuantity}
          removeFromCart={cart.removeFromCart}
          clearCart={cart.clearCart}
          getTotalPrice={cart.getTotalPrice}
          onContinueShopping={() => handleViewChange('menu')}
          onCheckout={() => handleViewChange('checkout')}
        />
      )}

      {currentView === 'checkout' && (
        <Checkout
          cartItems={cart.cartItems}
          totalPrice={cart.getTotalPrice()}
          onBack={() => handleViewChange('cart')}
          initialRoomNumber={roomNumber}
        />
      )}

      {currentView === 'menu' && (
        <FloatingCartButton
          itemCount={cart.getTotalItems()}
          onCartClick={() => handleViewChange('cart')}
        />
      )}

    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;