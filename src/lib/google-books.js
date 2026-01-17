export async function searchBooks(query) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    const data = await response.json();

    return data.items?.map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description || 'No description available',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      categories: item.volumeInfo.categories || [],
    })) || [];
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
}

export async function getBookDetails(bookId) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch book details');
    }

    const item = await response.json();

    return {
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description || 'No description available',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || null,
      categories: item.volumeInfo.categories || [],
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
}
