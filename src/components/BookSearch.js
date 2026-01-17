'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

export default function BookSearch({ onSearch }) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    await onSearch(query);
    setIsLoading(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <motion.div
          className="flex items-center gap-3 border rounded-lg transition-all duration-300 shadow-sm"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: isFocused ? 'var(--color-primary)' : 'var(--color-border)'
          }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="pl-5" style={{ color: 'var(--color-text-tertiary)' }}>
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for a book to create its soundtrack..."
            className="flex-1 px-2 py-4 bg-transparent focus:outline-none"
            style={{ color: 'var(--color-text-primary)' }}
            disabled={isLoading}
          />
          <motion.button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="mr-2 px-6 py-2.5 text-white rounded-lg font-medium disabled:cursor-not-allowed transition-all flex items-center gap-2"
            style={{
              backgroundColor: (isLoading || !query.trim()) ? 'var(--color-border)' : 'var(--color-primary)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <span className="hidden sm:inline">Searching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>


    </motion.form>
  );
}
