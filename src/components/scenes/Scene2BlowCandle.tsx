import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../Modal';
import { Typewriter } from '../Typewriter';
import confetti from 'canvas-confetti';
import { Flame, Wind } from 'lucide-react';

interface Props {
    onComplete: () => void;
}

export const Scene2BlowCandle: React.FC<Props> = ({ onComplete }) => {
    const [phase, setPhase] = useState<'initial' | 'lighting' | 'lit' | 'blowing' | 'blown' | 'modal' | 'angry' | 'message'>('initial');
    const [blowLevel, setBlowLevel] = useState(0);


    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number>();

    // Cleanup audio resources
    useEffect(() => {
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (microphoneRef.current) microphoneRef.current.disconnect();
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    const handleStrikeMatch = () => {
        setPhase('lighting');
        setTimeout(() => setPhase('lit'), 2000); // 2 seconds for match animation
    };

    const startListening = async () => {
        setPhase('blowing');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

            analyserRef.current.fftSize = 256;
            microphoneRef.current.connect(analyserRef.current);

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            let consecutiveBlows = 0;

            const checkVolume = () => {
                if (!analyserRef.current) return;

                analyserRef.current.getByteFrequencyData(dataArray);

                // Focus on lower frequencies typical of blowing wind into a mic
                const lowFreqData = dataArray.slice(0, 30);
                const averageVolume = lowFreqData.reduce((a, b) => a + b) / lowFreqData.length;

                setBlowLevel(Math.min(100, (averageVolume / 255) * 100));

                if (averageVolume > 150) { // Threshold
                    consecutiveBlows++;
                    if (consecutiveBlows > 15) { // Needs sustained blowing
                        // Count internal blows directly from counter inside this closure scope to avoid stale state issues in React. 
                        // It will reliably blow out if volume threshold sustains.
                        handleBlowOut();
                        consecutiveBlows = 0; // Reset for next blow attempt
                    }
                } else {
                    consecutiveBlows = Math.max(0, consecutiveBlows - 2); // Decay if they stop
                }

                if (phase === 'blowing' || phase === 'lit') {
                    animationFrameRef.current = requestAnimationFrame(checkVolume);
                }
            };

            checkVolume();

        } catch (error) {
            console.error("Error accessing microphone:", error);
            // Fallback for devices without mic access
            const confirmMsg = window.confirm("Microphone access is needed to blow the candle! If you can't, click OK to automatically blow it out.");
            if (confirmMsg) {
                handleBlowOut();
            }
        }
    };

    const handleBlowOut = () => {
        setPhase('blown');
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        // Confetti explosion
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#ffe4e6', '#f43f5e', '#e11d48', '#fde047', '#fbbf24'],
            disableForReducedMotion: true
        });

        setTimeout(() => setPhase('modal'), 3500);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center z-10 relative mt-16">
            <AnimatePresence mode="wait">
                {(phase === 'initial' || phase === 'lighting' || phase === 'lit' || phase === 'blowing' || phase === 'blown') && (
                    <motion.div
                        key="cake-scene"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="flex flex-col items-center relative"
                    >
                        {phase === 'initial' && (
                            <h2 className="text-3xl font-light text-rosegold-300 mb-12 drop-shadow-[0_0_10px_rgba(225,29,72,0.5)] animate-pulse">
                                Tap the cake to light the candle 🔥
                            </h2>
                        )}
                        {(phase === 'lit' || phase === 'blowing') && (
                            <h2 className="text-3xl font-light text-rosegold-300 mb-12 drop-shadow-[0_0_15px_rgba(225,29,72,0.7)] text-glow">
                                Make a wish and <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 text-glow-gold">blow!</span> 💨
                            </h2>
                        )}
                        {phase === 'blown' && (
                            <motion.h1
                                initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-rose-300 to-rose-500 mb-8 md:mb-12 drop-shadow-[0_0_30px_rgba(225,29,72,0.9)] text-glow font-serif whitespace-pre-line px-4"
                            >
                                Happy Birthday{'\n'}My Beautiful Pari ❤️
                            </motion.h1>
                        )}

                        {/* The MATCHSTICK Animation */}
                        <div className="relative mt-8 w-full h-64">
                            <AnimatePresence>
                                {phase === 'lighting' && (
                                    <motion.div
                                        initial={{ x: 250, y: -200, rotate: 45, opacity: 0 }}
                                        animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }} // Move to candle wick
                                        exit={{ x: -100, y: -50, rotate: -60, opacity: 0 }}
                                        transition={{ duration: 1.5, ease: "easeInOut" }}
                                        onAnimationComplete={() => setTimeout(() => setPhase('lit'), 500)}
                                        className="absolute left-1/2 transform -translate-x-1/2 w-1.5 md:w-2 h-24 md:h-32 z-40 pointer-events-none origin-bottom"
                                        style={{ top: '50%' }} // Align vertically with candle wick
                                    >
                                        <div className="w-full h-full bg-amber-800 rounded-full shadow-lg relative">
                                            {/* Match Flame Core */}
                                            <div
                                                className="absolute left-1/2 -translate-x-1/2 -top-3 w-4 h-8 bg-gradient-to-t from-red-600 to-orange-400 shadow-[0_0_20px_rgba(239,68,68,1)]"
                                                style={{ borderRadius: '50% 50% 20% 20% / 60% 60% 30% 30%' }}
                                            >
                                                <motion.div
                                                    animate={{ scale: [1, 1.4, 1.1], opacity: [0.8, 1, 0] }}
                                                    transition={{ duration: 0.4, repeat: Infinity }}
                                                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-10 bg-yellow-400 mix-blend-screen blur-[2px]"
                                                    style={{ borderRadius: '50% 50% 20% 20% / 60% 60% 30% 30%' }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>


                            {/* Center glow behind cake */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-600/20 rounded-full blur-[80px] pointer-events-none" />

                            {/* The Cake */}
                            <div
                                className={`flex flex-col items-center mt-32 relative ${phase === 'initial' ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
                                onClick={phase === 'initial' ? handleStrikeMatch : undefined}
                            >
                                {/* 3-Tier Cake Build - Responsive Scaling */}
                                <div className="relative -translate-y-3 z-10 flex flex-col items-center gap-0 scale-[0.7] sm:scale-[0.85] md:scale-100 transition-transform origin-bottom">

                                    {/* Candle & Flame (Stable positioning) */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center -translate-y-[calc(100%-2px)]">
                                        {/* Container with fixed width/height to keep alignment perfect */}
                                        <div className="w-12 flex flex-col items-center justify-end h-36">
                                            {/* Candle Flame */}
                                            <AnimatePresence>
                                                {(phase === 'lit' || phase === 'blowing' || phase === 'lighting') && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{
                                                            opacity: phase === 'lighting' ? 0 : 1,
                                                            scale: phase === 'blowing'
                                                                ? Math.max(0.2, 1 - (blowLevel / 80))
                                                                : 1,
                                                            rotate: phase === 'blowing'
                                                                ? blowLevel / 10
                                                                : 0,
                                                            x: phase === 'blowing'
                                                                ? blowLevel / 8
                                                                : 0
                                                        }}
                                                        transition={{
                                                            duration: 0.25,
                                                            ease: "easeOut"
                                                        }}
                                                        className={`w-7 h-14 relative ${phase === 'lighting' ? 'opacity-0' : 'opacity-100'}`}
                                                    >
                                                        {/* Outer Flame */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-orange-600 via-yellow-400 to-transparent opacity-100 blur-[1px]" style={{ borderRadius: '50% 50% 20% 20% / 60% 60% 30% 30%' }} />
                                                        {/* Inner Core */}
                                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-8 bg-gradient-to-t from-yellow-100 via-white to-transparent opacity-100" style={{ borderRadius: '50% 50% 20% 20% / 60% 60% 30% 30%' }} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Candle Body */}
                                            <div className="w-6 h-20 bg-gradient-to-b from-yellow-100 to-rose-200 rounded-md shadow-inner relative mt-1">
                                                {/* Candle Wick */}
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[3px] h-4 bg-gray-900 rounded-t-full shadow-sm" />
                                                {/* Stripes */}
                                                <div className="absolute top-2 w-full h-1.5 bg-rose-400/60" />
                                                <div className="absolute top-8 w-full h-1.5 bg-rose-400/60" />
                                                <div className="absolute top-14 w-full h-1.5 bg-rose-400/60" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Top Tier */}
                                    <div className="w-32 md:w-40 h-16 md:h-20 bg-gradient-to-br from-pink-300 via-rose-400 to-rose-600 rounded-lg relative shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center z-30 border-t-[6px] md:border-t-[8px] border-white/60 backdrop-blur-sm">
                                        <div className="absolute top-0 left-[15%] w-3 md:w-4 h-6 md:h-8 bg-white/80 rounded-b-full shadow-sm" />
                                        <div className="absolute top-0 left-[45%] w-4 md:w-5 h-5 md:h-6 bg-white/80 rounded-b-full shadow-sm" />
                                        <div className="absolute top-0 left-[75%] w-2 md:w-3 h-7 md:h-9 bg-white/80 rounded-b-full shadow-sm" />

                                        {/* Name On Top Tier */}
                                        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-full text-center flex justify-center pointer-events-none">
                                            <span
                                                className="font-[Dancing_Script] font-bold text-3xl md:text-4xl tracking-wide"
                                                style={{
                                                    color: '#FFD700', // gold
                                                    textShadow: `
      0 2px 4px rgba(150, 36, 36, 0.6),
      0 0 6px rgba(51, 184, 194, 0.6)
    `
                                                }}
                                            >
                                                PARI
                                            </span>
                                        </div>
                                    </div>

                                    {/* Middle Tier */}
                                    <div className="w-48 md:w-56 h-20 md:h-24 bg-gradient-to-br from-rose-400 via-pink-500 to-crimson-800 rounded-lg relative shadow-[0_15px_25px_rgba(0,0,0,0.6)] flex items-center justify-center z-20 border-t-[8px] md:border-t-[10px] border-pink-200/80">
                                        <div className="absolute top-0 left-[20%] w-3 md:w-4 h-8 md:h-10 bg-pink-200/80 rounded-b-full shadow-sm" />
                                        <div className="absolute top-0 left-[50%] w-5 md:w-6 h-6 md:h-8 bg-pink-200/80 rounded-b-full shadow-sm" />
                                        <div className="absolute top-0 left-[80%] w-4 md:w-5 h-10 md:h-12 bg-pink-200/80 rounded-b-full shadow-sm" />
                                    </div>

                                    {/* Bottom Tier */}
                                    <div className="w-64 md:w-72 h-24 md:h-32 bg-gradient-to-br from-pink-600 via-rose-600 to-crimson-950 rounded-lg relative shadow-[0_25px_50px_rgba(0,0,0,0.8)] z-10 border-t-[10px] md:border-t-[12px] border-rose-300">
                                        <div className="absolute top-0 left-[10%] w-4 md:w-5 h-8 md:h-10 bg-rose-300 rounded-b-full shadow-sm" />
                                        <div className="absolute top-0 left-[35%] w-5 md:w-6 h-12 md:h-14 bg-rose-300 rounded-b-full shadow-sm" />
                                        <div className="absolute top-0 left-[65%] w-3 md:w-4 h-10 md:h-12 bg-rose-300 rounded-b-full shadow-sm" />
                                        <div className="absolute top-0 left-[85%] w-4 md:w-5 h-7 md:h-9 bg-rose-300 rounded-b-full shadow-sm" />
                                    </div>

                                    {/* Plate */}
                                    <div className="w-[300px] md:w-[340px] h-6 md:h-8 bg-gradient-to-b from-gray-200 via-gray-400 to-gray-700 rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.9)] z-0 border-b-[4px] md:border-b-[6px] border-gray-800" />
                                </div>
                            </div>

                        </div>

                        {/* Controls Container: Lowered and grouped */}
                        <div className="mt-32 md:mt-40 min-h-[140px] flex flex-col items-center justify-center w-full z-50 gap-8">
                            <AnimatePresence>
                                {(phase === 'lit' || phase === 'blowing') && (
                                    <motion.div
                                        key="blow-controls"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex flex-col items-center gap-8"
                                    >
                                        <button
                                            onClick={phase === 'lit' ? startListening : undefined}
                                            disabled={phase === 'blowing'}
                                            className={`px-10 py-5 rounded-full font-bold text-xl text-white shadow-[0_0_40px_rgba(225,29,72,0.8)] transition-all flex items-center gap-3 border border-rose-400/50 ${phase === 'blowing'
                                                ? 'bg-rose-900/40 border-rose-500/20 shadow-none cursor-default opacity-80'
                                                : 'bg-gradient-to-r from-crimson-900 via-rose-600 to-crimson-900 animate-gradient-x hover:shadow-[0_0_60px_rgba(225,29,72,1)] hover:scale-105 animate-heartbeat'
                                                }`}
                                        >
                                            {phase === 'blowing' ? (
                                                <>
                                                    <Wind className="text-blue-300 animate-pulse" size={28} />
                                                    Blowing...
                                                </>
                                            ) : (
                                                <>
                                                    <Flame className="text-yellow-300 animate-pulse" size={28} />
                                                    Start Blowing
                                                </>
                                            )}
                                        </button>

                                        {phase === 'blowing' && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                className="flex flex-col items-center gap-3 bg-black/40 p-4 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl mt-4"
                                            >
                                                <div className="flex gap-4 items-center text-rosegold-200">
                                                    <div className="w-48 md:w-72 h-2.5 bg-black/60 rounded-full overflow-hidden shadow-inner border-[1px] border-white/20 p-0.5">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-200 shadow-[0_0_20px_rgba(34,211,238,0.6)] rounded-full"
                                                            style={{ width: `${blowLevel}%` }}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-cyan-200 font-bold text-sm animate-pulse tracking-widest uppercase">Power: {Math.round(blowLevel)}%</span>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {phase === 'message' && (
                    <motion.div
                        key="message"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="glass-card p-6 md:p-14 rounded-[2.5rem] max-w-2xl border-rose-500/30 shadow-[0_0_80px_rgba(225,29,72,0.4)] flex flex-col items-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(225,29,72,0.2)_0%,transparent_100%)] pointer-events-none" />

                        <div className="w-56 h-56 md:w-72 md:h-72 mb-8 md:mb-10 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)] border-2 border-rose-300/20 relative z-10 group">
                            <img src="/kristigocouple2024.gif" alt="Our moment together" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] pointer-events-none" />
                        </div>

                        <div className="text-lg md:text-2xl text-rosegold-300 font-medium leading-[1.8] md:leading-[2] text-left mb-8 md:mb-10 whitespace-pre-line drop-shadow-md relative z-10 max-w-xl px-2">
                            <Typewriter
                                text={"I knew it. You are so predictable (in the best way 🥺).\n\nEvery wish I make is for you, and knowing you wish for me too...\n\nMakes me the happiest person alive 💖.\n\nNow, about our future together..."}
                                speed={40}
                            />
                        </div>

                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 10, duration: 1 }}
                            onClick={onComplete}
                            className="px-10 py-4 md:px-12 md:py-5 bg-gradient-to-r from-rose-500 to-rose-700 rounded-full font-bold text-lg md:text-xl text-white shadow-[0_0_40px_rgba(225,29,72,0.7)] hover:shadow-[0_0_60px_rgba(225,29,72,1)] hover:-translate-y-2 transition-all animate-glow-pulse relative z-10 border border-rose-300/50"
                        >
                            See Our Future ✨
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <Modal isOpen={phase === 'modal' || phase === 'angry'}>
                {phase === 'modal' && (
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-white mb-6 text-glow font-serif">Wish Detected</h2>
                        <p className="text-rosegold-300 text-2xl font-medium mb-12 drop-shadow-sm">
                            You wished for me, didn't you? 😏
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => setPhase('message')}
                                className="px-10 py-5 bg-gradient-to-r from-rose-500 to-rose-700 text-white font-bold rounded-full shadow-[0_0_40px_rgba(225,29,72,0.8)] transition-all hover:scale-105 animate-glow-pulse text-lg border border-rose-400/50"
                            >
                                Obviously 🥺❤️
                            </button>
                            <button
                                onClick={() => setPhase('angry')}
                                className="px-8 py-5 bg-black/60 border border-crimson-900/50 text-rosegold-400 font-bold rounded-full hover:bg-crimson-950/40 transition-colors backdrop-blur-md"
                            >
                                No 🙄
                            </button>
                        </div>
                    </div>
                )}

                {phase === 'angry' && (
                    <div className="text-center py-6">
                        <div className="text-7xl mb-6 animate-bounce drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]">😤</div>
                        <h2 className="text-4xl font-bold text-white-500 mb-6 font-serif text-glow">How dare you!</h2>
                        <p className="text-xl text-rosegold-300 mb-10 drop-shadow-sm">
                            Go back and press the right button before I get genuinely upset! 🔪
                        </p>
                        <button
                            onClick={() => setPhase('modal')}
                            className="px-10 py-5 bg-red-700 text-white font-bold rounded-full hover:bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.8)] transition-all hover:scale-105 border border-red-400/50 text-lg"
                        >
                            I'm sorry, I'll fix it 🥺
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};
