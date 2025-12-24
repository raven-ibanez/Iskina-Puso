import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories, loading } = useCategories();

  return (
    <div className="sticky top-20 z-40 bg-iskina-warm/95 backdrop-blur-md border-b border-black/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start md:justify-center space-x-2 overflow-x-auto py-4 scrollbar-hide">
          {loading ? (
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => onCategoryClick('all')}
                className={`px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${selectedCategory === 'all'
                  ? 'bg-iskina-green text-white shadow-md transform scale-105'
                  : 'bg-transparent text-iskina-dark/70 hover:text-iskina-dark hover:bg-black/5'
                  }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCategoryClick(c.id)}
                  className={`px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${selectedCategory === c.id
                    ? 'bg-iskina-green text-white shadow-md transform scale-105'
                    : 'bg-transparent text-iskina-dark/70 hover:text-iskina-dark hover:bg-black/5'
                    }`}
                >
                  {c.name}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubNav;


