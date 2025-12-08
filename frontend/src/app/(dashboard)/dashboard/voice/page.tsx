'use client';

import { useState } from 'react';
import { Mic, MicOff, Volume2, Settings as SettingsIcon } from 'lucide-react';

export default function VoiceAssistantPage() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [messages, setMessages] = useState<Array<{ role: string; text: string }>>([
        { role: 'assistant', text: 'Hello! I\'m your pharmacy voice assistant. How can I help you today?' }
    ]);

    const toggleListening = () => {
        setIsListening(!isListening);
        if (!isListening) {
            // Simulate voice recognition
            setTimeout(() => {
                setTranscript('Check stock levels for Paracetamol');
                setMessages(prev => [...prev,
                { role: 'user', text: 'Check stock levels for Paracetamol' },
                { role: 'assistant', text: 'Paracetamol 500mg currently has 150 units in stock. Stock level is good.' }
                ]);
                setIsListening(false);
            }, 3000);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Voice Assistant</h1>
                <p className="text-gray-500 mt-1">
                    Ambient Clinical Intelligence - Hands-free pharmacy operations
                </p>
            </div>

            {/* Integration Note */}
            <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                <p className="text-sm text-purple-800 font-medium mb-2">
                    🤖 AGENTIC AI DEV: Integrate voice assistant here
                </p>
                <p className="text-xs text-gray-600">
                    Technologies needed:
                    <br />• Speech-to-Text (Deepgram/Whisper)
                    <br />• Text-to-Speech (ElevenLabs/Google TTS)
                    <br />• LangChain agent for command processing
                </p>
            </div>

            {/* Main Voice Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Voice Control */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-8">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Voice Control</h2>

                        <button
                            onClick={toggleListening}
                            className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 transition-all ${isListening
                                    ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                                    : 'bg-purple-600 hover:bg-purple-700'
                                }`}
                        >
                            {isListening ? (
                                <MicOff className="w-16 h-16 text-white" />
                            ) : (
                                <Mic className="w-16 h-16 text-white" />
                            )}
                        </button>

                        <p className="text-lg font-medium text-gray-900 mb-2">
                            {isListening ? 'Listening...' : 'Click to speak'}
                        </p>
                        <p className="text-sm text-gray-600">
                            {isListening ? 'Say your command' : 'Tap the microphone to start'}
                        </p>

                        {transcript && (
                            <div className="mt-6 p-4 bg-white rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-2">Transcript:</p>
                                <p className="text-gray-900">{transcript}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Conversation History */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Conversation</h2>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-3 rounded-lg ${msg.role === 'user'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Voice Commands */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Voice Commands</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="font-medium text-purple-900 mb-2">📦 Inventory Commands</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• "Check stock for [medicine name]"</li>
                            <li>• "Show low stock items"</li>
                            <li>• "Add [quantity] units of [medicine]"</li>
                            <li>• "Update price for [medicine]"</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-900 mb-2">🔍 Search Commands</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• "Find [medicine name]"</li>
                            <li>• "Show medicines in [category]"</li>
                            <li>• "Check expiry dates"</li>
                            <li>• "List suppliers"</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-900 mb-2">📊 Analytics Commands</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• "Show sales trends"</li>
                            <li>• "Generate inventory report"</li>
                            <li>• "Display dashboard"</li>
                            <li>• "Check waste analytics"</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg">
                        <p className="font-medium text-orange-900 mb-2">⚠️ Alert Commands</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• "Show all alerts"</li>
                            <li>• "Mark alert as resolved"</li>
                            <li>• "Check critical alerts"</li>
                            <li>• "Dismiss notification"</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Voice Settings</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Voice Feedback</p>
                            <p className="text-sm text-gray-500">Hear responses spoken aloud</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Wake Word</p>
                            <p className="text-sm text-gray-500">Activate with "Hey Pharmacy"</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    <div>
                        <p className="font-medium text-gray-900 mb-2">Voice Speed</p>
                        <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="w-full" />
                    </div>

                    <div>
                        <p className="font-medium text-gray-900 mb-2">Language</p>
                        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <option>English (US)</option>
                            <option>English (UK)</option>
                            <option>Hindi</option>
                            <option>Spanish</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
