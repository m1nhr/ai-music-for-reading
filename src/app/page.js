'use client';

import { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BookBeats
          </h1>
          <p className="text-gray-600 text-lg">
            AI-generated music for your reading experience
          </p>
        </div>

        {/* Search */}
        <BookSearch onSearch={handleSearch} />

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-2xl mx-auto mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <div className="animate-pulse">
              <p className="text-lg font-semibold text-blue-700 mb-2">
                Generating your music...
              </p>
              <p className="text-sm text-blue-600">
                This may take 30-60 seconds. Please wait.
              </p>
            </div>
          </div>
        )}

        {/* Audio Player */}
        {generatedMusic && (
          <AudioPlayer
            audioUrl={generatedMusic.audioUrl}
            prompt={generatedMusic.prompt}
            bookTitle={generatedMusic.bookTitle}
          />
        )}

        {/* Book Results */}
        <BookList
          books={books}
          onGenerateMusic={handleGenerateMusic}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}
