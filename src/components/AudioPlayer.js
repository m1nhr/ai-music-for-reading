'use client';

export default function AudioPlayer({ audioUrl, prompt, bookTitle }) {
  if (!audioUrl) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 border border-gray-200 rounded-lg bg-white shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Generated Music</h2>
      <p className="text-gray-600 mb-4">For: {bookTitle}</p>

      <audio controls className="w-full mb-4">
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold text-sm text-gray-700 mb-2">Music Prompt:</h3>
        <p className="text-sm text-gray-600">{prompt}</p>
      </div>
    </div>
  );
}
