'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Download, Music2, Sparkles, Bookmark, BookmarkCheck } from 'lucide-react';
import { saveAudio, unsaveAudio, isAudioSaved } from '@/lib/storage';

export default function AudioPlayer({ audioUrl, prompt, bookTitle, bookId, bookThumbnail }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const audioRef = useRef(null);

  // Check if audio is saved on mount
  useEffect(() => {
    if (bookId) {
      setIsSaved(isAudioSaved(bookId));
    }
  }, [bookId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(1);
      if (audioRef.current) audioRef.current.volume = 1;
    } else {
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    }
    setIsMuted(!isMuted);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleSave = () => {
    if (isSaved) {
      // Find and remove the saved audio
      const savedAudios = JSON.parse(localStorage.getItem('bookbeats_saved_audios') || '[]');
      const audioToRemove = savedAudios.find(a => a.bookId === bookId);
      if (audioToRemove) {
        unsaveAudio(audioToRemove.id);
        setIsSaved(false);
      }
    } else {
      // Save the audio
      const result = saveAudio({
        audioUrl,
        musicPrompt: prompt,
        bookTitle,
        bookId,
        bookThumbnail
      });
      if (result.success) {
        setIsSaved(true);
      }
    }
  };

  if (!audioUrl) {
    return null;
  }

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto mt-8 px-4 sm:px-0"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative bg-white rounded-lg border border-[#D4C4B0] overflow-hidden">
        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <motion.div
              className="flex items-center gap-3 mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-2 bg-[#8B7355] rounded-lg">
                <Music2 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#3D3429]">
                Generated Soundtrack
              </h2>
              <Sparkles className="w-5 h-5 text-[#A08968] animate-pulse" />
            </motion.div>
            <motion.p
              className="text-[#6B5D4F] text-sm sm:text-base ml-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {bookTitle}
            </motion.p>
          </div>

          {/* Audio element */}
          <audio ref={audioRef} src={audioUrl} />

          {/* Waveform visualization placeholder */}
          <div className="mb-6 h-16 sm:h-20 flex items-end justify-center gap-1 bg-[#F5F1E8] rounded-lg p-4">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-[#A08968] rounded-full"
                initial={{ height: '20%' }}
                animate={{
                  height: isPlaying ? ['20%', '80%', '20%'] : '20%',
                }}
                transition={{
                  duration: 1,
                  repeat: isPlaying ? Infinity : 0,
                  delay: i * 0.05,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-[#E8E1D5] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8B7355] [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#6B5D4F] mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* Play/Pause */}
            <motion.button
              onClick={togglePlayPause}
              className="p-4 bg-[#8B7355] text-white rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" fill="currentColor" />
              ) : (
                <Play className="w-6 h-6" fill="currentColor" />
              )}
            </motion.button>

            {/* Volume control */}
            <div className="hidden sm:flex items-center gap-2 flex-1 max-w-xs">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-[#E8E1D5] rounded-lg transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-[#6B5D4F]" />
                ) : (
                  <Volume2 className="w-5 h-5 text-[#6B5D4F]" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-[#E8E1D5] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8B7355] [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Save button */}
            <motion.button
              onClick={toggleSave}
              className={`p-3 rounded-lg transition-colors ${
                isSaved
                  ? 'bg-[#8B7355] text-white'
                  : 'bg-[#E8E1D5] text-[#8B7355] hover:bg-[#D4C4B0]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isSaved ? 'Unsave audio' : 'Save audio'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </motion.button>

            {/* Download button */}
            <motion.a
              href={audioUrl}
              download
              className="p-3 bg-[#E8E1D5] text-[#8B7355] rounded-lg hover:bg-[#D4C4B0] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5" />
            </motion.a>
          </div>

          {/* Prompt toggle */}
          <motion.button
            onClick={() => setShowPrompt(!showPrompt)}
            className="mt-6 w-full text-left px-4 py-3 bg-[#F5F1E8] rounded-lg border border-[#E8E1D5] hover:border-[#D4C4B0] transition-all"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#6B5D4F]">
                View Music Prompt
              </span>
              <motion.div
                animate={{ rotate: showPrompt ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-5 h-5 text-[#9A8B7A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </div>
          </motion.button>

          <AnimatePresence>
            {showPrompt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 p-4 bg-[#E8E1D5] rounded-lg">
                  <p className="text-sm text-[#6B5D4F] leading-relaxed">
                    {prompt}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
