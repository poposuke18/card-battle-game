// src/components/ui/SoundControl.tsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { SoundManager } from '@/utils/sound/SoundManager';

export function SoundControl() {
  const [isMuted, setIsMuted] = useState(false);

  const handleToggle = () => {
    const soundManager = SoundManager.getInstance();
    soundManager.toggleMute();
    setIsMuted(!isMuted);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className="fixed top-4 right-4 z-50 p-2 bg-gray-800/50 backdrop-blur-sm rounded-full
                 hover:bg-gray-700/50 transition-colors"
      aria-label={isMuted ? "サウンドをオンにする" : "サウンドをオフにする"}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-gray-300" />
      ) : (
        <Volume2 className="w-6 h-6 text-gray-300" />
      )}
    </motion.button>
  );
}