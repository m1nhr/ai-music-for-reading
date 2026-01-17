import { NextResponse } from 'next/server';
import { generateMusicPrompt } from '@/lib/gemini';
import { generateMusic } from '@/lib/replicate';

export async function POST(request) {
  try {
    const { title, description, categories, preferences } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Book title is required' },
        { status: 400 }
      );
    }

    // Step 1: Generate music prompt using Gemini
    console.log('Generating music prompt for:', title);
    console.log('User preferences:', preferences);
    const musicPrompt = await generateMusicPrompt(title, description, categories, preferences);
    console.log('Generated prompt:', musicPrompt);

    // Step 2: Generate music using Replicate
    console.log('Generating music with Replicate...');
    const audioUrl = await generateMusic(musicPrompt);
    console.log('Music generated:', audioUrl);

    return NextResponse.json({
      prompt: musicPrompt,
      audioUrl: audioUrl,
    });
  } catch (error) {
    console.error('Error in generate-music API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate music' },
      { status: 500 }
    );
  }
}
