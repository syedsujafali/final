import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HeartBackground } from './components/HeartBackground';
import { Scene1Compatibility } from './components/scenes/Scene1Compatibility';
import { Scene2BlowCandle } from './components/scenes/Scene2BlowCandle';
import { Scene3Future } from './components/scenes/Scene3Future';


function App() {
  const [scene, setScene] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    // Setup audio
    const audio = new Audio('/birthday.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    const playAudio = () => {
      if (!hasInteracted.current && audioRef.current) {
        audioRef.current.play().catch(e => console.log('Audio autoplay prevented', e));
        hasInteracted.current = true;

        // Remove listeners once interacted
        document.removeEventListener('click', playAudio);
        document.removeEventListener('touchstart', playAudio);
      }
    };

    document.addEventListener('click', playAudio);
    document.addEventListener('touchstart', playAudio);

    return () => {
      document.removeEventListener('click', playAudio);
      document.removeEventListener('touchstart', playAudio);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const nextScene = () => {
    setScene(prev => Math.min(prev + 1, 3));
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-rose-900 via-pink-950 to-rose-950 bg-[length:200%_200%] animate-gradient-x text-white overflow-x-hidden overflow-y-auto relative font-sans scrollbar-none">
      <HeartBackground />

      <AnimatePresence mode="wait">
        {scene === 1 && (
          <motion.div
            key="scene1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Scene1Compatibility onComplete={nextScene} />
          </motion.div>
        )}

        {scene === 2 && (
          <motion.div
            key="scene2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Scene2BlowCandle onComplete={nextScene} />
          </motion.div>
        )}

        {scene === 3 && (
          <motion.div
            key="scene3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Scene3Future onComplete={nextScene} />
          </motion.div>
        )}


      </AnimatePresence>
    </div>
  );
}

export default App;
