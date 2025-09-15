"use client"
import { useEffect, useState } from "react"
import { apiService } from "../api_service";
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useColorScheme } from "@mui/material";
import Link from "next/link";
import { Home, ArrowLeft } from 'lucide-react';

export default function Page() {
    const { mode } = useColorScheme();
    const router = useRouter();
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        password: "",
        confirm_password: ""
    });
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);

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

        setIsSubmitDisabled(!allFilled);
    }, [form]);

    const resetForm = () => {
        setForm({
            full_name: "",
            email: "",
            password: "",
            confirm_password: ""
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const submitFunc = (event) => {
        event.preventDefault();
        if (isSubmitDisabled) return;

        apiService.post("/auth/signup", form)
            .then((res) => {
                if (res.status) {
                    toast.success("Signed up successfully!");
                    resetForm();
                    router.push("/sign-in");
                }
            })
            .catch((error) => {
                console.error("Signup failed:", error.message);
                resetForm();
                toast.error(error.message || "An unknown error occurred.");
            });
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
                <div className={`p-6 rounded-2xl shadow-lg w-full max-w-sm transition-colors duration-300 ${mode === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>

                    <div className="flex items-center gap-3 mb-5">
                        <img src="/echo_draft_logo.png" alt="EchoDraft Logo" width="40" height="50" />
                        <h1 className={`font-semibold text-xl ${mode === 'dark' ? 'text-white' : 'text-gray-800'
                            }`}>EchoDraft</h1>
                    </div>

                    <div className="mb-5">
                        <div className="w-full bg-blue-500 text-white text-sm font-semibold text-center py-2 rounded-full">
                            Sign up
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className={`text-2xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>Create your account</h2>
                        <p className={`mt-1.5 text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>Start crafting clearer, sharper posts.</p>
                    </div>

                    <form onSubmit={(e) => { submitFunc(e) }}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="fullname" className="sr-only">Full name</label>
                                <input
                                    onChange={(e) => { handleChange(e) }}
                                    value={form.full_name}
                                    type="text"
                                    id="fullname"
                                    name="full_name"
                                    placeholder="Full name"
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${mode === 'dark'
                                            ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-200 text-black placeholder-gray-500'
                                        }`}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input
                                    onChange={(e) => { handleChange(e) }}
                                    value={form.email}
                                    name="email"
                                    type="email"
                                    id="email"
                                    placeholder="Email"
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${mode === 'dark'
                                            ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-200 text-black placeholder-gray-500'
                                        }`}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    onChange={(e) => { handleChange(e) }}
                                    value={form.password}
                                    name="password"
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${mode === 'dark'
                                            ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-200 text-black placeholder-gray-500'
                                        }`}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="sr-only">Confirm password</label>
                                <input
                                    onChange={(e) => { handleChange(e) }}
                                    value={form.confirm_password}
                                    type="password"
                                    name="confirm_password"
                                    id="confirm-password"
                                    placeholder="Confirm password"
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${mode === 'dark'
                                            ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-200 text-black placeholder-gray-500'
                                        }`}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className={`w-full mt-6 font-semibold py-3 rounded-xl transition-colors duration-300 ${isSubmitDisabled
                                    ? "bg-blue-400 text-white opacity-60 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="text-center mt-5">
                        <p className={`text-sm ${mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            Already have an account? <a href="sign-in" className={`font-semibold hover:text-blue-500 ${mode === 'dark' ? 'text-blue-400' : 'text-blue-600'
                                }`}>Sign In</a>
                        </p>
                        <p className={`mt-3 text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-400'
                            }`}>
                            By continuing, you agree to our Terms and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
