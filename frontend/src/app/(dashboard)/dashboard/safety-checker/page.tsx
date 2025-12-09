'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Search, Shield, AlertTriangle, CheckCircle, FileText, ChevronDown, ChevronUp, Pill, Activity } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/useToast';

// Types
interface SafetyResult {
    score: number;
    warnings: Array<{ severity: 'high' | 'medium' | 'low'; message: string }>;
    alternatives: Array<{ name: string; reason: string; confidence: number; price_diff: number }>;
    citations: Array<{ title: string; source: string; year: string }>;
}

export default function SafetyCheckerPage() {
    // State
    const [query, setQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<SafetyResult | null>(null);
    const [scene, setScene] = useState<'search' | 'analyzing' | 'results'>('search');
    const { toast } = useToast();

    // Mouse Physics for Antigravity Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setScene('analyzing');
        setIsAnalyzing(true);

        try {
            // Simulate API call for now (until backend is ready)
            // const data = await api.analyzeSafety(query);
            await new Promise(resolve => setTimeout(resolve, 3000)); // Fake 3s analysis

            // Mock Result
            setResult({
                score: 78,
                warnings: [
                    { severity: 'high', message: 'Potential interaction with Lisinopril (ACE Inhibitor)' },
                    { severity: 'medium', message: 'Use caution with existing condition: Hypertension' }
                ],
                alternatives: [
                    { name: 'Paracetamol 500mg', reason: 'Safer for hypertensive patients', confidence: 92, price_diff: -2.50 },
                    { name: 'Ibuprofen 200mg', reason: 'Lower interaction risk', confidence: 85, price_diff: 0.50 },
                    { name: 'Naproxen 250mg', reason: 'Longer acting, less frequent dosing', confidence: 74, price_diff: 1.20 }
                ],
                citations: [
                    { title: 'NSAID safety in hypertensive patients', source: 'NIH PubMed', year: '2023' },
                    { title: 'Aspirin vs Paracetamol comparative study', source: 'JAMA Internal Medicine', year: '2022' }
                ]
            });

            setScene('results');
        } catch (error) {
            toast({ title: 'Analysis Failed', message: 'Could not complete safety check', type: 'error' });
            setScene('search');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0E1A] text-white overflow-hidden relative font-sans">
            {/* Ambient Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A] via-[#111827] to-[#0A0E1A] z-0" />
            <BackgroundParticles mouseX={mouseX} mouseY={mouseY} />

            <main className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center min-h-[80vh]">
                <AnimatePresence mode="wait">

                    {/* SCENE 1: SEARCH */}
                    {scene === 'search' && (
                        <motion.div
                            key="search"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -50, scale: 0.9 }}
                            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                            className="w-full max-w-2xl text-center"
                        >
                            <motion.h1
                                className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            >
                                Safety Engine
                            </motion.h1>
                            <p className="text-gray-400 mb-12 text-lg">AI-Powered Pharmacological Risk Analysis</p>

                            <form onSubmit={handleSearch} className="relative group">
                                <motion.div
                                    className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl"
                                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                />
                                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex items-center shadow-2xl overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:bg-white/10 hover:shadow-blue-500/20">
                                    <Search className="w-6 h-6 text-gray-400 ml-4 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Enter drug name to analyze safety..."
                                        className="w-full bg-transparent border-none text-xl p-4 text-white placeholder-gray-500 focus:outline-none"
                                        autoFocus
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/30"
                                    >
                                        Analyze
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* SCENE 2: ANALYZING */}
                    {scene === 'analyzing' && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="text-center"
                        >
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <motion.div
                                    className="absolute inset-0 border-t-4 border-blue-500 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                    className="absolute inset-2 border-r-4 border-purple-500 rounded-full opacity-70"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    <Activity className="w-10 h-10 text-white" />
                                </motion.div>
                            </div>
                            <h2 className="text-2xl font-light text-white tracking-widest uppercase">
                                Analyzing Molecular Interactions
                            </h2>
                            <ScanningText />
                        </motion.div>
                    )}

                    {/* SCENE 3: RESULTS */}
                    {scene === 'results' && result && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8"
                        >
                            {/* Left Col: Score & Warnings */}
                            <div className="lg:col-span-4 space-y-6">
                                {/* Safety Score */}
                                <ScoreIndicator score={result.score} />

                                {/* Warnings */}
                                <div className="space-y-4">
                                    {result.warnings.map((warning, idx) => (
                                        <WarningCard key={idx} warning={warning} index={idx} />
                                    ))}
                                </div>
                            </div>

                            {/* Right Col: Alternatives & Citations */}
                            <div className="lg:col-span-8 space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-green-400" />
                                        Recommended Safer Alternatives
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {result.alternatives.map((alt, idx) => (
                                            <AlternativeCard key={idx} alt={alt} index={idx} />
                                        ))}
                                    </div>
                                </div>

                                {/* Citations */}
                                <CitationsBox citations={result.citations} />

                                <motion.button
                                    onClick={() => setScene('search')}
                                    className="text-gray-400 hover:text-white mt-8 text-sm flex items-center gap-2 mx-auto"
                                    whileHover={{ x: -2 }}
                                >
                                    ← New Analysis
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>
        </div>
    );
}

