'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, Music, Headphones } from 'lucide-react';
import BookSearch from '@/components/BookSearch';
import BookList from '@/components/BookList';
import AudioPlayer from '@/components/AudioPlayer';
import { searchBooks } from '@/lib/google-books';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState(null);
  const [error, setError] = useState(null);

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
      });
    } catch (err) {
      setError(err.message || 'Failed to generate music. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
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
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Headphones className="w-10 h-10 sm:w-12 sm:h-12 text-[#A08968]" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#8B7355]">
              BookBeats
            </h1>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <Music className="w-10 h-10 sm:w-12 sm:h-12 text-[#A08968]" />
            </motion.div>
          </motion.div>

          <motion.p
            className="text-[#6B5D4F] text-base sm:text-lg max-w-2xl mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Transform your reading experience with AI-generated soundtracks tailored to your book&apos;s mood and atmosphere
          </motion.p>

          {/* Feature badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {['🎵 AI-Powered', '📚 Book-Themed', '🎧 Immersive', '✨ Unique'].map((badge, i) => (
              <motion.span
                key={badge}
                className="px-3 py-1 bg-[#E8E1D5] text-[#6B5D4F] rounded-full text-xs sm:text-sm font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {badge}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Search */}
        <BookSearch onSearch={handleSearch} />

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="w-full max-w-2xl mx-auto mt-6 p-4 bg-[#F9E5D9] border border-[#D4A574] rounded-lg"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[#8B6914] font-medium">Error</p>
                  <p className="text-[#6B5D4F] text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-[#A08968] hover:text-[#8B7355] transition-colors"
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
              className="w-full max-w-2xl mx-auto mt-8 p-8 bg-[#EDE5D8] border border-[#D4C4B0] rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-[#C9B89A] rounded-full mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-8 h-8 text-[#F5F1E8]" />
                </motion.div>

                <motion.p
                  className="text-xl font-bold text-[#8B7355] mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Composing Your Soundtrack...
                </motion.p>

                <motion.p
                  className="text-sm text-[#6B5D4F] mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Our AI is crafting the perfect ambiance for your book
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
                      className="w-2 h-2 bg-[#A08968] rounded-full"
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>

                <p className="text-xs text-[#9A8B7A] mt-6">
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
            />
          )}
        </AnimatePresence>

        {/* Book Results */}
        {!isSearching && (
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
            <Loader2 className="w-8 h-8 text-[#A08968] animate-spin mx-auto mb-3" />
            <p className="text-[#6B5D4F]">Searching for books...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
