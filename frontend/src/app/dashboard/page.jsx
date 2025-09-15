"use client"
import React, { useEffect, useState } from 'react';
import { apiService } from '../api_service';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useColorScheme } from '@mui/material/styles';
import {
    Shuffle,
    SlidersHorizontal,
    CheckCircle2,
    LayoutGrid,
    FileText,
    PenSquare,
    Settings,
    LogOut,
    ChevronDown,
    Plus,
    FileEdit,
    Eye,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const iconProps = (className = "") => ({
    size: 20,
    strokeWidth: 2,
    className: className
});

const Icons = {
    InstantRewrite: (props) => <Shuffle {...iconProps("text-blue-600")} {...props} />,
    ToneControl: (props) => <SlidersHorizontal {...iconProps("text-blue-600")} {...props} />,
    GrammarPerfection: (props) => <CheckCircle2 {...iconProps("text-blue-600")} {...props} />,
    Dashboard: (props) => <LayoutGrid {...iconProps()} {...props} />,
    Drafts: (props) => <FileText {...iconProps()} {...props} />,
    Editor: (props) => <PenSquare {...iconProps()} {...props} />,
    Settings: (props) => <Settings {...iconProps()} {...props} />,
    Logout: (props) => <LogOut {...iconProps()} {...props} />,
    ChevronDown: (props) => <ChevronDown size={16} {...props} />,
    Plus: (props) => <Plus {...iconProps()} {...props} />,
    Edit: (props) => <FileEdit size={16} {...props} />,
    View: (props) => <Eye size={16} {...props} />,
    Delete: (props) => <Trash2 size={16} {...props} />,
};

export default function Page() {
    const [drafts, setDrafts] = useState([]);
    const user = useSelector((state) => state.user.user);
    const router = useRouter();
    const { mode } = useColorScheme();

    useEffect(() => {
        getRecentDrafts();
    }, []);

    async function getRecentDrafts() {

        const response = await apiService.get(`/ai/get-recent-drafts/${user?._id}`);
        if (response.status) {
            setDrafts(response?.data);
        }
    }

    return (
        <>
            {user &&
                <div className={`min-h-screen font-sans text-gray-800 flex ${mode === 'dark' ? '' : 'bg-slate-100'}`}
                    style={mode === 'dark' ? {
                        backgroundColor: 'var(--mui-palette-background-default)',
                        color: 'var(--mui-palette-text-primary)'
                    } : {}}>

                    <main className="flex-1 p-10 overflow-auto">
                        <header className={`flex flex-wrap justify-between items-center gap-4 mb-10 p-6 rounded-xl shadow-sm ${mode === 'dark' ? '' : 'bg-white border border-gray-200'}`}
                            style={mode === 'dark' ? {
                                backgroundColor: 'var(--mui-palette-background-paper)',
                                borderColor: 'var(--mui-palette-divider)',
                                border: '1px solid'
                            } : {}}>
                            <div className="space-y-1">
                                <h1 className={`text-3xl font-bold ${mode === 'dark' ? '' : 'text-gray-900'}`}
                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                    Welcome back,{" "}
                                    <span className={`font-semibold ${mode === 'dark' ? '' : 'text-gray-700'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                        {user.full_name.split(" ")[0]}
                                    </span>
                                </h1>
                                <p className={mode === 'dark' ? '' : 'text-gray-500'}
                                    style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                    Continue rephrasing and polishing your posts for LinkedIn, X, and blogs.
                                </p>
                            </div>

                            <button
                                onClick={() => { router.push("/drafts/new-draft") }}
                                className={`flex items-center gap-2 border text-blue-600 font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer ${mode === 'dark' ? '' : 'hover:bg-blue-50'}`}
                                style={mode === 'dark' ? {
                                    color: '#2563eb',
                                    borderColor: '#2563eb',
                                    backgroundColor: 'rgba(37, 99, 235, 0.1)'
                                } : {}}
                                onMouseEnter={(e) => {
                                    if (mode === 'dark') {
                                        e.target.style.backgroundColor = 'rgba(37, 99, 235, 0.2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (mode === 'dark') {
                                        e.target.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
                                    }
                                }}
                            >
                                <Icons.Plus />
                                Start New Draft
                            </button>
                        </header>

                        <section>
                            {drafts?.length > 0 ? (
                                <>
                                    <div className={`mb-6 p-4 rounded-lg border ${mode === 'dark' ? '' : 'bg-blue-50 border-blue-200'}`}
                                        style={mode === 'dark' ? {
                                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                            borderColor: 'rgba(37, 99, 235, 0.3)',
                                            border: '1px solid'
                                        } : {}}>
                                        <p className={`text-sm font-medium ${mode === 'dark' ? '' : 'text-blue-800'}`}
                                            style={mode === 'dark' ? { color: '#60a5fa' } : {}}>
                                            📝 These are your 3 most recent drafts
                                        </p>
                                        <p className={`text-sm mt-1 ${mode === 'dark' ? '' : 'text-blue-700'}`}
                                            style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                            Want to see more? Visit your <Link href="/drafts/saved-drafts" className="font-semibold text-blue-600 underline cursor-pointer">Saved Drafts</Link> page.
                                        </p>
                                    </div>

                                    <h2 className={`text-xl font-semibold mb-6 ${mode === 'dark' ? '' : 'text-gray-800'}`}
                                        style={mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}}>
                                        Recent drafts
                                    </h2>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {drafts.map((draft, index) => {
                                            const text = draft?.final_enriched_text || '';
                                            const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
                                            const charCount = text.length;

                                            const handleCopy = () => {
                                                navigator.clipboard.writeText(draft?.final_enriched_text || '');
                                                toast.success('Content copied to clipboard!');
                                            };

                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-6 rounded-xl shadow-sm ${mode === 'dark' ? '' : 'bg-white border border-gray-200'}`}
                                                    style={{
                                                        ...(mode === 'dark' ? {
                                                            backgroundColor: 'var(--mui-palette-background-paper)',
                                                            borderColor: 'var(--mui-palette-divider)',
                                                            border: '1px solid'
                                                        } : {}),
                                                        height: '300px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between'
                                                    }}
                                                >
                                                    <div className="flex-1 overflow-hidden">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <h3 className={`font-bold text-lg ${mode === 'dark' ? '' : 'text-gray-900'}`}
                                                                style={{
                                                                    ...(mode === 'dark' ? { color: 'var(--mui-palette-text-primary)' } : {}),
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                    overflow: 'hidden',
                                                                    minHeight: '3.5rem',
                                                                    flex: 1,
                                                                    marginRight: '12px'
                                                                }}>
                                                                {draft?.prompt_idea}
                                                            </h3>

                                                            <button
                                                                onClick={handleCopy}
                                                                className={`cursor-pointer flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${mode === 'dark' ? '' : 'text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200'}`}
                                                                style={mode === 'dark' ? {
                                                                    color: '#60a5fa',
                                                                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                                                    border: '1px solid rgba(37, 99, 235, 0.3)'
                                                                } : {}}
                                                                onMouseEnter={(e) => {
                                                                    if (mode === 'dark') {
                                                                        e.target.style.backgroundColor = 'rgba(37, 99, 235, 0.2)';
                                                                    }
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    if (mode === 'dark') {
                                                                        e.target.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
                                                                    }
                                                                }}
                                                                title="Copy enriched text"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                                Copy
                                                            </button>
                                                        </div>

                                                        <p className={`text-sm leading-relaxed ${mode === 'dark' ? '' : 'text-gray-600'}`}
                                                            style={{
                                                                ...(mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}),
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 4,
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden'
                                                            }}>
                                                            {draft?.final_enriched_text}
                                                        </p>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-gray-100"
                                                        style={mode === 'dark' ? { borderColor: 'var(--mui-palette-divider)' } : {}}>
                                                        <div className="flex justify-between items-center text-xs">
                                                            <div className={`text-gray-500 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                                                <span className="font-medium">{wordCount}</span> words • <span className="font-medium">{charCount}</span> characters
                                                            </div>

                                                            <div className={`text-gray-500 ${mode === 'dark' ? '' : 'text-gray-500'}`}
                                                                style={mode === 'dark' ? { color: 'var(--mui-palette-text-secondary)' } : {}}>
                                                                {new Date(draft?.created_at)?.toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 px-8">
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${mode === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                                        }`}>
                                        <FileText size={40} className={mode === 'dark' ? 'text-gray-400' : 'text-gray-400'} />
                                    </div>

                                    <h3 className={`text-xl font-semibold mb-3 ${mode === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                        No recent drafts yet
                                    </h3>

                                    <p className={`text-center max-w-md mb-6 leading-relaxed ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        You haven't created any drafts yet. Start by turning your ideas into engaging content with our AI-powered writer.
                                    </p>

                                    <Link
                                        href="/drafts/new-draft"
                                        className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        <Plus size={18} />
                                        Create Your First Draft
                                    </Link>

                                    <p className={`text-sm mt-4 ${mode === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                        }`}>
                                        Transform your ideas into LinkedIn posts, blogs, and social content
                                    </p>
                                </div>
                            )}
                        </section>




                    </main>
                </div>
            }
        </>
    );
};
