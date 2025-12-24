import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-iskina-green">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541533848490-bc9c304c3d69?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-iskina-dark/80 via-transparent to-iskina-dark/30"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <span className="inline-block py-1 px-3 rounded-full bg-iskina-gold/20 text-iskina-gold border border-iskina-gold/30 backdrop-blur-sm text-sm font-medium tracking-widest uppercase mb-6 animate-fade-in">
          Authentic Street Food Experience
        </span>

        <h1 className="text-6xl md:text-8xl font-playfair font-bold text-white mb-8 animate-slide-up leading-tight">
          ISKINA <span className="text-iskina-gold">PUSO</span>
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light tracking-wide animate-slide-up animation-delay-200">
          Your one-stop shop for craving-satisfying street food delights.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-slide-up animation-delay-300">
          <a
            href="#menu"
            className="group relative px-8 py-4 bg-iskina-gold overflow-hidden rounded-full shadow-lg hover:shadow-iskina-gold/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative text-iskina-dark font-bold tracking-wider group-hover:tracking-widest transition-all duration-300">
              ORDER NOW
            </span>
          </a>

          <a
            href="#about"
            className="group px-8 py-4 text-white border border-white/30 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
          >
            <span className="font-medium tracking-wide group-hover:text-iskina-gold transition-colors">
              VIEW LOCATIONS
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-12 rounded-full border-2 border-white/20 flex justify-center p-1">
          <div className="w-1 h-3 bg-iskina-gold rounded-full animate-scroll"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;