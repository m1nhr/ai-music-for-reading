# Sceneria - AI Music Generator for Book Reading

An AI-powered application that generates ambient/instrumental music tailored to the mood and themes of books you're reading.

## Features

- **Book Search**: Search for books using the Google Books API
- **AI Music Generation**: Generate custom music using:
  - Gemini API to analyze book content and create music prompts
  - Replicate's MusicGen model to generate the actual music
- **Audio Playback**: Listen to generated music directly in the browser
- **Clean UI**: Beautiful, responsive interface built with Tailwind CSS

## Tech Stack

- **Next.js 14+** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **Replicate API** (MusicGen for music generation)
- **Google Gemini API** (for intelligent music prompt generation)
- **Google Books API** (for book search - no key needed)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
REPLICATE_API_TOKEN=your_replicate_token_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Get your API keys:**
- Replicate: https://replicate.com/account/api-tokens
- Gemini: https://makersuite.google.com/app/apikey

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Search for a Book**: Enter a book title or author in the search bar
2. **Select a Book**: Browse the search results and click "Generate Music" on any book
3. **Wait for Generation**: The AI will analyze the book and generate music (30-60 seconds)
4. **Listen**: Play the generated ambient music while you read!

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-music/
│   │       └── route.js          # Main API endpoint
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Main page component
│   └── globals.css               # Global styles
├── components/
│   ├── BookSearch.js             # Search input component
│   ├── BookList.js               # Book results display
│   └── AudioPlayer.js            # Audio player component
└── lib/
    ├── replicate.js              # Replicate API integration
    ├── gemini.js                 # Gemini API integration
    └── google-books.js           # Google Books API integration
```

## API Flow

When you click "Generate Music":

1. **Book Analysis**: Gemini API analyzes the book's title, description, and categories
2. **Prompt Generation**: Creates a specialized music prompt (e.g., "ambient electronic, mysterious, slow tempo...")
3. **Music Generation**: Replicate's MusicGen model generates 30 seconds of audio
4. **Playback**: Audio URL is returned and played in the browser

## Customization

### Adjust Music Duration

Edit [src/lib/replicate.js:17](src/lib/replicate.js#L17):

```javascript
duration: 30, // Change to desired length in seconds (max 30)
```

### Modify Music Prompt Template

Edit [src/lib/gemini.js:9-19](src/lib/gemini.js#L9-L19) to adjust the prompt format.

### Change MusicGen Model

In [src/lib/replicate.js:10](src/lib/replicate.js#L10), you can use:
- `stereo-melody-large` (current - best quality)
- `stereo-large`
- `melody`

## Future Enhancements

- [ ] Save favorite tracks to Supabase
- [ ] User authentication
- [ ] Share generated music
- [ ] Playlist creation
- [ ] Longer music generation
- [ ] More music styles and genres

## Important Notes

- Music generation takes 30-60 seconds due to AI processing
- The free tier of Replicate has rate limits
- Google Books API is free and doesn't require authentication for basic search

## License

MIT
