import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateMusicPrompt(bookTitle, bookDescription, categories) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `You are a music director. Given a book's title and description, generate a short music prompt for an AI music generator. The music will be played while someone reads this book.

Output ONLY the prompt, nothing else. Keep it under 50 words.

Format: [genre], [mood], [tempo], [instruments], [atmosphere], instrumental, no vocals

Example for "Dune": ambient electronic, epic and mysterious, slow tempo, deep synths, sparse percussion, desert atmosphere, middle-eastern scales, instrumental, no vocals

Book Title: ${bookTitle}
Description: ${bookDescription || 'No description available'}
Categories: ${categories?.join(', ') || 'General'}

Generate a music prompt:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Error generating music prompt:', error);
    console.error('Error details:', error.message);
    throw new Error(`Failed to generate music prompt: ${error.message}`);
  }
}
