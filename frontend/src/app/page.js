"use client"
import { useColorScheme } from '@mui/material/styles';
import React from 'react';
import { RotateCcw, Sliders, CheckCircle, Menu, Sparkles, ArrowRight, Moon, Sun } from 'lucide-react';
import UserMenu from './components/UserMenu';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tooltip } from '@mui/material';


export default function App() {
  const router = useRouter();
  const { mode, setMode } = useColorScheme();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const isLoggedIn = user && Object.keys(user).length > 0 && (token || localStorage.getItem('authToken'));

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${mode === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-slate-50 text-gray-800'
      }`}>
      <header className={`sticky top-0 z-50 backdrop-blur-sm border-b transition-colors duration-300 ${mode === 'dark'
        ? 'bg-gray-900/90 border-gray-700'
        : 'bg-slate-50/90 border-slate-200'
        }`}>
        <div className="container mx-auto px-6 lg:px-8">
          <nav className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <img src="/echo_draft_logo.png" alt="" width="50" height="80" />
              <span className={`font-bold text-xl ps-0 ${mode === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>EchoDraft</span>
            </div>

            <div className="flex items-center gap-4">

              <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <button
                  onClick={toggleTheme}
                  aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
                  className={`p-2.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${mode === 'dark'
                    ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-800/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </Tooltip>

              <UserMenu />

              <button className={`lg:hidden p-2 ${mode === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                <Menu size={24} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-6 lg:px-8">
        <main>
          <section className="pt-16 pb-16 lg:pt-20 lg:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              <div className="text-center lg:text-left">
                <h1 className={`text-4xl lg:text-5xl font-bold leading-tight tracking-tight ${mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                  Create Smarter with AI
                </h1>
                <p className={`mt-6 text-lg max-w-xl mx-auto lg:mx-0 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  EchoDraft transforms your ideas into engaging LinkedIn posts, blog content, and social media that drives results.
                </p>

                <div className={`mt-10 p-6 rounded-2xl shadow-lg border transition-all duration-300 ${mode === 'dark'
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                  : 'bg-gradient-to-br from-blue-50 to-white border-blue-200'
                  }`}>

                  <div className="mb-6">
                    <h3 className={`text-xl font-semibold mb-3 ${mode === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                      ✨ Ready to transform your ideas?
                    </h3>
                    <p className={`text-base ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                      Turn simple thoughts into viral LinkedIn posts, engaging blog articles, and compelling social media content.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className={`p-3 rounded-lg text-center ${mode === 'dark' ? 'bg-gray-700/50' : 'bg-white/80'
                      }`}>
                      <span className="text-2xl mb-2 block">💼</span>
                      <p className={`text-sm font-medium ${mode === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                        LinkedIn Posts
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${mode === 'dark' ? 'bg-gray-700/50' : 'bg-white/80'
                      }`}>
                      <span className="text-2xl mb-2 block">📝</span>
                      <p className={`text-sm font-medium ${mode === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                        Blog Articles
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${mode === 'dark' ? 'bg-gray-700/50' : 'bg-white/80'
                      }`}>
                      <span className="text-2xl mb-2 block">🐦</span>
                      <p className={`text-sm font-medium ${mode === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                        Social Media
                      </p>
                    </div>
                  </div>

                  <Link
                    href={isLoggedIn ? "/drafts/new-draft" : "/sign-in"}
                    className="inline-block w-full text-center bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
                  >
                    {isLoggedIn ? 'Start Creating Content' : 'Get Started - It\'s Free'}
                  </Link>

                </div>
              </div>


              <div className="relative flex items-center justify-center">
                <div className={`w-full max-w-md rounded-2xl p-5 shadow-xl transition-all duration-300 hover:scale-[1.02] ${mode === 'dark'
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600'
                  : 'bg-gradient-to-br from-white to-gray-100 border border-gray-200'
                  }`}>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${mode === 'dark' ? 'bg-blue-600' : 'bg-blue-100'
                        }`}>
                        <Sparkles size={16} className={mode === 'dark' ? 'text-white' : 'text-blue-600'} />
                      </div>
                      <h3 className={`font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        AI Creator
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-500 font-medium">Live</span>
                    </div>
                  </div>

                  <div className="space-y-3">

                    <div className={`p-3 rounded-lg ${mode === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}>
                      <p className={`text-xs font-medium mb-1 ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        💡 Your Idea:
                      </p>
                      <p className={`text-sm ${mode === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                        "Productivity tips for remote workers"
                      </p>
                    </div>

                    <div className="flex justify-center py-1">
                      <div className={`rounded-full p-1.5 ${mode === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
                        }`}>
                        <ArrowRight size={14} className="text-blue-600 animate-pulse" />
                      </div>
                    </div>

                    <div className={`p-3 rounded-lg border-2 ${mode === 'dark'
                      ? 'bg-blue-900/20 border-blue-500'
                      : 'bg-blue-50 border-blue-400'
                      }`}>
                      <p className={`text-xs font-semibold mb-2 ${mode === 'dark' ? 'text-blue-300' : 'text-blue-700'
                        }`}>
                        ✨ Enhanced LinkedIn Post:
                      </p>
                      <p className={`text-sm leading-snug mb-3 ${mode === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                        "🏠 Remote work success isn't about fancy tools—it's about smart systems that work for YOU.

                        Here are 3 game-changing tips:
                        → Set non-negotiable boundaries
                        → Use the 2-minute rule for quick wins
                        → Block time for deep focus work

                        What's your #1 productivity hack? 👇"
                      </p>

                      <div className="flex gap-1.5">
                        <span className="px-2 py-1 rounded-full bg-green-500 text-white text-xs font-medium">
                          Ready
                        </span>
                        <span className="px-2 py-1 rounded-full bg-purple-500 text-white text-xs font-medium">
                          Optimized
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                    🚀 3x Better
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 lg:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className={`p-8 rounded-xl shadow-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${mode === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
                }`}>
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <RotateCcw size={24} className="text-blue-600" />
                </div>
                <h3 className={`mt-6 text-xl font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Instant Content Creation</h3>
                <p className={`mt-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  Transform ideas into polished posts in seconds—no brainstorming required.
                </p>
              </div>

              <div className={`p-8 rounded-xl shadow-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${mode === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
                }`}>
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <Sliders size={24} className="text-blue-600" />
                </div>
                <h3 className={`mt-6 text-xl font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Smart Platform Optimization</h3>
                <p className={`mt-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  Tailored for LinkedIn, Twitter, and blog formats with perfect engagement.
                </p>
              </div>

              <div className={`p-8 rounded-xl shadow-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${mode === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
                }`}>
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  <CheckCircle size={24} className="text-blue-600" />
                </div>
                <h3 className={`mt-6 text-xl font-semibold ${mode === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>AI-Powered Enhancement</h3>
                <p className={`mt-2 ${mode === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                  Multiple AI refinement cycles ensure maximum impact and engagement.
                </p>
              </div>
            </div>
          </section>
        </main>
        
        <footer className={`py-8 border-t transition-colors duration-300 ${mode === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src="/echo_draft_logo.png" alt="" width="50" height="60" />
              <span className={`font-semibold ${mode === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                EchoDraft - AI Writing Assistant
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm">
              <span className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                © {new Date().getFullYear()} EchoDraft
              </span>
              <span className={`hidden md:inline ${mode === 'dark' ? 'text-gray-600' : 'text-gray-300'
                }`}>
                •
              </span>
              <span className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                Designed & Built by{' '}
                <a
                  href="https://www.linkedin.com/in/harshit-sharma-190230244/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-medium transition-colors hover:underline ${mode === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                >
                  Harshit Sharma
                </a>
              </span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
