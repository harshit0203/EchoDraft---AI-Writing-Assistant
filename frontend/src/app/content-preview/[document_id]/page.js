"use client"
import { apiService } from "@/app/api_service";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, use } from "react";
import { toast } from "sonner";
import { AlertTriangle, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useColorScheme } from '@mui/material/styles';

export default function page({ params }) {
    const user = useSelector((state) => state.user.user);
    const router = useRouter();
    const { document_id } = use(params);
    const { mode } = useColorScheme();
    const [data, setData] = useState();
    const [savedDraft, setSavedDraft] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isMainExpanded, setIsMainExpanded] = useState(false);
    const [expandedJourneyIndex, setExpandedJourneyIndex] = useState(null);

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {
        const response = await apiService.get(`/ai/get-drafts/${document_id}/${user?._id}`);
        if (response.status) {
            setData(response.data);
        } else {
            setData(null);
        }
    }

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const saveDraft = async (document_id) => {
        const response = await apiService.post("/ai/save-draft/" + document_id);
        if (response.status) {
            toast.success(response.message);
            setSavedDraft(true);
            setData(prevData => ({
                ...prevData,
                saved: true
            }));
        }
    }

    const goBack = () => {
        if (savedDraft) {
            router.push("/drafts/new-draft");
            return;
        };
        setShowModal(true)
    }

    const confirmLeave = async () => {
        const response = await apiService.post("/ai/delete-draft/" + document_id);
        if (response.status) {
            router.push("/drafts/new-draft");
        }
    }

    return (
        <>
            {data !== null ?
                <div className={`flex h-screen overflow-hidden ${mode === 'dark' ? '' : 'bg-slate-100'}`}
                    style={mode === 'dark' ? { backgroundColor: 'var(--mui-palette-background-default)' } : {}}>
                    <div className="flex-1 p-8 overflow-y-auto">
                        <main className="max-w-4xl ml-auto">
                            <div className="mb-6">
                                <h1 className={`text-2xl font-bold text-gray-900 ${mode === 'dark' ? '' : 'text-gray-900'}`}
                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                    Your Refined Post is Ready
                                </h1>
                                <p className={`text-sm text-gray-600 ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                    Here's your AI‑enriched final version along with the refinement journey.
                                </p>
                                <p className={`mt-1 text-xs text-gray-400 ${mode === 'dark' ? '' : 'text-gray-400'}`}
                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                    Doc ID: {document_id}
                                </p>
                            </div>

                            <section className="mb-8">
                                <div
                                    className={`bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-t-2xl px-5 py-3 ${mode === 'dark' ? '' : 'bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200'}`}
                                    style={mode === 'dark' ? {
                                        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
                                        borderColor: 'rgba(99, 102, 241, 0.3)'
                                    } : {}}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        <span className="text-sm font-semibold text-indigo-800">
                                            AI Recommended - Best Version for Maximum Engagement
                                        </span>
                                    </div>
                                </div>

                                <div
                                    className={`bg-white rounded-b-2xl border-x-2 border-b-2 border-indigo-200 shadow-lg relative overflow-hidden ${mode === 'dark' ? '' : 'bg-white border-indigo-200'}`}
                                    style={mode === 'dark' ? {
                                        backgroundColor: 'var(--mui-palette-background-paper)',
                                        borderColor: 'rgba(99, 102, 241, 0.3)'
                                    } : {}}
                                >
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                                    <div className="flex items-center justify-between px-5 pt-4">
                                        <div className="inline-flex items-center gap-3">
                                            <span
                                                className={`inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm border border-emerald-200 ${mode === 'dark' ? '' : 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200'}`}
                                                style={mode === 'dark' ? {
                                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                                    borderColor: 'rgba(16, 185, 129, 0.3)',
                                                    color: '#059669'
                                                } : {}}
                                            >
                                                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                Final Version
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                <span className="text-xs text-yellow-600 font-medium">Top Pick</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`inline-flex items-center bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full ${mode === 'dark' ? '' : 'bg-emerald-100 text-emerald-800'}`}
                                                style={mode === 'dark' ? {
                                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                                    color: '#059669'
                                                } : {}}
                                            >
                                                Rated {`${data?.refinement_journey[data?.refinement_journey?.length - 1]?.rating}/10`} for {data?.platform}
                                            </span>
                                            <button
                                                type="button"
                                                className="cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(data?.final_enriched_text);
                                                    toast.info("Copied to clipboard!");
                                                }}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Copy Post
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        className={`px-5 py-5 border-t border-gray-100 mt-4 ${mode === 'dark' ? '' : 'border-gray-100'}`}
                                        style={mode === 'dark' ? { borderColor: 'var(--mui-palette-divider)' } : {}}
                                    >
                                        <div
                                            className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 ${mode === 'dark' ? '' : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'}`}
                                            style={mode === 'dark' ? {
                                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                borderColor: 'var(--mui-palette-divider)',
                                                background: 'rgba(255, 255, 255, 0.08)'
                                            } : {}}
                                        >
                                            {(() => {
                                                const text = data?.final_enriched_text || '';
                                                const words = text.split(' ');
                                                const wordLimit = 120;
                                                const isLong = words.length > wordLimit;
                                                const displayText = isMainExpanded || !isLong ? text : words.slice(0, wordLimit).join(' ') + '...';

                                                return (
                                                    <p className={`text-gray-900 text-base leading-relaxed whitespace-pre-line font-medium ${mode === 'dark' ? '' : 'text-gray-900'}`}
                                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                                        {displayText}
                                                        {isLong && (
                                                            <span
                                                                onClick={() => setIsMainExpanded(!isMainExpanded)}
                                                                className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer hover:underline ml-1"
                                                            >
                                                                {isMainExpanded ? ' Read less' : ' Read more'}
                                                            </span>
                                                        )}
                                                    </p>
                                                );
                                            })()}
                                        </div>
                                    </div>


                                    <div className="px-5 pb-4">
                                        <div className={`flex items-center justify-between text-xs text-gray-500 mb-3 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                            style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Optimized for {data?.platform}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                    AI Recommended
                                                </span>
                                            </div>
                                            <button onClick={() => scrollToSection('refinement_journey')} className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-medium hover:underline">
                                                View All Versions
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className={`text-xs text-gray-400 ${mode === 'dark' ? '' : 'text-gray-400'}`}
                                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                                Ready to save this AI-optimized content
                                            </span>
                                            <div className="relative p-[2px] rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-[length:400%_400%] animate-gradient-border">
                                                <button
                                                    onClick={function () { !data?.saved && saveDraft(data?._id) }}
                                                    type="button"
                                                    disable={(data?.saved)?.toString()}
                                                    className={`${!data?.saved && "cursor-pointer"} text-indigo-600 hover:text-indigo-800 text-sm font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-indigo-50 w-full h-full transition-colors duration-200 ${mode === 'dark' ? '' : 'bg-white hover:bg-indigo-50'}`}
                                                    style={mode === 'dark' ? {
                                                        backgroundColor: 'var(--mui-palette-background-paper)',
                                                        '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.05)' }
                                                    } : {}}
                                                >
                                                    {data?.saved ? "Saved" : "Save Final Post"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <h2 id="refinement_journey" className={`text-sm font-semibold text-gray-700 mb-3 ${mode === 'dark' ? '' : 'text-gray-700'}`}
                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                Refinement Journey
                            </h2>

                            <div className="space-y-4">
                                {
                                    data?.refinement_journey?.map((journey, index) => {
                                        const text = journey?.enriched_text || '';
                                        const words = text.trim().split(/\s+/);
                                        const wordLimit = 120;
                                        const isLong = words.length > wordLimit;
                                        const isExpanded = expandedJourneyIndex === index;
                                        const displayText = isExpanded || !isLong
                                            ? text
                                            : words.slice(0, wordLimit).join(' ') + '...';

                                        return (
                                            <div key={index}
                                                className={`bg-white rounded-xl border border-gray-200 shadow-sm ${mode === 'dark' ? '' : 'bg-white border-gray-200'}`}
                                                style={mode === 'dark' ? {
                                                    backgroundColor: 'var(--mui-palette-background-paper)',
                                                    borderColor: 'var(--mui-palette-divider)'
                                                } : {}}>

                                                <div className={`flex items-center justify-between px-4 py-3 border-b border-gray-100 ${mode === 'dark' ? '' : 'border-gray-100'}`}
                                                    style={mode === 'dark' ? { borderColor: 'var(--mui-palette-divider)' } : {}}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-block h-2 w-2 rounded-full bg-indigo-300"></span>
                                                        <span
                                                            className={`inline-flex items-center gap-2 bg-indigo-50 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full ${mode === 'dark' ? '' : 'bg-indigo-50 text-indigo-800'}`}
                                                            style={mode === 'dark' ? {
                                                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                                                color: '#6366f1'
                                                            } : {}}
                                                        >
                                                            Cycle {journey?.cycle_number}
                                                            <span className="text-indigo-500">{journey?.rating}/10</span>
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className={`cursor-pointer text-indigo-600 hover:text-indigo-800 text-sm font-semibold px-3 py-1.5 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 ${mode === 'dark' ? '' : 'border-indigo-200 bg-indigo-50 hover:bg-indigo-100'}`}
                                                        style={mode === 'dark' ? {
                                                            borderColor: 'rgba(99, 102, 241, 0.3)',
                                                            backgroundColor: 'rgba(99, 102, 241, 0.05)'
                                                        } : {}}
                                                        onMouseEnter={(e) => {
                                                            if (mode === 'dark') {
                                                                e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (mode === 'dark') {
                                                                e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
                                                            }
                                                        }}
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(journey?.enriched_text);
                                                            toast.info("Copied to clipboard!");
                                                        }}
                                                    >
                                                        Copy
                                                    </button>
                                                </div>

                                                <div className="px-4 py-4 space-y-4">
                                                    <div>
                                                        <p className={`text-gray-700 leading-relaxed whitespace-pre-line ${mode === 'dark' ? '' : 'text-gray-700'}`}
                                                            style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                                            {displayText}
                                                            {isLong && (
                                                                <span
                                                                    onClick={() => setExpandedJourneyIndex(isExpanded ? null : index)}
                                                                    className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer hover:underline ml-1"
                                                                >
                                                                    {isExpanded ? ' Read less' : ' Read more'}
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>

                                                    {journey?.feedback && (
                                                        <details
                                                            className={`group border border-amber-200 rounded-lg bg-amber-50 overflow-hidden ${mode === 'dark' ? '' : 'border-amber-200 bg-amber-50'}`}
                                                            style={mode === 'dark' ? {
                                                                borderColor: 'rgba(245, 158, 11, 0.3)',
                                                                backgroundColor: 'rgba(245, 158, 11, 0.05)'
                                                            } : {}}
                                                        >
                                                            <summary
                                                                className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-amber-100 transition-colors ${mode === 'dark' ? '' : 'hover:bg-amber-100'}`}
                                                                onMouseEnter={(e) => {
                                                                    if (mode === 'dark') {
                                                                        e.target.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
                                                                    }
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    if (mode === 'dark') {
                                                                        e.target.style.backgroundColor = 'transparent';
                                                                    }
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    <span className="font-medium text-amber-800">AI Criticism & Feedback</span>
                                                                </div>
                                                                <svg className="w-4 h-4 text-amber-600 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </summary>
                                                            <div
                                                                className={`px-4 pb-3 border-t border-amber-200 bg-white ${mode === 'dark' ? '' : 'border-amber-200 bg-white'}`}
                                                                style={mode === 'dark' ? {
                                                                    borderColor: 'rgba(245, 158, 11, 0.3)',
                                                                    backgroundColor: 'var(--mui-palette-background-paper)'
                                                                } : {}}
                                                            >
                                                                <p className={`text-sm text-gray-700 mt-3 leading-relaxed whitespace-pre-line ${mode === 'dark' ? '' : 'text-gray-700'}`}
                                                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                                                    {journey?.feedback}
                                                                </p>
                                                            </div>
                                                        </details>
                                                    )}

                                                    {journey?.hashtags && journey.hashtags.length > 0 && (
                                                        <div
                                                            className={`border-l-4 border-blue-400 bg-blue-50 rounded-r-lg p-3 ${mode === 'dark' ? '' : 'bg-blue-50'}`}
                                                            style={mode === 'dark' ? {
                                                                backgroundColor: 'rgba(59, 130, 246, 0.05)'
                                                            } : {}}
                                                        >
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                                </svg>
                                                                <span className="text-sm font-medium text-blue-800">Suggested Hashtags</span>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {journey.hashtags.map((hashtag, hashIndex) => (
                                                                    <span
                                                                        key={hashIndex}
                                                                        className={`inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full border border-blue-200 hover:bg-blue-200 transition-colors cursor-default select-none ${mode === 'dark' ? '' : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'}`}
                                                                        style={mode === 'dark' ? {
                                                                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                                            borderColor: 'rgba(59, 130, 246, 0.3)',
                                                                            color: '#3b82f6'
                                                                        } : {}}
                                                                    >
                                                                        {hashtag.startsWith('#') ? hashtag : `#${hashtag}`}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => { goBack() }}
                                        type="button"
                                        className={`cursor-pointer inline-flex items-center gap-2 text-slate-700 bg-white hover:bg-slate-50 border border-gray-200 text-sm font-semibold px-4 py-2 rounded-lg ${mode === 'dark' ? '' : 'text-slate-700 bg-white hover:bg-slate-50 border-gray-200'}`}
                                        style={mode === 'dark' ? {
                                            color: 'var(--mui-palette-text-primary)',
                                            backgroundColor: 'var(--mui-palette-background-paper)',
                                            borderColor: 'var(--mui-palette-divider)'
                                        } : {}}
                                    >
                                        Go Back
                                    </button>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                :
                <div className={`flex h-screen overflow-hidden ${mode === 'dark' ? '' : 'bg-slate-100'}`}
                    style={mode === 'dark' ? { backgroundColor: 'var(--mui-palette-background-default)' } : {}}>
                    <div className={`flex-1 flex items-center justify-center p-8 ${mode === 'dark' ? '' : 'bg-slate-100'}`}
                        style={mode === 'dark' ? { backgroundColor: 'var(--mui-palette-background-default)' } : {}}>
                        <div className="max-w-md w-full text-center">
                            <div
                                className={`mx-auto w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 ${mode === 'dark' ? '' : 'bg-gray-200'}`}
                                style={mode === 'dark' ? {
                                    backgroundColor: 'rgba(156, 163, 175, 0.1)'
                                } : {}}
                            >
                                <svg className={`w-10 h-10 text-gray-500 ${mode === 'dark' ? '' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" opacity="0.5" />
                                </svg>
                            </div>

                            <div
                                className={`rounded-xl shadow-sm border p-8 ${mode === 'dark' ? '' : 'bg-white border-gray-200'}`}
                                style={mode === 'dark' ? {
                                    backgroundColor: 'var(--mui-palette-background-paper)',
                                    borderColor: 'var(--mui-palette-divider)'
                                } : {}}
                            >
                                <h1 className={`text-2xl font-bold text-gray-900 mb-3 ${mode === 'dark' ? '' : 'text-gray-900'}`}
                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                    Draft Not Found
                                </h1>

                                <p className={`text-gray-600 mb-2 leading-relaxed ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                    Sorry, we couldn't find any draft data for this document ID.
                                </p>

                                <p className={`text-sm text-gray-500 mb-6 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                    The draft may have been removed or the link might be incorrect.
                                </p>

                                <div
                                    className={`bg-gray-50 rounded-lg p-3 mb-6 border border-gray-100 ${mode === 'dark' ? '' : 'bg-gray-50 border-gray-100'}`}
                                    style={mode === 'dark' ? {
                                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                        borderColor: 'var(--mui-palette-divider)'
                                    } : {}}
                                >
                                    <p className={`text-xs text-gray-500 mb-1 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                        Document ID:
                                    </p>
                                    <p className={`text-sm font-mono text-gray-700 ${mode === 'dark' ? '' : 'text-gray-700'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                        {document_id}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => router.push('/drafts/new-draft')}
                                        className="cursor-pointer w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                                    >
                                        Create New Draft
                                    </button>

                                    <button
                                        onClick={() => router.back()}
                                        className={`cursor-pointer w-full text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${mode === 'dark' ? '' : 'text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200'}`}
                                        style={mode === 'dark' ? {
                                            color: 'var(--mui-palette-text-secondary)',
                                            backgroundColor: 'rgba(156, 163, 175, 0.1)'
                                        } : {}}
                                    >
                                        Go Back
                                    </button>
                                </div>
                            </div>

                            <p className={`text-xs text-gray-500 mt-4 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                Need help? Contact support or check your saved draft history.
                            </p>
                        </div>
                    </div>
                </div>

            }

            {
                showModal &&
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div
                        className={`bg-white rounded-lg shadow-xl max-w-md w-full relative animate-in fade-in duration-200 ${mode === 'dark' ? '' : 'bg-white'}`}
                        style={mode === 'dark' ? { backgroundColor: 'var(--mui-palette-background-paper)' } : {}}
                    >
                        <button
                            onClick={() => { setShowModal(false) }}
                            className={`cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors ${mode === 'dark' ? '' : 'text-gray-400 hover:text-gray-600'}`}
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
                            <X size={20} />
                        </button>

                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className={`flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center ${mode === 'dark' ? '' : 'bg-amber-100'}`}
                                    style={mode === 'dark' ? {
                                        backgroundColor: 'rgba(245, 158, 11, 0.1)'
                                    } : {}}
                                >
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className={`text-lg font-semibold text-gray-900 ${mode === 'dark' ? '' : 'text-gray-900'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                        Unsaved Draft
                                    </h3>
                                    <p className={`text-sm text-gray-500 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                        Your changes haven't been saved yet
                                    </p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className={`text-gray-700 leading-relaxed ${mode === 'dark' ? '' : 'text-gray-700'}`}
                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                    You haven't saved your draft yet. Are you sure you want to go back to the new draft page?
                                    <span className={`font-medium text-gray-900 ${mode === 'dark' ? '' : 'font-medium text-gray-900'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}> You won't be able to come back to this page.</span>
                                </p>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => { setShowModal(false) }}
                                    className={`cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 ${mode === 'dark' ? '' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'}`}
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
                                    Stay Here
                                </button>
                                <button
                                    onClick={() => { confirmLeave() }}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors duration-200"
                                >
                                    Yes, Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
