import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateMusicPrompt(bookTitle, bookDescription, categories, preferences = null) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Build preference instructions
    let preferenceInstructions = '';
    if (preferences) {
      if (preferences.general && preferences.general !== 'none') {
        const styleGuides = {
          classical: 'Use classical music elements like orchestral instruments (strings, piano, woodwinds). Think traditional, timeless compositions.',
          electronic: 'Use electronic and synthesized sounds, digital textures, and modern production techniques.',
          minimalist: 'Keep it simple and sparse. Use minimal instrumentation, repetitive patterns, and space/silence as an element.',
          nature: 'Incorporate natural sounds or organic instruments. Think ambient nature sounds, acoustic instruments, earthy tones.'
        };
        preferenceInstructions += `\nSTYLE PREFERENCE: ${styleGuides[preferences.general] || preferences.general}`;
      }

      if (preferences.action && preferences.action !== 'none') {
        const moodGuides = {
          calm: 'Focus on peaceful, relaxing, tranquil elements. Slow tempo, gentle dynamics, soothing atmosphere.',
          action: 'Make it energetic and dynamic. Faster tempo, driving rhythm, exciting and engaging atmosphere.',
          contemplating: 'Create a thoughtful, introspective mood. Medium-slow tempo, reflective and meditative atmosphere.'
        };
        preferenceInstructions += `\nMOOD PREFERENCE: ${moodGuides[preferences.action] || preferences.action}`;
      }

      if (preferenceInstructions) {
        preferenceInstructions += '\n\nIMPORTANT: Incorporate these user preferences while still matching the book\'s content and atmosphere.';
      }
    }

    const prompt = `You are a music director. Given a book's title and description, generate a short music prompt for an AI music generator. The music will be played while someone reads this book.

Output ONLY the prompt, nothing else. Keep it under 50 words.

Format: [genre], [mood], [tempo], [instruments], [atmosphere], instrumental, no vocals

Example for "Dune": ambient electronic, epic and mysterious, slow tempo, deep synths, sparse percussion, desert atmosphere, middle-eastern scales, instrumental, no vocals
${preferenceInstructions}

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
