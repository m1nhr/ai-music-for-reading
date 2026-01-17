'use client';

import { motion } from 'framer-motion';
import { Music, Zap } from 'lucide-react';

const PreferencesSelector = ({ preferences, onPreferencesChange }) => {
  const generalOptions = [
    { value: 'none', label: 'No preference' },
    { value: 'classical', label: 'Classical' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'nature', label: 'Nature' },
  ];

  const actionOptions = [
    { value: 'none', label: 'No preference' },
    { value: 'calm', label: 'Calm' },
    { value: 'action', label: 'Action' },
    { value: 'contemplating', label: 'Contemplating' },
  ];

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Music className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Music Style Preference</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {generalOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onPreferencesChange({ ...preferences, general: option.value })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                preferences.general === option.value
                  ? 'bg-black text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Mood Preference</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {actionOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onPreferencesChange({ ...preferences, action: option.value })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                preferences.action === option.value
                  ? 'bg-black text-white shadow-md scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PreferencesSelector;
