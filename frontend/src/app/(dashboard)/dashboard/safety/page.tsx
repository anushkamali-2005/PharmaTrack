'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Activity, AlertCircle, ShieldCheck, CheckCircle, FileText, ExternalLink, Send, Flag, ClipboardCheck } from 'lucide-react';
import { safetyApi, inventoryApi } from '@/lib/api';
import SafetyScoreCard from '@/features/rag_safety/components/SafetyScoreCard';
import AlternativeMeds from '@/features/rag_safety/components/AlternativeMeds';

export default function SafetyPage() {
    const [drugName, setDrugName] = useState('');
    const [drugSuggestions, setDrugSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [conditionInput, setConditionInput] = useState('');
    const [conditions, setConditions] = useState<string[]>([]);
    const [medInput, setMedInput] = useState('');
    const [currentMeds, setCurrentMeds] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');
    const [actionTaken, setActionTaken] = useState<string | null>(null);
    
    const searchRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Drug autocomplete
    useEffect(() => {
        if (drugName.length > 2) {
            const timer = setTimeout(async () => {
                try {
                    const data = await safetyApi.searchDrugs(drugName);
                    setDrugSuggestions(data.drugs || []);
                    setShowSuggestions(true);
                } catch (err) {
                    console.error('Autocomplete error:', err);
                }
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setDrugSuggestions([]);
            setShowSuggestions(false);
        }
    }, [drugName]);

    const handleAddCondition = () => {
        if (conditionInput.trim()) {
            setConditions([...conditions, conditionInput.trim()]);
            setConditionInput('');
        }
    };

    const handleAddMed = () => {
        if (medInput.trim()) {
            setCurrentMeds([...currentMeds, medInput.trim()]);
            setMedInput('');
        }
    };

    const handleCheck = async () => {
        if (!drugName) return;
        setLoading(true);
        setError('');
        setResult(null);
        setActionTaken(null);

        try {
            const data = await safetyApi.checkSafety({
                drug_name: drugName,
                conditions: conditions,
                current_medications: currentMeds
            });
            setResult(data);
        } catch (err: any) {
            const errorMsg = err.response?.data?.detail || err.message || 'Failed to analyze safety. Please check backend connection.';
            setError(errorMsg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePharmacistAction = async (action: string, alternativeName?: string) => {
        setActionTaken(action);
        // In production, this would log to backend
        console.log(`Pharmacist action: ${action}`, alternativeName ? `Alternative: ${alternativeName}` : '');
        
        // Simulate API call
        setTimeout(() => {
            alert(`Action "${action}" recorded. ${alternativeName ? `Switched to ${alternativeName}` : ''}`);
        }, 500);
    };

    const handleSelectAlternative = (alternative: any) => {
        handlePharmacistAction('switch', alternative.name);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30">
                        <ShieldCheck className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            RAG-Powered Drug Safety Engine
                        </h1>
                        <p className="text-gray-400">AI-powered safety analysis with alternative medicine recommendations</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Input Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1 space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm h-fit"
                    >
                        {/* Drug Name with Autocomplete */}
                        <div ref={searchRef}>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Target Drug</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                <input
                                    type="text"
                                    value={drugName}
                                    onChange={(e) => setDrugName(e.target.value)}
                                    onFocus={() => drugSuggestions.length > 0 && setShowSuggestions(true)}
                                    placeholder="e.g. Aspirin 500mg"
                                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                                />
                                {showSuggestions && drugSuggestions.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                        {drugSuggestions.map((drug, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setDrugName(drug);
                                                    setShowSuggestions(false);
                                                }}
                                                className="w-full text-left px-4 py-2 hover:bg-purple-500/20 text-white text-sm transition-colors"
                                            >
                                                {drug}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Conditions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Patient Conditions</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={conditionInput}
                                    onChange={(e) => setConditionInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCondition()}
                                    placeholder="e.g. Diabetes"
                                    className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                                <button onClick={handleAddCondition} className="p-2 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <AnimatePresence>
                                    {conditions.map((c, i) => (
                                        <motion.span
                                            key={c}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-xs flex items-center gap-1"
                                        >
                                            {c}
                                            <button onClick={() => setConditions(conditions.filter((_, idx) => idx !== i))}>
                                                <X className="w-3 h-3 hover:text-white" />
                                            </button>
                                        </motion.span>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Current Meds */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Current Medications</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={medInput}
                                    onChange={(e) => setMedInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddMed()}
                                    placeholder="e.g. Metformin"
                                    className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                                <button onClick={handleAddMed} className="p-2 bg-purple-600 rounded-xl hover:bg-purple-500 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <AnimatePresence>
                                    {currentMeds.map((m, i) => (
                                        <motion.span
                                            key={m}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs flex items-center gap-1"
                                        >
                                            {m}
                                            <button onClick={() => setCurrentMeds(currentMeds.filter((_, idx) => idx !== i))}>
                                                <X className="w-3 h-3 hover:text-white" />
                                            </button>
                                        </motion.span>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Action Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCheck}
                            disabled={loading || !drugName}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all ${loading || !drugName
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-900/20'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Activity className="w-5 h-5 animate-spin" /> Analyzing...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" /> Run Safety Check
                                </>
                            )}
                        </motion.button>
                    </motion.div>

                    {/* Results Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 flex items-center gap-3"
                                >
                                    <AlertCircle className="w-5 h-5" />
                                    <div>
                                        <p className="font-semibold">Analysis Error</p>
                                        <p className="text-sm">{error}</p>
                                    </div>
                                </motion.div>
                            )}

                            {!result && !loading && !error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4 min-h-[400px]"
                                >
                                    <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                                        <ShieldCheck className="w-12 h-12 text-gray-600" />
                                    </div>
                                    <p>Enter drug details to start AI safety analysis</p>
                                    <p className="text-xs text-gray-600">Search through medical literature, FDA warnings, and research papers</p>
                                </motion.div>
                            )}

                            {result && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="space-y-6"
                                >
                                    <SafetyScoreCard
                                        score={result.score}
                                        warnings={result.warnings}
                                        explanation={result.explanation}
                                    />

                                    {/* FDA Alerts */}
                                    {result.fda_alerts && result.fda_alerts.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 rounded-xl bg-red-500/10 border border-red-500/30"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <AlertCircle className="w-5 h-5 text-red-400" />
                                                <h4 className="text-lg font-semibold text-red-300">FDA Alerts & Warnings</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {result.fda_alerts.map((alert: string, i: number) => (
                                                    <li key={i} className="text-sm text-red-200 flex items-start gap-2">
                                                        <span className="text-red-500 mt-1">•</span>
                                                        <span>{alert}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}

                                    <AlternativeMeds 
                                        alternatives={result.alternatives || []} 
                                        onSelect={handleSelectAlternative}
                                    />

                                    {/* Research Citations */}
                                    {result.citations && result.citations.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="p-4 rounded-xl bg-white/5 border border-white/10"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <FileText className="w-5 h-5 text-purple-400" />
                                                <h4 className="text-lg font-semibold text-gray-300">Research Citations</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {result.citations.map((citation: string, i: number) => (
                                                    <li key={i} className="text-sm text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2 group cursor-pointer">
                                                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <span>{citation}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}

                                    {/* Pharmacist Action Buttons */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="p-4 rounded-xl bg-white/5 border border-white/10"
                                    >
                                        <h4 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                                            <ClipboardCheck className="w-5 h-5 text-purple-400" />
                                            Pharmacist Decision
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <button
                                                onClick={() => handlePharmacistAction('approve')}
                                                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handlePharmacistAction('switch')}
                                                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Send className="w-4 h-4" />
                                                Switch
                                            </button>
                                            <button
                                                onClick={() => handlePharmacistAction('consult')}
                                                className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FileText className="w-4 h-4" />
                                                Consult
                                            </button>
                                            <button
                                                onClick={() => handlePharmacistAction('report')}
                                                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Flag className="w-4 h-4" />
                                                Report
                                            </button>
                                        </div>
                                        {actionTaken && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="mt-3 text-sm text-green-400 text-center"
                                            >
                                                ✓ Action "{actionTaken}" recorded
                                            </motion.p>
                                        )}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
}
