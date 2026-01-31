import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    QrCode,
    ScanLine,
    ClipboardList,
    Users,
    UserCog,
    Bell,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
    Shield,
    CalendarDays,
    Presentation
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/BrandLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/appStore';
import { useState } from 'react';
import { roleLabels } from '@/data/mockData';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Gerar QR Code', href: '/qr-codes', icon: QrCode },
    { name: 'Escanear', href: '/scanner', icon: ScanLine },
    { name: 'Frequência', href: '/attendance', icon: ClipboardList },
    { name: 'Apresentação', href: '/presentation', icon: Presentation },
    { name: 'Alunos', href: '/students', icon: Users },
    { name: 'Usuários', href: '/users', icon: UserCog },
    { name: 'Cargos', href: '/roles', icon: Shield },
    { name: 'Calendário', href: '/calendar', icon: CalendarDays },
    { name: 'Notificações', href: '/notifications', icon: Bell },
    { name: 'Configurações', href: '/settings', icon: Settings }
];

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuthStore();

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-sidebar transition-all duration-300 lg:relative',
                    sidebarOpen ? 'w-64' : 'w-16',
                    mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b px-4">
                    {sidebarOpen ? <BrandLogo /> : <BrandLogo variant="compact" />}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden h-8 w-8 rounded-lg lg:flex"
                    >
                        <ChevronLeft
                            className={cn(
                                'h-4 w-4 transition-transform',
                                !sidebarOpen && 'rotate-180'
                            )}
                        />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3">
                    <ul className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.href}
                                        className={cn(
                                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth',
                                            isActive
                                                ? 'bg-sidebar-accent text-sidebar-primary'
                                                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                        )}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <item.icon
                                            className={cn(
                                                'h-5 w-5 shrink-0',
                                                isActive && 'text-sidebar-primary'
                                            )}
                                        />
                                        {sidebarOpen && <span>{item.name}</span>}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User section */}
                <div className="border-t p-3">
                    {sidebarOpen ? (
                        <div className="mb-3 rounded-lg bg-sidebar-accent p-3">
                            <p className="font-medium text-sm truncate">{user?.name}</p>
                            <p className="text-xs text-sidebar-foreground/70">
                                {user?.role && roleLabels[user.role]}
                            </p>
                        </div>
                    ) : null}
                    <div
                        className={cn(
                            'flex gap-2',
                            sidebarOpen ? 'flex-row' : 'flex-col items-center'
                        )}
                    >
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={logout}
                            className="h-9 w-9 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                            aria-label="Sair"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar (mobile) */}
                <header className="flex h-16 items-center justify-between border-b px-4 lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(true)}
                        className="h-9 w-9"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <BrandLogo />
                    <ThemeToggle />
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="container py-6 lg:py-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
