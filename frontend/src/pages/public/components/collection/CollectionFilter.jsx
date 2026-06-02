import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { categories, sortOptions } from './data';
import { cn } from '@/lib/utils';
import Dropdown, { DropdownItem } from '@/components/ui/Dropdown';

export default function CollectionFilter({ 
  activeCategory, 
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy
}) {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card p-2 md:p-3 flex flex-col lg:flex-row items-center justify-between gap-4 sticky top-[100px] z-40"
      >
        {/* Categories - Scrollable on mobile */}
        <div className="flex-1 w-full overflow-x-auto no-scrollbar mask-edges flex items-center gap-1 pb-2 lg:pb-0">
          <div className="flex items-center min-w-max px-2 gap-2">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(isActive && category !== 'All Vehicles' ? 'All Vehicles' : category)}
                  className={cn(
                    'relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300',
                    isActive ? 'text-primary' : 'text-secondary hover:text-primary hover:bg-surface/50'
                  )}
                >
                  <span className="relative z-10">{category}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-accent/10 border border-accent/20 rounded-full -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex items-center gap-3 w-full lg:w-auto px-2 lg:px-0">
          {/* Search Bar */}
          <div className="relative group flex-1 lg:w-[240px]">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search luxury vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface/50 border border-border/50 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-all placeholder:text-muted/70 text-primary"
            />
          </div>

          {/* Sort Dropdown */}
          <Dropdown
            align="right"
            className="w-[200px]"
            trigger={
              <button className="flex items-center justify-between gap-2 bg-surface/50 border border-border/50 rounded-full px-5 py-2.5 text-sm font-medium text-primary hover:bg-surface transition-colors min-w-[140px]">
                <span className="truncate">{sortBy}</span>
                <ChevronDown className="w-4 h-4 text-muted" />
              </button>
            }
          >
            {sortOptions.map((option) => (
              <DropdownItem 
                key={option} 
                onClick={() => setSortBy(option)}
                className={sortBy === option ? 'text-accent bg-accent/5' : ''}
              >
                {option}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      </motion.div>
    </div>
  );
}
