'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkCheck, Music2, BookOpen, Play, Trash2, Library } from 'lucide-react';
import { getSavedBooks, getSavedAudios, unsaveBook, unsaveAudio } from '@/lib/storage';
import AudioPlayer from './AudioPlayer';

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

function SavedBookCard({ book, onRemove }) {
  const handleRemove = () => {
    unsaveBook(book.id);
    onRemove();
  };

  return (
    <motion.div
      variants={item}
      layout
      className="group relative"
    >
      <motion.div
        className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 rounded-lg border transition-all duration-300"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}
        whileHover={{ y: -4, borderColor: 'var(--color-primary)' }}
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
            <div className="w-[100px] h-[150px] rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-light)' }}>
              <BookOpen className="w-8 h-8" style={{ color: 'var(--color-text-tertiary)' }} />
            </div>
          )}
        </motion.div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg sm:text-xl line-clamp-2 transition-colors flex-1" style={{ color: 'var(--color-text-primary)' }}>
              {book.title}
            </h3>

            {/* Remove button */}
            <motion.button
              onClick={handleRemove}
              className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Remove from saved"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {book.authors?.join(', ') || 'Unknown author'}
            </p>
          </div>

          <p className="text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            {book.description || 'No description available'}
          </p>

          {/* Categories */}
          {book.categories && book.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {book.categories.slice(0, 3).map((category, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-md text-xs font-medium"
                  style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-text-primary)' }}
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SavedAudioCard({ audio, onRemove, onPlay }) {
  const handleRemove = () => {
    unsaveAudio(audio.id);
    onRemove();
  };

  return (
    <motion.div
      variants={item}
      layout
      className="group relative"
    >
      <motion.div
        className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 rounded-lg border transition-all duration-300"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)'
        }}
        whileHover={{ y: -4, borderColor: 'var(--color-primary)' }}
        transition={{ duration: 0.2 }}
      >
        {/* Book Cover */}
        <motion.div
          className="flex-shrink-0 mx-auto sm:mx-0"
          whileHover={{ scale: 1.05, rotate: -2 }}
          transition={{ duration: 0.3 }}
        >
          {audio.bookThumbnail ? (
            <div className="relative">
              <Image
                src={audio.bookThumbnail}
                alt={audio.bookTitle}
                width={100}
                height={150}
                className="rounded-lg shadow-lg object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Music2 className="w-8 h-8 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-[100px] h-[150px] rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-light)' }}>
              <Music2 className="w-8 h-8" style={{ color: 'var(--color-text-tertiary)' }} />
            </div>
          )}
        </motion.div>

        {/* Audio Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg sm:text-xl line-clamp-2 transition-colors" style={{ color: 'var(--color-text-primary)' }}>
                {audio.bookTitle}
              </h3>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Soundtrack</p>
            </div>

            {/* Remove button */}
            <motion.button
              onClick={handleRemove}
              className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Remove from saved"
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Music Prompt */}
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface-light)' }}>
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
              {audio.musicPrompt}
            </p>
          </div>

          {/* Play button */}
          <motion.button
            onClick={() => onPlay(audio)}
            className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--color-primary)' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-4 h-4" />
            <span className="text-sm font-medium">Play Audio</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SavedItems() {
  const [savedBooks, setSavedBooks] = useState([]);
  const [savedAudios, setSavedAudios] = useState([]);
  const [activeTab, setActiveTab] = useState('books');
  const [playingAudio, setPlayingAudio] = useState(null);

  const loadSavedItems = () => {
    setSavedBooks(getSavedBooks());
    setSavedAudios(getSavedAudios());
  };

  useEffect(() => {
    loadSavedItems();
  }, []);

  const hasNoSavedItems = savedBooks.length === 0 && savedAudios.length === 0;

  if (hasNoSavedItems) {
    return (
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
            <Library className="w-12 h-12" style={{ color: 'var(--color-text-tertiary)' }} />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>No saved items yet</h2>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            Start saving books and audio tracks to build your library
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto mt-12 px-4 sm:px-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header with tabs */}
      <div className="mb-6">
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <BookmarkCheck className="w-6 h-6" style={{ color: 'var(--color-text-primary)' }} />
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>My Library</h2>
        </motion.div>

        {/* Tab buttons */}
        <div className="flex gap-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('books')}
            className="px-4 py-2 font-medium transition-all"
            style={activeTab === 'books' ?
              { color: 'var(--color-text-primary)', borderBottom: '2px solid var(--color-primary)' } :
              { color: 'var(--color-text-secondary)' }
            }
          >
            Saved Books ({savedBooks.length})
          </button>
          <button
            onClick={() => setActiveTab('audios')}
            className="px-4 py-2 font-medium transition-all"
            style={activeTab === 'audios' ?
              { color: 'var(--color-text-primary)', borderBottom: '2px solid var(--color-primary)' } :
              { color: 'var(--color-text-secondary)' }
            }
          >
            Saved Audios ({savedAudios.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'books' && (
          <motion.div
            key="books"
            className="grid gap-4 sm:gap-6"
            variants={container}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            {savedBooks.length === 0 ? (
              <motion.div
                variants={item}
                className="text-center py-12 rounded-lg border"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
                <p style={{ color: 'var(--color-text-secondary)' }}>No saved books yet</p>
              </motion.div>
            ) : (
              savedBooks.map((book) => (
                <SavedBookCard
                  key={book.id}
                  book={book}
                  onRemove={loadSavedItems}
                />
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'audios' && (
          <motion.div
            key="audios"
            className="grid gap-4 sm:gap-6"
            variants={container}
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            {savedAudios.length === 0 ? (
              <motion.div
                variants={item}
                className="text-center py-12 rounded-lg border"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <Music2 className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-text-tertiary)' }} />
                <p style={{ color: 'var(--color-text-secondary)' }}>No saved audio tracks yet</p>
              </motion.div>
            ) : (
              savedAudios.map((audio) => (
                <SavedAudioCard
                  key={audio.id}
                  audio={audio}
                  onRemove={loadSavedItems}
                  onPlay={setPlayingAudio}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Player */}
      {playingAudio && (
        <AudioPlayer
          audioUrl={playingAudio.audioUrl}
          prompt={playingAudio.musicPrompt}
          bookTitle={playingAudio.bookTitle}
          bookId={playingAudio.bookId}
          bookThumbnail={playingAudio.bookThumbnail}
        />
      )}
    </motion.div>
  );
}
