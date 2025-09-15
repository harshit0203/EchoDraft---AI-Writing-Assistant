"use client"
import React, { useState, useEffect } from 'react'
import { apiService } from "../api_service";
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/userSlice';
import { useColorScheme } from '@mui/material';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
    const { mode } = useColorScheme();
    const dispatch = useDispatch();
    const router = useRouter();
    const [rememberMe, setRememberMe] = useState(false);
    const [form, setForm] = useState({ email: "", password: "", remember_me: rememberMe });
    const [isLoginDisabled, setIsLoginDisabled] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name !== "remember_me") {
            setForm((prev => ({ ...prev, [name]: value })));
        };
    };

    useEffect(() => {
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        const allFilled = Object.entries(form).every(([key, value]) => {
            if (typeof value === "string") {
                if (value.trim() === "") return false;
                if (key === "email") return isValidEmail(value);
            } else if (value == null) {
                return false;
            }
            return true;
        });

        setIsLoginDisabled(!allFilled);
    }, [form]);

    const resetForm = () => {
        const object = { email: "", password: "", remember_me: rememberMe };
        setForm(object);
    };

    const submitFunc = async (event) => {
        event.preventDefault();
        if (isLoginDisabled) return;

        try {
            const res = await apiService.post("/auth/login", form);

            if (res.status && res.access_token) {
                dispatch(setUser({
                    user: { ...res.user_data, default_tone: res['user_settings']['default_tone'], default_platform: res['user_settings']['default_platform'] },
                    token: res.access_token
                }));

                localStorage.setItem("authToken", res.access_token);

                document.cookie = `authToken=${res.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict; Secure=${location.protocol === 'https:'}`;

                toast.success("Logged in successfully!");
                resetForm();
                window.location.href = "/dashboard";
            } else {
                toast.error("Login failed: An unexpected response was received.");
            }
        } catch (error) {
            console.error("Login failed:", error.message);
            resetForm();
            toast.error(error.message || "An unknown error occurred.");
        }
    };


    return (
        <>
            <div className="absolute top-6 left-6 z-10">
                <Link
                    href="/"
                    className={`inline-flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:gap-3 group ${mode === 'dark'
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    <Home size={16} />
                    <span>Back to home</span>
                </Link>
            </div>
            <div className={`min-h-screen font-sans flex items-center justify-center p-4 transition-colors duration-300 ${mode === 'dark' ? 'bg-gray-900' : 'bg-slate-50'
                }`}>
                <div className={`p-8 rounded-2xl shadow-lg w-full max-w-sm transition-colors duration-300 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>
                    <div className="mb-6 flex items-center gap-3">
                        <img src="/echo_draft_logo.png" alt="" width="50" height="60" />
                        <h1 className={`font-semibold text-xl ${mode === 'dark' ? 'text-white' : 'text-gray-800'
                            }`}>EchoDraft</h1>
                    </div>

                    <div className="mb-6">
                        <div className="w-full bg-blue-500 text-white text-sm font-semibold text-center py-2 rounded-full">
                            Sign in
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className={`text-2xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>Welcome back</h2>
                        <p className={`mt-2 text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>Continue refining and rephrasing your content.</p>
                    </div>

                    <form onSubmit={(e) => { submitFunc(e) }}>
                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    onChange={handleChange}
                                    value={form.email}
                                    name="email"
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${mode === 'dark'
                                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-black placeholder-gray-500'
                                        }`}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    onChange={handleChange}
                                    value={form.password}
                                    name="password"
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${mode === 'dark'
                                        ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-black placeholder-gray-500'
                                        }`}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center">
                                <button
                                    onClick={() => { setRememberMe(!rememberMe) }}
                                    type="button"
                                    className={`relative inline-flex items-center h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${rememberMe
                                        ? "bg-blue-600"
                                        : mode === 'dark' ? "bg-gray-600" : "bg-gray-200"
                                        }`}
                                    role="switch"
                                    aria-checked={rememberMe}
                                >
                                    <span className="sr-only">Remember me</span>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${rememberMe ? "translate-x-5" : "translate-x-0.5"
                                        }`}></span>
                                </button>
                                <label className={`ml-2 block text-sm ${mode === 'dark' ? 'text-gray-300' : 'text-gray-800'
                                    }`}>Remember me</label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoginDisabled}
                            className={`w-full mt-6 font-semibold py-3 rounded-xl transition-colors duration-300 ${isLoginDisabled
                                ? "bg-blue-400 text-white opacity-60 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="text-center mt-6 text-sm">
                        <p className={mode === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            Don't have an account? <a href="/sign-up" className={`font-semibold hover:text-blue-500 ${mode === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                }`}>Create account</a>
                        </p>
                        <p className={`mt-4 text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-400'
                            }`}>
                            By signing in, you agree to our Terms and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

