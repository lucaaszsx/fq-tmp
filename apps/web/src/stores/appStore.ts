import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Theme store for light/dark mode persistence
interface ThemeState {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'light',
            setTheme: (theme) => {
                set({ theme });
                document.documentElement.classList.toggle('dark', theme === 'dark');
            },
            toggleTheme: () => {
                const newTheme = get().theme === 'light' ? 'dark' : 'light';
                set({ theme: newTheme });
                document.documentElement.classList.toggle('dark', newTheme === 'dark');
            }
        }),
        {
            name: 'afl-theme',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    document.documentElement.classList.toggle('dark', state.theme === 'dark');
                }
            }
        }
    )
);

// Auth store for user session management
interface AuthState {
    user: {
        id: string;
        name: string;
        email: string;
        role: 'admin' | 'teacher' | 'coordination';
    } | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            login: async (email: string, password: string) => {
                // Mock authentication - Replace with real API call
                // This simulates an API request
                await new Promise((resolve) => setTimeout(resolve, 1000));

                if (email && password.length >= 6) {
                    const mockUser = {
                        id: '1',
                        name: 'Maria Silva',
                        email: email,
                        role: 'admin' as const
                    };
                    set({ user: mockUser, isAuthenticated: true });
                    return true;
                }
                return false;
            },
            logout: () => {
                set({ user: null, isAuthenticated: false });
            }
        }),
        {
            name: 'afl-auth'
        }
    )
);

// Scanner session store
interface ScannerState {
    scanHistory: {
        id: string;
        studentName: string;
        time: string;
        status: 'success' | 'error' | 'duplicate' | 'late';
        message: string;
    }[];
    addScan: (scan: ScannerState['scanHistory'][0]) => void;
    clearHistory: () => void;
}

export const useScannerStore = create<ScannerState>((set) => ({
    scanHistory: [],
    addScan: (scan) => set((state) => ({ scanHistory: [scan, ...state.scanHistory] })),
    clearHistory: () => set({ scanHistory: [] })
}));
