'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './firebase';
import { useRouter, usePathname } from 'next/navigation';

interface CombinedUser {
    uid: string;
    email: string | null;
    name?: string;
    role: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    [key: string]: any;
}

interface AuthContextType {
    user: CombinedUser | null;
    loading: boolean;
    signOut: () => Promise<void>;
    getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
    getToken: async () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<CombinedUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const ADMIN_EMAIL = 'hritikcsingh@gmail.com';

    useEffect(() => {
        let refreshInterval: NodeJS.Timeout;

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const token = await firebaseUser.getIdToken(true);
                document.cookie = `urbanvista-token=${token}; path=/; max-age=86400; SameSite=Lax; Secure`;

                let dbData = null;
                try {
                    const res = await fetch('/api/user/profile', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        dbData = data.user;
                    }
                } catch (e) {
                    console.error("Failed to fetch dbUser in context");
                }

                const isAdmin = firebaseUser.email === ADMIN_EMAIL || dbData?.role === 'ADMIN';

                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    name: dbData?.name || firebaseUser.displayName || 'User',
                    role: isAdmin ? 'ADMIN' : (dbData?.role || 'USER'),
                    emailVerified: firebaseUser.emailVerified || dbData?.emailVerified || false,
                    phoneVerified: dbData?.phoneVerified || false,
                });

                // Clear any existing interval
                if (refreshInterval) clearInterval(refreshInterval);
                
                // Set up token refresh interval
                refreshInterval = setInterval(async () => {
                    const currentUser = auth.currentUser;
                    if (currentUser) {
                        const freshToken = await currentUser.getIdToken(true);
                        document.cookie = `urbanvista-token=${freshToken}; path=/; max-age=86400; SameSite=Lax; Secure`;
                    }
                }, 55 * 60 * 1000);

            } else {
                setUser(null);
                document.cookie = 'urbanvista-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                if (refreshInterval) clearInterval(refreshInterval);

                if (pathname.startsWith('/dashboard')) {
                    router.push('/auth');
                }
            }
            setLoading(false);
        });

        return () => {
            unsubscribe();
            if (refreshInterval) clearInterval(refreshInterval);
        };
    }, [pathname, router]);

    const signOut = async () => {
        await firebaseSignOut(auth);
        setUser(null);
        document.cookie = 'urbanvista-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/auth');
    };

    const getToken = async (): Promise<string | null> => {
        const currentUser = auth.currentUser;
        if (!currentUser) return null;
        return await currentUser.getIdToken();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, getToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
