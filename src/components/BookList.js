'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, BookOpen, Loader2, Sparkles, Bookmark, BookmarkCheck } from 'lucide-react';
import { saveBook, unsaveBook, isBookSaved } from '@/lib/storage';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function BookCard({ book, onGenerateMusic, isGenerating }) {
  const [isSaved, setIsSaved] = useState(() => isBookSaved(book.id));

  const toggleSave = () => {
    if (isSaved) {
      unsaveBook(book.id);
      setIsSaved(false);
    } else {
      saveBook(book);
      setIsSaved(true);
    }
  };

  return (
    <motion.div
      variants={item}
      layout
      className="group relative"
    >
      <motion.div
        className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 bg-white rounded-lg border border-gray-300 hover:border-black hover:border-2 transition-all duration-300"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {/* Book Cover */}
        <motion.div
          className="flex-shrink-0 mx-auto sm:mx-0"
          whileHover={{ scale: 1.05, rotate: -2 }}
          transition={{ duration: 0.3 }}
        >
          {book.thumbnail ? (
            <div className="relative">
              <Image
                src={book.thumbnail}
                alt={book.title}
                width={100}
                height={150}
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
          ) : (
            <div className="w-[100px] h-[150px] bg-gray-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </motion.div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg sm:text-xl text-black line-clamp-2 group-hover:text-gray-700 transition-colors flex-1">
              {book.title}
            </h3>

            {/* Save bookmark button */}
            <motion.button
              onClick={toggleSave}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                isSaved
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isSaved ? 'Unsave book' : 'Save book'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </motion.button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <p className="text-gray-600 text-sm">
              {book.authors.join(', ')}
            </p>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4">
            {book.description || 'No description available'}
          </p>

          {/* Categories */}
          {book.categories && book.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {book.categories.slice(0, 3).map((category, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* Generate Button */}
          <motion.button
            onClick={() => onGenerateMusic(book)}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: isGenerating ? 1 : 1.02 }}
            whileTap={{ scale: isGenerating ? 1 : 0.98 }}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Music className="w-4 h-4" />
                <span>Generate Soundtrack</span>
                <Sparkles className="w-4 h-4 opacity-70" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BookList({ books, onGenerateMusic, isGenerating }) {
  if (books.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto mt-12 px-4 sm:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <motion.div
        className="flex items-center gap-2 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <BookOpen className="w-6 h-6 text-black" />
        <h2 className="text-2xl font-bold text-black">
          Search Results
        </h2>
        <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          {books.length}
        </span>
      </motion.div>

      <motion.div
        className="grid gap-4 sm:gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onGenerateMusic={onGenerateMusic}
              isGenerating={isGenerating}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
