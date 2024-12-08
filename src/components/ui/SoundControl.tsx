'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { SoundManager } from '@/utils/sound/SoundManager';

export function SoundControl() {
  const [isMuted, setIsMuted] = useState(false);
  
  useEffect(() => {
    const soundManager = SoundManager.getInstance();
    
    // ページロード時にBGM再生
    if (!isMuted) {
      soundManager.playBGM();
    }
    
    return () => {
      soundManager.pauseBGM();
    };
  }, [isMuted]);

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
      className="fixed top-4 right-4 p-2 bg-gray-800/50 rounded-full backdrop-blur-sm"
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-gray-300" />
      ) : (
        <Volume2 className="w-6 h-6 text-gray-300" />
      )}
    </motion.button>
  );
}