// --- Sub-Components ---

function BackgroundParticles({ mouseX, mouseY }: { mouseX: any, mouseY: any }) {
    // Generate static random positions for particles to start
    const particles = [...Array(20)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <Particle key={p.id} p={p} mouseX={mouseX} mouseY={mouseY} />
            ))}
        </div>
    );
}

function Particle({ p, mouseX, mouseY }: { p: any, mouseX: any, mouseY: any }) {
    const x = useTransform(mouseX, [0, window.innerWidth], [p.x - 5, p.x + 5]);
    const y = useTransform(mouseY, [0, window.innerHeight], [p.y - 5, p.y + 5]);

    return (
        <motion.div
            className="absolute rounded-full bg-white/10"
            style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                x, y
            }}
            animate={{
                y: [0, -20, 0],
                opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );
}

function ScanningText() {
    const defaultText = "Processing Query... Checking Contraindications... Scanning MedQuAD Database...";
    const [text, setText] = useState("");

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < defaultText.length) {
                setText(prev => prev + defaultText.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 50);
        return () => clearInterval(timer);
    }, []);

    return <p className="text-blue-400/80 mt-4 text-sm font-mono">{text}</p>;
}

function ScoreIndicator({ score }: { score: number }) {
    const color = score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500';
    const ringColor = score >= 70 ? '#4ADE80' : score >= 40 ? '#EAB308' : '#EC4899';

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center glow-hover"
        >
            <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                    <motion.circle
                        cx="80" cy="80" r="70"
                        stroke={ringColor}
                        strokeWidth="8"
                        fill="transparent"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: score / 100 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        className={`text-5xl font-bold ${color}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                    >
                        {score}
                    </motion.span>
                    <span className="text-xs text-gray-400 uppercase tracking-wide mt-1">Safety Score</span>
                </div>
            </div>
            <p className="mt-4 text-center text-gray-300">
                {score >= 70 ? 'Safe to prescribe with caution.' : 'High interaction risk detected.'}
            </p>
        </motion.div>
    );
}

function WarningCard({ warning, index }: { warning: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + (index * 0.1) }}
            className={`p-4 rounded-xl backdrop-blur-md border border-l-4 ${warning.severity === 'high' ? 'bg-red-500/10 border-red-500 border-l-red-500' : 'bg-yellow-500/10 border-yellow-500 border-l-yellow-500'
                }`}
        >
            <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 shrink-0 ${warning.severity === 'high' ? 'text-red-400' : 'text-yellow-400'}`} />
                <p className="text-sm text-gray-200">{warning.message}</p>
            </div>
        </motion.div>
    );
}

function AlternativeCard({ alt, index }: { alt: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 + (index * 0.2) }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
        >
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <Pill className="w-6 h-6" />
                    </div>
                    {alt.price_diff < 0 && (
                        <span className="text-xs font-bold text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
                            Save ${Math.abs(alt.price_diff)}
                        </span>
                    )}
                </div>

                <h4 className="text-lg font-bold text-white mb-1">{alt.name}</h4>
                <p className="text-xs text-gray-400 mb-4">{alt.reason}</p>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-green-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${alt.confidence}%` }}
                                transition={{ delay: 2 + (index * 0.2), duration: 1 }}
                            />
                        </div>
                        <span className="text-xs text-green-400">{alt.confidence}% Safe</span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                </div>
            </div>
        </motion.div>
    );
}

function CitationsBox({ citations }: { citations: any[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="border-t border-white/10 pt-4"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-gray-400 hover:text-white transition-colors"
            >
                <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4" />
                    📚 Based on {citations.length} research papers
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-4 space-y-3"
                    >
                        {citations.map((cite, i) => (
                            <div key={i} className="bg-white/5 p-3 rounded-lg text-sm text-gray-300">
                                <p className="font-medium text-blue-300">"{cite.title}"</p>
                                <p className="text-xs text-gray-500 mt-1">{cite.source}, {cite.year}</p>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
