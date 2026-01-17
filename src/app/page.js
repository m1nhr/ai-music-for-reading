'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, Music, Headphones, Search, BookmarkCheck, BookOpen } from 'lucide-react';
import BookSearch from '@/components/BookSearch';
import BookList from '@/components/BookList';
import AudioPlayer from '@/components/AudioPlayer';
import SavedItems from '@/components/SavedItems';
import { searchBooks } from '@/lib/google-books';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState(null);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('search'); // 'search' or 'saved'

  const handleSearch = async (query) => {
    try {
      setError(null);
      setIsSearching(true);
      const results = await searchBooks(query);
      setBooks(results);
    } catch (err) {
      setError('Failed to search books. Please try again.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenerateMusic = async (book) => {
    try {
      setError(null);
      setIsGenerating(true);
      setGeneratedMusic(null);

      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: book.title,
          description: book.description,
          categories: book.categories,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate music');
      }

      const data = await response.json();
      setGeneratedMusic({
        audioUrl: data.audioUrl,
        prompt: data.prompt,
        bookTitle: book.title,
        bookId: book.id,
        bookThumbnail: book.thumbnail,
      });
    } catch (err) {
      setError(err.message || 'Failed to generate music. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Sceneria
            </h1>

          </motion.div>

          <motion.p
            className="text-base sm:text-lg max-w-2xl mx-auto px-4"
            style={{ color: 'var(--color-text-secondary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Transform your reading experience with soundtracks tailored to your book&apos;s mood and atmosphere
          </motion.p>


        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="w-full max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex gap-2 p-1 rounded-lg border shadow-sm" style={{ backgroundColor: 'var(--color-surface-light)', borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setActiveView('search')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all shadow-md"
              style={activeView === 'search' ?
                { backgroundColor: 'var(--color-primary)', color: 'white' } :
                { color: 'var(--color-text-secondary)' }
              }
            >
              <Search className="w-5 h-5" />
              <span>Search Books</span>
            </button>
            <button
              onClick={() => setActiveView('saved')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all shadow-md"
              style={activeView === 'saved' ?
                { backgroundColor: 'var(--color-primary)', color: 'white' } :
                { color: 'var(--color-text-secondary)' }
              }
            >
              <BookmarkCheck className="w-5 h-5" />
              <span>My Library</span>
            </button>
          </div>
        </motion.div>

        {/* Search View */}
        {activeView === 'search' && (
          <>
            <BookSearch onSearch={handleSearch} />

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="w-full max-w-2xl mx-auto mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-900 font-medium">Error</p>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              className="w-full max-w-2xl mx-auto mt-8 p-8 border rounded-lg"
              style={{ backgroundColor: 'var(--color-surface-light)', borderColor: 'var(--color-border)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-8 h-8 text-white" />
                </motion.div>

                <motion.p
                  className="text-xl font-bold mb-2"
                  style={{ color: 'var(--color-text-primary)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Composing Your Soundtrack...
                </motion.p>

                <motion.p
                  className="text-sm mb-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Sceneria is crafting the perfect ambiance for your book
                </motion.p>

                <motion.div
                  className="flex items-center justify-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: 'var(--color-text-secondary)' }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>

                <p className="text-xs mt-6" style={{ color: 'var(--color-text-tertiary)' }}>
                  This usually takes 30-60 seconds
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

            {/* Audio Player */}
            <AnimatePresence mode="wait">
              {generatedMusic && (
                <AudioPlayer
                  audioUrl={generatedMusic.audioUrl}
                  prompt={generatedMusic.prompt}
                  bookTitle={generatedMusic.bookTitle}
                  bookId={generatedMusic.bookId}
                  bookThumbnail={generatedMusic.bookThumbnail}
                />
              )}
            </AnimatePresence>

            {/* Empty state - before first search */}
            {!isSearching && books.length === 0 && (
              <motion.div
                className="w-full max-w-2xl mx-auto mt-12 px-4 sm:px-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="text-center py-16">
                  <motion.div
                    className="inline-block p-6 rounded-full mb-6"
                    style={{ backgroundColor: 'var(--color-surface-light)' }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <BookOpen className="w-12 h-12" style={{ color: 'var(--color-text-tertiary)' }} />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Start your journey</h2>
                  <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                    Search for a book to create its perfect soundtrack
                  </p>
                </div>
              </motion.div>
            )}

            {/* Book Results */}
            {!isSearching && books.length > 0 && (
              <BookList
                books={books}
                onGenerateMusic={handleGenerateMusic}
                isGenerating={isGenerating}
              />
            )}

            {/* Searching state */}
            {isSearching && (
              <motion.div
                className="w-full max-w-2xl mx-auto mt-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: 'var(--color-text-secondary)' }} />
                <p style={{ color: 'var(--color-text-secondary)' }}>Searching for books...</p>
              </motion.div>
            )}
          </>
        )}

        {/* Saved Items View */}
        {activeView === 'saved' && <SavedItems />}
      </div>
    </div>
  );
}
