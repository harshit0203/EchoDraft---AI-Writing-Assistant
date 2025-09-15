"use client"
import React from 'react'
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../slices/userSlice';
import { useColorScheme } from '@mui/material/styles';
import Link from 'next/link';
import {
    LayoutGrid,
    FileText,
    Settings,
    LogOut,
    ChevronDown,
    Home
} from 'lucide-react';

const Icons = {
    Dashboard: () => <LayoutGrid size={20} />,
    Drafts: () => <FileText size={20} />,
    Settings: () => <Settings size={20} />,
    Logout: () => <LogOut size={20} />,
    ChevronDown: () => <ChevronDown size={16} />
};

export default function Sidebar({ children }) {
    const path = usePathname();
    const user = useSelector((state) => state.user.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const { mode } = useColorScheme();

    const publicRoutes = ['/sign-in', '/sign-up'];
    const isPublicRoute = path === '/' || publicRoutes.some(route => path.startsWith(route));

    if (isPublicRoute) {
        return <>{children}</>;
    }

    const getSelectedStyle = () => ({
        color: '#2563eb',
        borderLeftWidth: '2px',
        borderLeftColor: '#2563eb',
        fontWeight: '600',
        backgroundColor: mode === 'dark' ? 'rgba(37, 99, 235, 0.1)' : '#eff6ff',
    });

    const getHoverStyle = () => ({
        backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
    });

    const getSubItemSelectedStyle = () => ({
        color: '#2563eb',
        borderLeftWidth: '2px',
        borderLeftColor: '#2563eb',
        fontWeight: '600',
        backgroundColor: mode === 'dark' ? 'rgba(37, 99, 235, 0.1)' : '#eff6ff',
    });

    const handleLogout = () => {
        dispatch(clearUser());

        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }

        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Strict;';
        document.cookie = 'authToken=; path=/; max-age=0;';

        window.location.href = '/sign-in';
    };


    return (
        <div className="flex h-screen overflow-hidden">
            <aside
                className="w-64 p-6 flex flex-col flex-shrink-0"
                style={{
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    borderRightColor: 'var(--mui-palette-divider)',
                    borderRightWidth: '1px',
                    borderRightStyle: 'solid'
                }}
            >

                <div className="flex items-center gap-3 mb-10">
                    <img src="/echo_draft_logo.png" alt="" width="50" height="60" />
                    <span
                        className="font-bold text-xl"
                        style={{ color: 'var(--mui-palette-text-primary)' }}
                    >
                        EchoDraft
                    </span>
                </div>


                <nav className="flex flex-col space-y-2 flex-grow">
                    <Link
                        href={path === "/" ? "javascript:void(0)" : "/"}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200"
                        style={{
                            ...(path === "/" ? getSelectedStyle() : {
                                color: 'var(--mui-palette-text-secondary)',
                                borderLeftWidth: '2px',
                                borderLeftColor: 'transparent'
                            })
                        }}
                        onMouseEnter={(e) => {
                            if (path !== "/") {
                                Object.assign(e.target.style, getHoverStyle());
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (path !== "/") {
                                e.target.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        <Home size={20} />
                        Home
                    </Link>

                    <Link
                        href={path?.includes("dashboard") ? "javascript:void(0)" : "/dashboard"}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200"
                        style={{
                            ...(path?.includes("dashboard") ? getSelectedStyle() : {
                                color: 'var(--mui-palette-text-secondary)',
                                borderLeftWidth: '2px',
                                borderLeftColor: 'transparent'
                            })
                        }}
                        onMouseEnter={(e) => {
                            if (!path?.includes("dashboard")) {
                                Object.assign(e.target.style, getHoverStyle());
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!path?.includes("dashboard")) {
                                e.target.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        <Icons.Dashboard />
                        Dashboard
                    </Link>

                    <div>
                        <Link
                            href="javascript:void(0)"
                            className="flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition-all duration-200"
                            style={{
                                color: 'var(--mui-palette-text-primary)',
                                fontWeight: '500'
                            }}
                            onMouseEnter={(e) => Object.assign(e.target.style, getHoverStyle())}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            <span className="flex items-center gap-3">
                                <Icons.Drafts />
                                Drafts
                            </span>
                            <Icons.ChevronDown />
                        </Link>

                        <div className="pl-8 pt-2 space-y-1">
                            <Link
                                href={path?.includes("new-draft") ? "javascript:void(0)" : "/drafts/new-draft"}
                                className="block pl-5 py-1.5 text-sm rounded-lg transition-all duration-200"
                                style={{
                                    ...(path?.includes("new-draft") ? getSubItemSelectedStyle() : {
                                        color: 'var(--mui-palette-text-secondary)',
                                        borderLeftWidth: '2px',
                                        borderLeftColor: 'transparent'
                                    })
                                }}
                                onMouseEnter={(e) => {
                                    if (!path?.includes("new-draft")) {
                                        Object.assign(e.target.style, getHoverStyle());
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!path?.includes("new-draft")) {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                New Draft
                            </Link>
                            <Link
                                href={path?.includes("saved-drafts") ? "javascript:void(0)" : "/drafts/saved-drafts"}
                                className="block pl-5 py-1.5 text-sm rounded-lg transition-all duration-200"
                                style={{
                                    ...(path?.includes("saved-drafts") ? getSubItemSelectedStyle() : {
                                        color: 'var(--mui-palette-text-secondary)',
                                        borderLeftWidth: '2px',
                                        borderLeftColor: 'transparent'
                                    })
                                }}
                                onMouseEnter={(e) => {
                                    if (!path?.includes("saved-drafts")) {
                                        Object.assign(e.target.style, getHoverStyle());
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!path?.includes("saved-drafts")) {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                Saved Drafts
                            </Link>
                        </div>
                    </div>

                    <Link
                        href={path?.includes("settings") ? "javascript:void(0)" : "/settings"}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200"
                        style={{
                            ...(path?.includes("settings") ? getSelectedStyle() : {
                                color: 'var(--mui-palette-text-secondary)',
                                borderLeftWidth: '2px',
                                borderLeftColor: 'transparent'
                            })
                        }}
                        onMouseEnter={(e) => {
                            if (!path?.includes("settings")) {
                                Object.assign(e.target.style, getHoverStyle());
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!path?.includes("settings")) {
                                e.target.style.backgroundColor = 'transparent';
                            }
                        }}
                    >
                        <Icons.Settings />
                        Settings
                    </Link>
                </nav>

                <div>
                    <Link
                        href="/sign-in"
                        onClick={() => { handleLogout() }}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200"
                        style={{ color: 'var(--mui-palette-text-secondary)' }}
                        onMouseEnter={(e) => Object.assign(e.target.style, getHoverStyle())}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        <Icons.Logout />
                        Logout
                    </Link>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
