/**
 * localStorage utility functions for saving books and audio
 */

const SAVED_BOOKS_KEY = 'bookbeats_saved_books';
const SAVED_AUDIOS_KEY = 'bookbeats_saved_audios';

/**
 * Save a book to localStorage
 * @param {Object} book - Book object with id, title, authors, description, thumbnail, categories
 */
export function saveBook(book) {
  try {
    const saved = getSavedBooks();
    // Check if already saved
    if (saved.some(b => b.id === book.id)) {
      return { success: false, message: 'Book already saved' };
    }

    saved.push({
      ...book,
      savedAt: new Date().toISOString()
    });

    localStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify(saved));
    return { success: true, message: 'Book saved successfully' };
  } catch (error) {
    console.error('Error saving book:', error);
    return { success: false, message: 'Failed to save book' };
  }
}

/**
 * Remove a book from saved books
 * @param {string} bookId - Book ID to remove
 */
export function unsaveBook(bookId) {
  try {
    const saved = getSavedBooks();
    const filtered = saved.filter(b => b.id !== bookId);
    localStorage.setItem(SAVED_BOOKS_KEY, JSON.stringify(filtered));
    return { success: true, message: 'Book removed' };
  } catch (error) {
    console.error('Error removing book:', error);
    return { success: false, message: 'Failed to remove book' };
  }
}

/**
 * Get all saved books
 * @returns {Array} Array of saved book objects
 */
export function getSavedBooks() {
  try {
    const saved = localStorage.getItem(SAVED_BOOKS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error getting saved books:', error);
    return [];
  }
}

/**
 * Check if a book is saved
 * @param {string} bookId - Book ID to check
 * @returns {boolean}
 */
export function isBookSaved(bookId) {
  const saved = getSavedBooks();
  return saved.some(b => b.id === bookId);
}

/**
 * Save generated audio with book info
 * @param {Object} audioData - Object with audioUrl, musicPrompt, bookTitle, bookId, bookThumbnail
 */
export function saveAudio(audioData) {
  try {
    const saved = getSavedAudios();

    // Check if already saved (by bookId)
    if (saved.some(a => a.bookId === audioData.bookId)) {
      return { success: false, message: 'Audio for this book already saved' };
    }

    saved.push({
      ...audioData,
      savedAt: new Date().toISOString(),
      id: `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    localStorage.setItem(SAVED_AUDIOS_KEY, JSON.stringify(saved));
    return { success: true, message: 'Audio saved successfully' };
  } catch (error) {
    console.error('Error saving audio:', error);
    return { success: false, message: 'Failed to save audio' };
  }
}

/**
 * Remove saved audio
 * @param {string} audioId - Audio ID to remove
 */
export function unsaveAudio(audioId) {
  try {
    const saved = getSavedAudios();
    const filtered = saved.filter(a => a.id !== audioId);
    localStorage.setItem(SAVED_AUDIOS_KEY, JSON.stringify(filtered));
    return { success: true, message: 'Audio removed' };
  } catch (error) {
    console.error('Error removing audio:', error);
    return { success: false, message: 'Failed to remove audio' };
  }
}

/**
 * Get all saved audios
 * @returns {Array} Array of saved audio objects
 */
export function getSavedAudios() {
  try {
    const saved = localStorage.getItem(SAVED_AUDIOS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error getting saved audios:', error);
    return [];
  }
}

/**
 * Check if audio for a book is saved
 * @param {string} bookId - Book ID to check
 * @returns {boolean}
 */
export function isAudioSaved(bookId) {
  const saved = getSavedAudios();
  return saved.some(a => a.bookId === bookId);
}
