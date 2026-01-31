import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/stores/appStore';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import QRCodePage from './pages/QRCodePage';
import ScannerPage from './pages/ScannerPage';
import AttendancePage from './pages/AttendancePage';
import StudentsPage from './pages/StudentsPage';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import CalendarPage from './pages/CalendarPage';
import PresentationPage from './pages/PresentationPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <AppLayout>{children}</AppLayout>;
}

const App = () => (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/qr-codes"
                            element={
                                <ProtectedRoute>
                                    <QRCodePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/scanner"
                            element={
                                <ProtectedRoute>
                                    <ScannerPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/attendance"
                            element={
                                <ProtectedRoute>
                                    <AttendancePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/presentation"
                            element={
                                <ProtectedRoute>
                                    <PresentationPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/students"
                            element={
                                <ProtectedRoute>
                                    <StudentsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute>
                                    <UsersPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/roles"
                            element={
                                <ProtectedRoute>
                                    <RolesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/calendar"
                            element={
                                <ProtectedRoute>
                                    <CalendarPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/notifications"
                            element={
                                <ProtectedRoute>
                                    <NotificationsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <SettingsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeProvider>
    </QueryClientProvider>
);

export default App;
