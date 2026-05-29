import React from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Tab system — horizontal or vertical tabs with animated indicator.
 */
export default function Tabs({ tabs = [], activeTab, onChange, className }) {
  return (
    <div className={cn('flex items-center gap-1 border-b border-border', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative px-5 py-3 text-body-sm font-medium transition-colors duration-200',
            activeTab === tab.id
              ? 'text-primary'
              : 'text-muted hover:text-secondary'
          )}
        >
          <span className="flex items-center gap-2">
            {tab.icon && <tab.icon className="w-4 h-4" />}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                'px-1.5 py-0.5 text-[10px] font-bold rounded-full',
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-surface text-muted'
              )}>
                {tab.count}
              </span>
            )}
          </span>

          {/* Animated underline */}
          {activeTab === tab.id && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
