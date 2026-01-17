'use client';

import Image from 'next/image';

export default function BookList({ books, onGenerateMusic, isGenerating }) {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>
      <div className="grid gap-4">
        {books.map((book) => (
          <div
            key={book.id}
            className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white"
          >
            {book.thumbnail ? (
              <Image
                src={book.thumbnail}
                alt={book.title}
                width={80}
                height={120}
                className="rounded object-cover"
              />
            ) : (
              <div className="w-20 h-30 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-xs">No image</span>
              </div>
            )}

            <div className="flex-1">
              <h3 className="font-bold text-lg">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {book.authors.join(', ')}
              </p>
              <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                {book.description}
              </p>
              <button
                onClick={() => onGenerateMusic(book)}
                disabled={isGenerating}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isGenerating ? 'Generating...' : 'Generate Music'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
