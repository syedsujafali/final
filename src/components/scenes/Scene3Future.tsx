import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from '../Typewriter';

interface Props {
    onComplete: () => void;
}

export const Scene3Future: React.FC<Props> = () => {
    // Phases: candles -> paperUnfolding -> typing -> paperFolding -> futureVisons -> proposal -> yes/no
    const [phase, setPhase] = useState<'futureLines' | 'candles' | 'paperUnfolding' | 'typing' | 'paperFolding' | 'futureVisions' | 'proposal' | 'yes' | 'no' | 'specialVideo'>('futureLines');
    const [visionIndex, setVisionIndex] = useState(0);
    const [lineIndex, setLineIndex] = useState(0);
    const [candles, setCandles] = useState<{ id: number; top: number; left: number; delay: number }[]>([]);

    useEffect(() => {
        if (phase === 'paperFolding') {
            const timer = setTimeout(() => setPhase('proposal'), 1000); // Wait for paper to fold
            return () => clearTimeout(timer);
        }
    }, [phase]);

    useEffect(() => {
        if (phase !== 'candles') return;
        // Generate more random candles for a richer look
        const newCandles = Array.from({ length: 45 }).map((_, i) => ({
            id: i,
            top: 5 + Math.random() * 85,
            left: 5 + Math.random() * 85,
            delay: Math.random() * 4, // Spread out the appearance
            scale: 0.5 + Math.random() * 0.8
        }));
        setCandles(newCandles as any);

        // Transition from candles to paper - slower for cinematic effect
        const timer = setTimeout(() => setPhase('paperUnfolding'), 6000);
        return () => clearTimeout(timer);
    }, [phase]);

    const futureLines = [
        {
            emoji: '✈️',
            text: 'I will travel the world with you by my side.',
            gif: '/cea4d5a17097cd9c1d6d57c5aa7b5e47.gif'
        },
        {
            emoji: '🏡',
            text: 'I will build a home filled with love and laughter.',
            gif: '/nina-dobrev-ian-somerhalder.gif'
        },
        {
            emoji: '💫',
            text: 'I will grow old with you, cherishing every moment.',
            gif: '/kiss-in-the-rain-dancing-rain.gif'
        },
        {
            emoji: '🌟',
            text: 'I will support your dreams as if they were my own.',
            gif: '/0fa0560ceef6620e8cb01e36a3b7477c.gif' // magical stars / dreams
        },
        {
            emoji: '❤️',
            text: 'I will love you endlessly, today and always.',
            gif: '/cudd-milk-and-mocha.gif' // hearts / love forever
        },
        {
            emoji: '💍',
            text: 'I will marry you and make every day special.',
            gif: '/source.gif' // ring / proposal
        },
    ];


    const futureSummary = '💛 The wait is almost over — our forever is closer than you think. 💛';

    const visions = [
        {
            text: "I want to marry you...",
            img: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop" // aesthetic wedding hands
        },
        {
            text: "I want to travel the whole world holding your hand...",
            img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop" // holding hands on beach
        },
        {
            text: "I want to eat food that you made for me...",
            img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop" // cooking together aesthetic
        },
        {
            text: "I want to be the first and last person who sees you everyday...",
            img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop" // waking up aesthetic
        }
    ];

    const handleNextVision = () => {
        if (visionIndex < visions.length - 1) {
            setVisionIndex(prev => prev + 1);
        } else {
            setPhase('proposal');
        }
    };

    const paperText = `My dearest Pari,

From the very first moment you entered my life, every heartbeat whispered your name.
The distance between us has only made my love stronger, and my longing for you grows with every passing sunset.

I dream of mornings where your smile greets me and nights where your arms hold me close.
A life with you is my greatest adventure, my safe haven, and my forever.

I cannot wait to create memories, laughter, and love that lasts for eternity.
You are my heart, my home, my everything.

Will you make me the happiest person alive and be my wife?`;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center z-10 relative overflow-hidden bg-[#050002] transition-colors duration-[3000ms]">

            {/* Ambient Background Glow - Cinematic Pulse */}
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1)_0%,rgba(0,0,0,1)_100%)] pointer-events-none z-0"
                initial={{ opacity: 0 }}
                animate={{
                    opacity: phase === 'candles' || phase === 'paperUnfolding' || phase === 'typing' ? [0.4, 0.6, 0.4] : 0
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />



            <AnimatePresence mode="wait">

                {/* ✨ New Future Lines Intro Sequence */}
                {phase === 'futureLines' && (
                    <motion.div
                        key={`future-line-${lineIndex}`}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="z-20 flex flex-col items-center justify-center px-6 max-w-2xl text-center"
                    >
                        {lineIndex < futureLines.length ? (
                            <>
                                {/* GIF on every slide */}
                                <div className="w-56 h-36 md:w-64 md:h-44 mb-6 rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.15)] relative">
                                    {'gif' in futureLines[lineIndex] ? (
                                        <img src={(futureLines[lineIndex] as any).gif} alt="visual" className="w-full h-full object-cover" />
                                    ) : (
                                        <iframe
                                            src={`https://giphy.com/embed/${(futureLines[lineIndex] as any).gifId}`}
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            allowFullScreen
                                            className="absolute inset-0 w-full h-full"
                                            title="romantic gif"
                                        />
                                    )}
                                </div>

                                <motion.div
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-6xl mb-5 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                                >
                                    {futureLines[lineIndex].emoji}
                                </motion.div>

                                <p className="text-lg md:text-3xl font-serif text-white font-light leading-relaxed mb-10 drop-shadow-[0_2px_12px_rgba(225,29,72,0.5)] max-w-lg px-4">
                                    {futureLines[lineIndex].text}
                                </p>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                    onClick={() => setLineIndex(prev => prev + 1)}
                                    className="px-10 py-4 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 backdrop-blur-md transition-all text-lg"
                                >
                                    {lineIndex < futureLines.length - 1 ? 'And...' : 'One last thing...'} ✨
                                </motion.button>
                            </>
                        ) : (
                            // Bold summary screen
                            <>
                                <div className="w-72 h-52 mb-10 rounded-3xl overflow-hidden border-2 border-rose-300/30 shadow-[0_0_60px_rgba(225,29,72,0.3)]">
                                    <img src="/hug.gif" alt="hug" className="w-full h-full object-cover" />
                                </div>

                                <motion.h1
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 1, type: 'spring' }}
                                    className="text-2xl md:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-100 via-rose-300 to-white leading-relaxed mb-10 drop-shadow-[0_0_30px_rgba(253,224,71,0.4)] px-4"
                                >
                                    {futureSummary}
                                </motion.h1>

                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    onClick={() => setPhase('candles')}
                                    className="px-12 py-5 bg-gradient-to-r from-rose-500 to-yellow-600 text-white font-bold text-xl rounded-full shadow-[0_0_40px_rgba(225,29,72,0.6)] hover:scale-105 transition-all border border-yellow-300/40 animate-pulse"
                                >
                                    I have something to tell you... 💍
                                </motion.button>
                            </>
                        )}
                    </motion.div>
                )}

                {/* The Candles Setting the Mood - Stay through folding for smooth fade */}
                {(phase === 'candles' || phase === 'paperUnfolding' || phase === 'typing' || phase === 'paperFolding') && (
                    <motion.div
                        key="candle-scene"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 3 } }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0 pointer-events-none z-0"
                    >
                        {candles.map((candle: any) => (
                            <motion.div
                                key={candle.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 0.8,
                                    scale: candle.scale,
                                    filter: [
                                        "drop-shadow(0 0 10px rgba(251, 191, 36, 0.4))",
                                        "drop-shadow(0 0 25px rgba(251, 191, 36, 0.8))",
                                        "drop-shadow(0 0 10px rgba(251, 191, 36, 0.4))"
                                    ]
                                }}
                                transition={{
                                    opacity: { delay: candle.delay, duration: 3 },
                                    scale: { delay: candle.delay, duration: 2 },
                                    filter: { duration: 2 + Math.random(), repeat: Infinity }
                                }}
                                className="absolute w-1.5 h-7 bg-amber-100 rounded-t-full shadow-[0_0_15px_rgba(251,191,36,0.8)]"
                                style={{ top: `${candle.top}%`, left: `${candle.left}%` }}
                            >
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-6 bg-amber-500 rounded-full mix-blend-screen blur-[2px] animate-pulse" />
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-4 bg-yellow-200 rounded-full mix-blend-screen blur-[1px]" />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* The Vintage Paper Sequence - Realistic Textures and Depth */}
                {(phase === 'paperUnfolding' || phase === 'typing') && (
                    <motion.div
                        key="paper"
                        initial={{ scaleY: 0, opacity: 0, rotateX: 15, rotate: -2, y: 100 }}
                        animate={{ scaleY: 1, opacity: 1, rotateX: 5, rotate: 1, y: 0 }}
                        exit={{ scaleY: 0, opacity: 0, filter: "blur(15px)", transition: { duration: 0.8 } }}
                        transition={{ duration: 2, ease: "circOut" }}
                        className="relative z-20 w-full max-w-2xl min-h-[500px] md:min-h-[550px] p-6 md:p-20 flex flex-col justify-center overflow-hidden"
                        style={{
                            backgroundImage: "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
                            backgroundColor: "#e8d5b5",
                            borderRadius: "4px",
                            boxShadow: "inset 0 0 100px rgba(80,40,10,0.6), 0 50px 100px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,0.5)",
                            border: "1px solid rgba(101,67,33,0.2)",
                            transformStyle: "preserve-3d",
                            perspective: "1000px"
                        }}
                    >
                        {/* Subtle inner "crease" or depth effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 pointer-events-none" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-30 pointer-events-none" />

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            className="font-serif text-[#000000] text-xl md:text-3xl font-black leading-[1.6] md:leading-[1.8] text-left whitespace-pre-wrap selection:bg-amber-900/10 italic"
                            style={{
                                filter: "drop-shadow(0 0.5px 0.5px rgba(0,0,0,0.2))",
                                fontFamily: "'Dancing Script', cursive"
                            }}
                        >
                            <Typewriter
                                text={paperText}
                                speed={50}
                                onComplete={() => setTimeout(() => setPhase('paperFolding'), 1500)}
                            />
                        </motion.div>
                    </motion.div>
                )}

                {/* Transition state from paper to proposal buttons */}
                {phase === 'paperFolding' && (
                    <motion.div
                        key="folding"
                        className="w-full max-w-2xl h-2 bg-transparent"
                    />
                )}

                {/* The Future Visions Narrative */}
                {phase === 'futureVisions' && (
                    <motion.div
                        key={`vision-${visionIndex}`}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 1.2, type: "spring" }}
                        className="z-20 w-full max-w-2xl flex flex-col items-center"
                    >
                        <div className="w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.2)] border-2 border-white/20 mb-10 relative group">
                            <motion.img
                                src={visions[visionIndex].img}
                                alt="Our future"
                                className="w-full h-full object-cover"
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 10, ease: "linear" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050002] via-transparent to-transparent opacity-80" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-serif text-rosegold-300 drop-shadow-lg mb-12 min-h-[100px] leading-relaxed px-4">
                            <Typewriter text={visions[visionIndex].text} speed={35} />
                        </h2>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.5 }} // Wait for typing
                            onClick={handleNextVision}
                            className="px-10 py-4 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 backdrop-blur-md transition-all text-xl"
                        >
                            {visionIndex < visions.length - 1 ? "Next ✨" : "And most importantly... ❤️"}
                        </motion.button>
                    </motion.div>
                )}

                {/* The Final Proposal Buttons */}
                {phase === 'proposal' && (
                    <motion.div
                        key="proposal"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="z-20 w-full max-w-4xl flex flex-col items-center relative"
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1)_0%,transparent_60%)] pointer-events-none -z-10 animate-pulse" />

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-4xl md:text-7xl font-serif text-white mb-12 md:mb-20 leading-relaxed drop-shadow-2xl text-glow italic px-4"
                        >
                            Your answer? 💍
                        </motion.h2>

                        <div className="flex flex-col sm:flex-row gap-12 mt-8 w-full justify-center items-center">
                            <motion.button
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                                onClick={() => setPhase('yes')}
                                className="px-16 py-6 bg-gradient-to-r from-amber-500 via-rose-500 to-rose-700 rounded-full font-bold text-2xl md:text-4xl text-white shadow-[0_0_50px_rgba(225,29,72,0.9)] hover:shadow-[0_0_80px_rgba(253,224,71,0.8)] hover:-translate-y-3 transition-all animate-glow-pulse border border-yellow-300/50 w-full sm:w-auto"
                            >
                                YES
                            </motion.button>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1, type: "spring", stiffness: 200 }}
                                onClick={() => setPhase('no')}
                                className="px-16 py-6 bg-black/50 border-2 border-crimson-900/60 text-rose-300 font-bold rounded-full hover:bg-crimson-950/80 hover:text-white transition-all text-2xl md:text-4xl backdrop-blur-md w-full sm:w-auto"
                            >
                                NO
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Happy Ending (Yes) */}
                {phase === 'yes' && (
                    <motion.div
                        key="yes"
                        initial={{ opacity: 0, scale: 0.3 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="z-20 text-center glass-card p-10 md:p-16 rounded-[3rem] border-2 border-yellow-400/50 shadow-[0_0_150px_rgba(253,224,71,0.4),inset_0_0_50px_rgba(253,224,71,0.1)] relative overflow-hidden flex flex-col items-center"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,224,71,0.1)_0%,transparent_100%)] pointer-events-none" />



                        <h1 className="text-3xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-yellow-200 to-rose-300 leading-tight text-glow-gold relative z-10 mb-8 px-4">
                            I am the luckiest man<br />because my soul belongs to you
                        </h1>

                        <p className="text-lg md:text-2xl text-rosegold-300 font-serif font-light mb-12 max-w-2xl relative z-10 px-6">
                            I vow to love you with every beat of my heart, to stand by you through every joy and every storm, and to make our life together a beautiful story of endless laughter, warmth, and unwavering devotion. You are my forever, and I promise to treasure you for all eternity.
                        </p>

                        <button
                            onClick={() => setPhase('specialVideo')}
                            className="px-10 py-5 bg-gradient-to-r from-yellow-600 to-rose-600 rounded-full font-bold text-lg text-white shadow-[0_0_40px_rgba(253,224,71,0.6)] hover:scale-105 transition-all animate-bounce relative z-10 border border-yellow-300/50"
                        >
                            A special video is waiting for you 🎁
                        </button>
                    </motion.div>
                )}

                {/* Special Video Modal Placeholder */}
                {phase === 'specialVideo' && (
                    <motion.div
                        key="video"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="z-50 fixed inset-0 bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-4"
                    >
                        <div className="w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl border-4 border-rose-500/30 overflow-hidden shadow-[0_0_100px_rgba(225,29,72,0.3)]">
                            <video
                                src="/8246990-hd_1920_1080_25fps.mp4"
                                controls
                                autoPlay
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <button onClick={() => setPhase('yes')} className="mt-8 text-rosegold-300 hover:text-white transition-colors">Close Video</button>
                    </motion.div>
                )}

                {/* Dark Ending (No) */}
                {phase === 'no' && (
                    <motion.div
                        key="no"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 3 }}
                        className="z-50 fixed inset-0 bg-black flex flex-col items-center justify-center p-8 text-center"
                    >
                        <img src="https://media.giphy.com/media/2rtQMJvhzOnRe/giphy.gif" alt="Crying" className="w-64 h-64 rounded-full mb-10 opacity-60 mix-blend-screen" />

                        <div className="max-w-4xl text-gray-500 font-serif text-lg md:text-3xl leading-[1.8] md:leading-[2.5] tracking-wide drop-shadow-md mb-12 px-6">
                            <Typewriter
                                text={"Ok… so you don’t love me. I believed in us, in every word, every laugh, every dream we shared… And now it all feels like it was never real. I tried, I waited, I hoped… but I was alone in my heart. I will quietly vanish from your life, leaving only memories that never belonged to me. Goodbye forever… 🥀"}
                                speed={70} // Heartbreakingly slow
                            />
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 10 }} // Wait for the sad text to finish typing
                            onClick={() => setPhase('proposal')}
                            className="px-8 py-4 bg-transparent border border-gray-700 text-gray-500 rounded-full hover:bg-gray-900 hover:text-gray-300 transition-all text-sm"
                        >
                            You have another chance (Go back)
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
