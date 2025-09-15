"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { Wand2, Sparkles, AlertCircle } from 'lucide-react';
import { FormControl, InputLabel, Select, MenuItem, Slider, Box } from '@mui/material';
import { apiService } from '@/app/api_service';
import Loader from '@/app/components/loader';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useColorScheme } from '@mui/material/styles';

export default function page() {
    const user = useSelector((state) => state.user.user);
    const router = useRouter();
    const { mode } = useColorScheme();
    const [showToneModal, setShowToneModal] = useState(false);
    const [loader, setLoader] = useState(false);
    const [form, setForm] = useState({
        prompt_idea: "",
        tone: user?.default_tone || "",
        platform: user?.default_platform || "",
        enrichment_cycles: 2
    })
    const [tone, setTone] = useState(user?.default_tone || "");
    const [cycles, setCycles] = useState(2);

    const handleApplyTone = useCallback((newTone) => {
        setForm({ ...form, tone: newTone })
        setTone(newTone);
        setShowToneModal(false);
    });

    const handleSliderChange = (event, newValue) => {
        setForm({ ...form, enrichment_cycles: newValue })
        setCycles(newValue);
    };

    const generateText = () => {
        setLoader(true);
        toast.success("Let's cook up some AI magic...")
        apiService.post("/ai/enrich-draft", { ...form, user_id: user?._id }).then((res) => {
            router.push(`/content-preview/${res?.document_id}`)
            setLoader(false);
        })
    };

    const isGenerateDisabled = Object.values(form).some(value => {
        if (value == null) return true;
        if (typeof value === 'string' && value.trim() === '') return true;
        if (typeof value === 'number' && (isNaN(value) || value === 0)) return true;
        return false;
    });

    const clearForm = () => {
        setForm(prevForm => {
            const clearedForm = {};
            Object.keys(prevForm).forEach(key => {
                if (typeof prevForm[key] === 'number') {
                    clearedForm[key] = 2;
                } else {
                    clearedForm[key] = '';
                }
            });
            return clearedForm;
        });
        setCycles(2);
        setTone("");
    };


    return (
        <>
            {loader && <Loader />}
            <div className={`flex h-screen overflow-hidden ${mode === 'dark' ? '' : 'bg-slate-100'}`}
                style={mode === 'dark' ? {
                    backgroundColor: 'var(--mui-palette-background-default)',
                    color: 'var(--mui-palette-text-primary)'
                } : {}}>
                <div className="flex-1 p-8 overflow-y-auto">
                    <main className="max-w-4xl mx-auto">
                        <h1 className={`text-3xl font-bold text-gray-800 mb-6 ${mode === 'dark' ? '' : 'text-gray-800'}`}
                            style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                            New Draft
                        </h1>

                        <div className="bg-[#5D9CFA] text-white p-4 rounded-xl flex items-center gap-4 mb-8">
                            <div className="bg-white/20 p-2 rounded-lg"><Wand2 size={24} /></div>
                            <div>
                                <h2 className="font-semibold">Generate your first pass fast</h2>
                                <p className="text-sm opacity-90">Provide a clear prompt or paste an idea. Choose tone and platform, then generate.</p>
                            </div>
                        </div>

                        <div className={`p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] ${mode === 'dark' ? '' : 'bg-white'}`}
                            style={mode === 'dark' ? { backgroundColor: 'var(--mui-palette-background-paper)' } : {}}>
                            <h2 className={`text-xl font-semibold text-gray-800 mb-6 ${mode === 'dark' ? '' : 'text-gray-800'}`}
                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                Composer
                            </h2>

                            <div className="mb-6">
                                <label htmlFor="prompt" className={`block text-sm font-medium text-gray-600 mb-2 ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                    Text Prompt / Idea
                                </label>
                                <textarea
                                    id="prompt"
                                    value={form.prompt_idea}
                                    onChange={(e) => { setForm({ ...form, prompt_idea: e.target.value }) }}
                                    rows={8}
                                    className={`w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 transition ${mode === 'dark' ? '' : 'border-gray-200'}`}
                                    style={mode === 'dark' ? {
                                        backgroundColor: 'var(--mui-palette-background-paper)',
                                        borderColor: 'var(--mui-palette-divider)',
                                        color: 'var(--mui-palette-text-primary)'
                                    } : {}}
                                    placeholder="Write a brief description of what you want to say..."
                                ></textarea>
                                <p className={`text-xs text-gray-500 mt-2 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                    Required. Describe the message, audience, and key points.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <label htmlFor="tone" className={`block text-sm font-medium text-gray-600 mb-2 ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                        Tone
                                    </label>
                                    <input
                                        type="text"
                                        value={form.tone}
                                        id="tone"
                                        readOnly
                                        onClick={() => setShowToneModal(true)}
                                        className={`w-full p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 transition ${mode === 'dark' ? '' : 'border-gray-200 hover:border-indigo-400'}`}
                                        style={mode === 'dark' ? {
                                            backgroundColor: 'var(--mui-palette-background-paper)',
                                            borderColor: 'var(--mui-palette-divider)',
                                            color: 'var(--mui-palette-text-primary)'
                                        } : {}}
                                        onMouseEnter={(e) => {
                                            if (mode === 'dark') {
                                                e.target.style.borderColor = 'rgb(129 140 248)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (mode === 'dark') {
                                                e.target.style.borderColor = 'var(--mui-palette-divider)';
                                            }
                                        }}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="platform" className={`block text-sm font-medium text-gray-600 mb-2 ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                        Platform
                                    </label>
                                    <FormControl fullWidth>
                                        <Select
                                            sx={{
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: mode === 'dark' ? "var(--mui-palette-divider)" : "rgb(229 231 235)",
                                                },
                                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "rgb(129 140 248)",
                                                },
                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "rgb(99 102 241)",
                                                },
                                                "&.Mui-focused": {
                                                    boxShadow: "0 0 0 2px rgba(99,102,241,0.2)",
                                                },
                                                "& fieldset": { borderRadius: "0.5rem" },
                                                borderRadius: "0.5rem",
                                                backgroundColor: mode === 'dark' ? "var(--mui-palette-background-paper)" : "white",
                                                color: mode === 'dark' ? "var(--mui-palette-text-primary)" : "inherit",
                                                "& .MuiSelect-select": {
                                                    padding: "12px",
                                                    lineHeight: "24px",
                                                },
                                            }}
                                            value={form.platform}
                                            onChange={(e) => {
                                                setForm({
                                                    ...form,
                                                    platform: e.target.value,
                                                });
                                            }}
                                        >
                                            <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                                            <MenuItem value="Twitter/X">Twitter/X</MenuItem>
                                            <MenuItem value="Blog">Blog</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className={`block text-sm font-medium text-gray-600 mb-2 ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                    Enrichment Cycles: <span className="font-bold text-indigo-600">{cycles}</span>
                                </label>
                                <Slider
                                    value={form.enrichment_cycles}
                                    onChange={(e, newValue) => { handleSliderChange(e, newValue) }}
                                    aria-labelledby="enrichment-cycles-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks
                                    min={2}
                                    max={8}
                                    sx={{
                                        color: '#4F46E5',
                                        '& .MuiSlider-thumb': {
                                            '&:hover, &.Mui-focusVisible': {
                                                boxShadow: '0 0 0 6px rgba(79, 70, 229, 0.16)',
                                            },
                                        },
                                        '& .MuiSlider-rail': {
                                            opacity: 0.2,
                                            backgroundColor: '#A5B4FC',
                                        },
                                    }}
                                />
                                <div className={`flex items-start gap-3 mt-2 text-xs text-amber-800 bg-amber-50 p-3 rounded-lg ${mode === 'dark' ? '' : 'text-amber-800 bg-amber-50'}`}
                                    style={mode === 'dark' ? {
                                        color: '#d97706',
                                        backgroundColor: 'rgba(245, 158, 11, 0.1)'
                                    } : {}}>
                                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-semibold">Note:</span> Higher cycles increase generation time. While this can improve quality by refining the text multiple times, very high values may sometimes cause the AI to over-correct or drift from the original intent.
                                        <p className={`mt-1 font-semibold text-amber-900 ${mode === 'dark' ? '' : 'text-amber-900'}`}
                                            style={mode === 'dark' ? { color: '#b45309' } : {}}>
                                            For most content, we recommend a value between <span className="underline">3 and 5</span> for a good balance of speed and quality.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button disabled={isGenerateDisabled} onClick={() => { generateText() }} className={`flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm
                                        ${isGenerateDisabled
                                        ? "bg-[#A5A5D6] text-white opacity-60 cursor-default"
                                        : "bg-[#4F46E5] text-white hover:bg-[#4338CA] cursor-pointer"
                                    }`}>
                                    <Sparkles size={20} /> Generate Draft
                                </button>
                                <button onClick={clearForm} className={`text-blue-800 font-semibold py-3 px-6 cursor-pointer ${mode === 'dark' ? '' : 'text-blue-800'}`}
                                    style={mode === 'dark' ? { color: '#3b82f6' } : {}}>
                                    Clear
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <ToneModal show={showToneModal} onClose={() => setShowToneModal(false)} onApply={handleApplyTone} initialTone={tone} />
        </>
    );
}

const ToneModal = ({ show, onClose, onApply, initialTone }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedTone, setSelectedTone] = useState(initialTone);
    const { mode } = useColorScheme();

    const toneArr = [
        { tone: "Friendly", tone_description: "Warm, approachable, human." },
        { tone: "Persuasive", tone_description: "Motivating, conversion-focused." },
        { tone: "Professional", tone_description: "Clear, concise, credible." },
        { tone: "Bold", tone_description: "Confident, punchy, direct." },
        { tone: "Casual", tone_description: "Relaxed and conversational." },
        { tone: "Energetic", tone_description: "Lively, upbeat, inspiring." },
    ]

    const [arrayTone, setArrayTone] = useState(toneArr)

    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
            setIsAnimating(true);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                document.body.style.overflow = 'auto';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [show]);

    useEffect(() => {
        if (show) {
            setSelectedTone(initialTone);
        }
    }, [show, initialTone]);

    if (!show && !isAnimating) {
        return null;
    }

    const searchTone = (event) => {
        const input = event.target.value.trim().toLowerCase();

        if (!input) {
            setArrayTone(toneArr);
            return;
        }

        const filtered = toneArr.filter(
            (tone) =>
                tone?.tone?.toLowerCase().includes(input) ||
                tone?.tone_description?.toLowerCase().includes(input)
        );

        setArrayTone(filtered);
    };

    return (
        <div
            className={`fixed inset-0 bg-black flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out ${isAnimating && show ? 'bg-opacity-60' : 'bg-opacity-0'}`}
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 transform transition-all duration-300 ease-in-out ${isAnimating && show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={(e) => e.stopPropagation()}
                style={mode === 'dark' ? {
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    color: 'var(--mui-palette-text-primary)'
                } : {}}
            >
                <div className={`flex justify-between items-center pb-4 mb-4 border-b border-gray-200 ${mode === 'dark' ? '' : 'border-gray-200'}`}
                    style={mode === 'dark' ? { borderBottomColor: 'var(--mui-palette-divider)' } : {}}>
                    <h2 className={`text-xl font-bold text-gray-800 ${mode === 'dark' ? '' : 'text-gray-800'}`}
                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                        Choose Tone
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <input
                            type="search"
                            placeholder="Search tones"
                            className={`w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 ${mode === 'dark' ? '' : 'border-gray-300'}`}
                            style={mode === 'dark' ? {
                                backgroundColor: 'var(--mui-palette-background-paper)',
                                borderColor: 'var(--mui-palette-divider)',
                                color: 'var(--mui-palette-text-primary)'
                            } : {}}
                            onInput={(e) => { searchTone(e) }}
                        />
                        <div className="grid sm:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2">
                            {arrayTone.map((tone, index) => {
                                const isSelected = tone?.tone === selectedTone;

                                if (tone?.tone === "Friendly") {
                                    return (
                                        <div
                                            key={tone?.tone}
                                            onClick={() => { setSelectedTone(tone?.tone) }}
                                            className={`p-4 rounded-lg cursor-pointer ${isSelected ? (mode === 'dark' ? '' : 'bg-[#EEF2FF] border-2 border-[#6366F1]') : (mode === 'dark' ? '' : 'bg-white border border-gray-200')}`}
                                            style={mode === 'dark' ? (isSelected ?
                                                { backgroundColor: '#312e81', borderColor: '#6366f1', borderWidth: '2px' } :
                                                { backgroundColor: 'var(--mui-palette-background-paper)', borderColor: 'var(--mui-palette-divider)', borderWidth: '1px' }
                                            ) : {}}
                                        >
                                            <div className="flex justify-between items-start">
                                                <h3 className={`${isSelected ? "font-bold text-[#4338CA]" : "font-semibold text-gray-700"} ${mode === 'dark' ? '' : (isSelected ? 'text-[#4338CA]' : 'text-gray-700')}`}
                                                    style={mode === 'dark' ? { color: isSelected ? '#c7d2fe' : 'var(--mui-palette-text-primary)' } : {}}>
                                                    Friendly
                                                </h3>
                                                {isSelected && <span className={`text-xs text-gray-500 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>Default</span>}
                                            </div>
                                            <p className={`text-sm text-gray-600 mt-1 ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                                Warm, approachable, human.
                                            </p>
                                        </div>
                                    )
                                }
                                return (
                                    <div
                                        key={tone?.tone}
                                        onClick={() => { setSelectedTone(tone?.tone) }}
                                        className={`p-4 rounded-lg cursor-pointer hover:border-gray-400 ${isSelected ? (mode === 'dark' ? '' : 'bg-[#EEF2FF] border-2 border-[#6366F1]') : (mode === 'dark' ? '' : 'bg-white border border-gray-200')}`}
                                        style={mode === 'dark' ? (isSelected ?
                                            { backgroundColor: '#312e81', borderColor: '#6366f1', borderWidth: '2px' } :
                                            { backgroundColor: 'var(--mui-palette-background-paper)', borderColor: 'var(--mui-palette-divider)', borderWidth: '1px' }
                                        ) : {}}
                                    >
                                        <h3 className={`${isSelected ? "font-bold text-[#4338CA]" : "font-semibold text-gray-700"} ${mode === 'dark' ? '' : (isSelected ? 'text-[#4338CA]' : 'text-gray-700')}`}
                                            style={mode === 'dark' ? { color: isSelected ? '#c7d2fe' : 'var(--mui-palette-text-primary)' } : {}}>
                                            {tone?.tone}
                                        </h3>
                                        <p className={`text-sm text-gray-600 mt-1 ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                            style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                            {tone?.tone_description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-[#60A5FA] text-white p-6 rounded-lg h-fit">
                        <h3 className="font-bold mb-2">Preview guidelines</h3>
                        <p className="text-sm opacity-90 mb-4">Your AI will rewrite using the selected tone. Keep it consistent across drafts.</p>
                        <h3 className="font-bold mb-2">Examples</h3>
                        <div className={`bg-white text-gray-800 p-3 rounded-lg mb-4 text-sm ${mode === 'dark' ? '' : 'bg-white text-gray-800'}`}
                            style={mode === 'dark' ? {
                                backgroundColor: 'var(--mui-palette-background-paper)',
                                color: 'var(--mui-palette-text-primary)'
                            } : {}}>
                            <p className="font-semibold mb-1">Friendly</p>
                            <p>"Excited to share a small win today..."</p>
                        </div>
                        <div className={`bg-white text-gray-800 p-3 rounded-lg text-sm ${mode === 'dark' ? '' : 'bg-white text-gray-800'}`}
                            style={mode === 'dark' ? {
                                backgroundColor: 'var(--mui-palette-background-paper)',
                                color: 'var(--mui-palette-text-primary)'
                            } : {}}>
                            <p className="font-semibold mb-1">Persuasive</p>
                            <p>"Here's why this approach delivers better results."</p>
                        </div>
                    </div>
                </div>

                <div className={`flex justify-between items-center mt-6 pt-6 border-t border-gray-200 ${mode === 'dark' ? '' : 'border-gray-200'}`}
                    style={mode === 'dark' ? { borderTopColor: 'var(--mui-palette-divider)' } : {}}>
                    <p className={`text-sm text-gray-500 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                        Single-select. Your previous choice will be remembered for this draft.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className={`cursor-pointer font-semibold text-gray-600 py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors ${mode === 'dark' ? '' : 'text-gray-600 hover:bg-gray-100'}`}
                            style={mode === 'dark' ? {
                                color: 'var(--mui-palette-text-secondary)',
                                backgroundColor: 'rgba(255,255,255,0.1)'
                            } : {}}
                        >
                            Cancel
                        </button>
                        <button onClick={() => onApply(selectedTone)} className="cursor-pointer bg-[#4F46E5] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#4338CA] transition-colors">
                            Apply Tone
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
