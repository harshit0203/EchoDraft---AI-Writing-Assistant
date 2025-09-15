"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Info, KeyRound, Eye, EyeOff, X } from 'lucide-react'
import { useSelector } from 'react-redux';
import { FormControl, MenuItem, Select, Box } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { apiService } from '../api_service';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/userSlice';

export default function page() {
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();

    const [showToneModal, setShowToneModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [tone, setTone] = useState("Friendly");
    const { mode, setMode } = useColorScheme();

    const [settings, setSettings] = useState([]);

    const [form, setForm] = useState({
        full_name: user?.full_name,
        email: user?.email,
        password: user?.password,
        default_tone: "",
        default_platform: ""
    })


    useEffect(() => {
        getSettings();
    }, [])

    const getSettings = async () => {
        try {
            const settingsRes = await apiService.get("/settings/get-settings/" + user?._id);

            if (settingsRes.status) {
                setSettings(settingsRes.data);
                setForm({ ...form, full_name: settingsRes?.data[1]['user_name'] })
                setTone(settingsRes?.data[0]['default_tone'])
            }
        } catch (error) {
            console.error(error.message);
        }

    }

    useEffect(() => {
        setForm(prev => ({ ...prev, dark_mode: mode === 'dark' }));
    }, [mode]);

    const handleDarkModeToggle = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        setForm(prev => ({ ...prev, dark_mode: newMode === 'dark' }));
    };

    const handleApplyTone = useCallback((newTone) => {
        setForm({ ...form, default_tone: newTone })
        setTone(newTone);
        setShowToneModal(false);
    });

    const saveChanges = async (e) => {
        e.preventDefault();
        const payload = {
            user_id: user?._id,
            full_name: form.full_name,
            default_tone: form.default_tone || settings[0]['default_tone'] || "",
            default_platform: form.default_platform || settings[0]['default_platform'] || ""
        };

        const response = await apiService.post("/settings/save-changes", payload);
        if (response.status) {
            dispatch(setUser({ user: { ...user, full_name: payload['full_name'],default_tone: payload['default_tone'], default_platform: payload['default_platform']  }, token: localStorage.getItem("authToken"), }))
            toast.success(response.message)
        }
    }

    return (
        <>
            <div className={`flex h-screen overflow-hidden ${mode === 'dark' ? '' : 'bg-slate-100'}`}
                style={mode === 'dark' ? { backgroundColor: 'var(--mui-palette-background-default)' } : {}}>
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <h1 className={`text-[22px] font-semibold text-gray-900 mb-6 ${mode === 'dark' ? '' : 'text-gray-900'}`}
                            style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                            Settings
                        </h1>

                        <section className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6 ${mode === 'dark' ? '' : 'bg-white border-gray-200'}`}
                            style={mode === 'dark' ? {
                                backgroundColor: 'var(--mui-palette-background-paper)',
                                borderColor: 'var(--mui-palette-divider)'
                            } : {}}>
                            <h2 className={`text-base font-semibold text-gray-900 mb-4 ${mode === 'dark' ? '' : 'text-gray-900'}`}
                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                Profile
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className={`text-xs font-medium text-gray-600 ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                        Name
                                    </label>
                                    <input
                                        onChange={(event) => { setForm({ ...form, full_name: event.target.value }) }}
                                        type="text"
                                        value={form?.full_name}
                                        className={`h-11 w-full rounded-xl px-3 text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 ${mode === 'dark' ? '' : 'border-gray-300'}`}
                                        style={mode === 'dark' ? {
                                            backgroundColor: 'var(--mui-palette-background-paper)',
                                            borderColor: 'var(--mui-palette-divider)',
                                            color: 'var(--mui-palette-text-primary)'
                                        } : {}}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className={`text-xs font-medium text-gray-600 ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={form?.email}
                                        className={`cursor-default h-11 w-full rounded-xl px-3 text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 ${mode === 'dark' ? '' : 'border-gray-300'}`}
                                        style={mode === 'dark' ? {
                                            backgroundColor: 'var(--mui-palette-background-paper)',
                                            borderColor: 'var(--mui-palette-divider)',
                                            color: 'var(--mui-palette-text-primary)'
                                        } : {}}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </section>

                        <section className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6 ${mode === 'dark' ? '' : 'bg-white border-gray-200'}`}
                            style={mode === 'dark' ? {
                                backgroundColor: 'var(--mui-palette-background-paper)',
                                borderColor: 'var(--mui-palette-divider)'
                            } : {}}>
                            <h2 className={`text-base font-semibold text-gray-900 mb-4 ${mode === 'dark' ? '' : 'text-gray-900'}`}
                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                Account
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                <div className="flex flex-col gap-2">
                                    <label className={`text-xs font-medium text-gray-600 ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={form?.password?.slice(1, 14) || ''}
                                        className={`cursor-default h-11 w-full rounded-xl px-3 text-sm border border-gray-300 outline-none focus:ring-2 focus:ring-blue-200 ${mode === 'dark' ? '' : 'border-gray-300'}`}
                                        style={mode === 'dark' ? {
                                            backgroundColor: 'var(--mui-palette-background-paper)',
                                            borderColor: 'var(--mui-palette-divider)',
                                            color: 'var(--mui-palette-text-primary)'
                                        } : {}}
                                        readOnly
                                    />
                                    <p className={`text-[11px] mt-1 flex items-center gap-1 text-gray-500 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                        <Info className={`w-3.5 h-3.5 text-gray-500 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                            style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}} />
                                        Use 8+ characters with a mix of letters and numbers.
                                    </p>
                                </div>

                                <div className="flex md:justify-end items-start">
                                    <button
                                        type="button"
                                        onClick={() => { setShowChangePasswordModal(true) }}
                                        className={`cursor-pointer mt-7 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-[#004EEB] hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm ${mode === 'dark' ? '' : 'border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300'}`}
                                        style={mode === 'dark' ? {
                                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                            borderColor: 'rgba(37, 99, 235, 0.3)',
                                            color: '#3b82f6'
                                        } : {}}
                                    >
                                        <KeyRound className="w-4 h-4" />
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </section>

                        <section className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6 ${mode === 'dark' ? '' : 'bg-white border-gray-200'}`}
                            style={mode === 'dark' ? {
                                backgroundColor: 'var(--mui-palette-background-paper)',
                                borderColor: 'var(--mui-palette-divider)'
                            } : {}}>
                            <h2 className={`text-base font-semibold text-gray-900 mb-4 ${mode === 'dark' ? '' : 'text-gray-900'}`}
                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                Preferences
                            </h2>
                            <div className="space-y-3">
                                <div
                                    className="flex items-center gap-4 bg-[#5A8BFF] rounded-xl px-4 py-3 shadow-sm cursor-pointer"
                                    onClick={handleDarkModeToggle}
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-white">Enable Dark Mode</p>
                                        <p className="text-xs text-white/90">Switch the interface to a darker theme.</p>
                                    </div>
                                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${mode === 'dark' ? 'bg-white/70' : 'bg-white/20'}`}>
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${mode === 'dark' ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6 ${mode === 'dark' ? '' : 'bg-white border-gray-200'}`}
                            style={mode === 'dark' ? {
                                backgroundColor: 'var(--mui-palette-background-paper)',
                                borderColor: 'var(--mui-palette-divider)'
                            } : {}}>
                            <h2 className={`text-base font-semibold text-gray-900 mb-4 ${mode === 'dark' ? '' : 'text-gray-900'}`}
                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                AI Behavior Preferences
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="tone" className={`block text-sm font-medium text-gray-600 mb-2 ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                        Tone
                                    </label>
                                    <input
                                        type="text"
                                        value={tone ?? settings[0]?.default_tone}
                                        id="tone"
                                        readOnly
                                        onClick={() => setShowToneModal(true)}
                                        className={`w-full p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 transition ${mode === 'dark' ? '' : 'border-gray-300 hover:border-indigo-400'}`}
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
                                    <p className={`text-[11px] mt-1 flex items-center gap-1 text-gray-500 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                        <Info className={`w-3.5 h-3.5 text-gray-500 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                            style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}} />
                                        Used as the default tone for AI-generated drafts.
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className={`block text-sm font-medium text-gray-600 mb-2 ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                        Default platform
                                    </label>

                                    <FormControl fullWidth>
                                        <Select
                                            value={form?.default_platform?.trim() || settings[0]?.default_platform || ""}
                                            displayEmpty
                                            onChange={(e) => setForm({ ...form, default_platform: e.target.value })}
                                            sx={{
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: mode === 'dark' ? "var(--mui-palette-divider)" : "rgb(209 213 219)",
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
                                        >
                                            <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                                            <MenuItem value="Twitter/X">Twitter/X</MenuItem>
                                            <MenuItem value="Blog">Blog</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <p className={`text-[11px] mt-1 flex items-center gap-1 text-gray-500 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                        <Info className={`w-3.5 h-3.5 text-gray-500 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                            style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}} />
                                        Auto-applied when creating new AI content.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="pt-2">
                            <button
                                type="button"
                                onClick={(e) => { saveChanges(e) }}
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2 shadow-sm"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ToneModal show={showToneModal} onClose={() => setShowToneModal(false)} onApply={handleApplyTone} initialTone={tone} />

            <ChangePasswordModal show={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} />
                
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
                style={mode === 'dark' ? {
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    color: 'var(--mui-palette-text-primary)'
                } : {}}
                onClick={(e) => e.stopPropagation()}
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

const ChangePasswordModal = ({ show, onClose }) => {
    const user = useSelector((state) => state?.user?.user);
    const { mode } = useColorScheme();
    const [password, setPassword] = useState({
        old_password: "",
        new_password: "",
        confirm_password: ""
    })
    const [showPassword, setShowPassword] = useState({
        old_password: false,
        new_password: false
    });
    const [matchPasswordErr, setMatchPasswordErr] = useState(false);

    useEffect(() => {
        const checkMatch = password.new_password !== password.confirm_password;
        setMatchPasswordErr(checkMatch)
    }, [password.new_password, password.confirm_password])

    useEffect(() => {
        setPassword({ old_password: "", new_password: "", confirm_password: "" });
        setShowPassword({ old_password: false, new_password: false });
        setMatchPasswordErr(false);

    }, [onClose])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Password change:', password);
        const response = await apiService.post("/auth/reset-password", { ...password, email: user?.email })
        if (response.status) {
            toast.success(response.message);
        }
        onClose();
    };

    if (!show) return null;

    const areAllFilled = Object.values(password).some((item) => !item || item == "");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="change-password-title" tabIndex={-1}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose}></div>


            <div
                className={`relative bg-white rounded-2xl shadow-xl border border-gray-200 p-6 w-full max-w-md mx-4 transform scale-100 opacity-100 ${mode === 'dark' ? '' : 'bg-white border-gray-200'}`}
                style={mode === 'dark' ? {
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    borderColor: 'var(--mui-palette-divider)',
                    animation: 'scaleIn 300ms ease-out'
                } : { animation: 'scaleIn 300ms ease-out' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg ${mode === 'dark' ? '' : 'bg-indigo-100'}`}
                            style={mode === 'dark' ? { backgroundColor: 'rgba(99, 102, 241, 0.1)' } : {}}
                        >
                            <KeyRound className={`w-4 h-4 text-indigo-600 ${mode === 'dark' ? '' : 'text-indigo-600'}`}
                                style={mode === 'dark' ? { color: '#6366f1' } : {}} />
                        </div>
                        <h2 id="change-password-title" className={`text-xl font-semibold text-gray-900 ${mode === 'dark' ? '' : 'text-gray-900'}`}
                            style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                            Change Password
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        aria-label="Close modal"
                        className={`cursor-pointer text-gray-400 hover:text-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${mode === 'dark' ? '' : 'text-gray-400 hover:text-gray-600'}`}
                        style={mode === 'dark' ? {
                            color: 'var(--mui-palette-text-secondary)'
                        } : {}}
                        onMouseEnter={(e) => {
                            if (mode === 'dark') {
                                e.target.style.color = 'var(--mui-palette-text-primary)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (mode === 'dark') {
                                e.target.style.color = 'var(--mui-palette-text-secondary)';
                            }
                        }}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={(e) => { handleSubmit(e) }} className="space-y-4">
                    <div>
                        <label htmlFor="old-password" className={`block text-sm font-medium text-gray-700 mb-2 ${mode === 'dark' ? '' : 'text-gray-700'}`}
                            style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword.old_password ? 'text' : 'password'}
                                value={password.old_password}
                                onChange={(e) => setPassword({ ...password, old_password: e.target.value })}
                                id="old-password"
                                className={`w-full rounded-lg border border-gray-300 bg-white py-3 px-4 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-colors ${mode === 'dark' ? '' : 'border-gray-300 bg-white text-gray-900'}`}
                                style={mode === 'dark' ? {
                                    backgroundColor: 'var(--mui-palette-background-paper)',
                                    borderColor: 'var(--mui-palette-divider)',
                                    color: 'var(--mui-palette-text-primary)'
                                } : {}}
                                placeholder="Enter your current password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword({ ...showPassword, old_password: !showPassword.old_password })}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none ${mode === 'dark' ? '' : 'text-gray-400 hover:text-gray-600'}`}
                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}
                                onMouseEnter={(e) => {
                                    if (mode === 'dark') {
                                        e.target.style.color = 'var(--mui-palette-text-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (mode === 'dark') {
                                        e.target.style.color = 'var(--mui-palette-text-secondary)';
                                    }
                                }}
                                tabIndex={-1}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword.old_password ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="new-password" className={`block text-sm font-medium text-gray-700 mb-2 ${mode === 'dark' ? '' : 'text-gray-700'}`}
                            style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword.new_password ? 'text' : 'password'}
                                value={password.new_password}
                                onChange={(e) => setPassword({ ...password, new_password: e.target.value })}
                                id="new-password"
                                className={`w-full rounded-lg border border-gray-300 bg-white py-3 px-4 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-colors ${mode === 'dark' ? '' : 'border-gray-300 bg-white text-gray-900'}`}
                                style={mode === 'dark' ? {
                                    backgroundColor: 'var(--mui-palette-background-paper)',
                                    borderColor: 'var(--mui-palette-divider)',
                                    color: 'var(--mui-palette-text-primary)'
                                } : {}}
                                placeholder="Enter your new password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword({ ...showPassword, new_password: !showPassword.new_password })}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none ${mode === 'dark' ? '' : 'text-gray-400 hover:text-gray-600'}`}
                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}
                                onMouseEnter={(e) => {
                                    if (mode === 'dark') {
                                        e.target.style.color = 'var(--mui-palette-text-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (mode === 'dark') {
                                        e.target.style.color = 'var(--mui-palette-text-secondary)';
                                    }
                                }}
                                tabIndex={-1}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword.new_password ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                    </div>
                    <div>
                        <label htmlFor="confirm-password" className={`block text-sm font-medium text-gray-700 mb-2 ${mode === 'dark' ? '' : 'text-gray-700'}`}
                            style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={password.confirm_password}
                            onChange={(e) => setPassword({ ...password, confirm_password: e.target.value })}
                            id="confirm-password"
                            className={`w-full rounded-lg border border-gray-300 bg-white py-3 px-4 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-colors ${mode === 'dark' ? '' : 'border-gray-300 bg-white text-gray-900'}`}
                            style={mode === 'dark' ? {
                                backgroundColor: 'var(--mui-palette-background-paper)',
                                borderColor: 'var(--mui-palette-divider)',
                                color: 'var(--mui-palette-text-primary)'
                            } : {}}
                            placeholder="Enter your confirm password"
                        />
                        {
                            matchPasswordErr &&
                            <div className="mt-1 min-h-[1.25rem]">
                                <p className={`text-xs text-red-600 flex items-center gap-1 ${mode === 'dark' ? '' : 'text-red-600'}`}
                                    style={mode === 'dark' ? { color: '#ef4444' } : {}}>
                                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Passwords do not match
                                </p>
                            </div>
                        }

                    </div>

                    <div className={`flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg ${mode === 'dark' ? '' : 'bg-amber-50 border-amber-200'}`}
                        style={mode === 'dark' ? {
                            backgroundColor: 'rgba(245, 158, 11, 0.05)',
                            borderColor: 'rgba(245, 158, 11, 0.3)'
                        } : {}}>
                        <Info className={`w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0 ${mode === 'dark' ? '' : 'text-amber-600'}`}
                            style={mode === 'dark' ? { color: '#f59e0b' } : {}} />
                        <p className={`text-sm text-amber-800 ${mode === 'dark' ? '' : 'text-amber-800'}`}
                            style={mode === 'dark' ? { color: '#d97706' } : {}}>
                            Make sure your new password is strong and not reused elsewhere.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`cursor-pointer px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors ${mode === 'dark' ? '' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'}`}
                            style={mode === 'dark' ? {
                                color: 'var(--mui-palette-text-primary)',
                                backgroundColor: 'var(--mui-palette-background-paper)',
                                borderColor: 'var(--mui-palette-divider)'
                            } : {}}
                            onMouseEnter={(e) => {
                                if (mode === 'dark') {
                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (mode === 'dark') {
                                    e.target.style.backgroundColor = 'var(--mui-palette-background-paper)';
                                }
                            }}
                        >
                            Back
                        </button>
                        <button
                            disabled={areAllFilled || matchPasswordErr}
                            type="submit"
                            className={`px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${!areAllFilled && !matchPasswordErr
                                ? 'hover:bg-indigo-700 cursor-pointer'
                                : 'opacity-50 cursor-default hover:bg-indigo-600'
                                }`}
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            </div>

            <style>{`@keyframes scaleIn { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }`}</style>
        </div>
    );
};
