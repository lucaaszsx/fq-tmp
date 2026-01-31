import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BrandLogo } from '@/components/BrandLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuthStore } from '@/stores/appStore';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Credenciais inválidas. Por favor, verifique seu email e senha.');
            }
        } catch {
            setError('Ocorreu um erro ao fazer login. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-success/50" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-primary-foreground">
                    <div className="max-w-md text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                            <BrandLogo variant="compact" className="!bg-transparent text-white" />
                        </div>
                        <h1 className="text-4xl font-bold">Amélia Figueiredo de Lavor</h1>
                        <p className="text-lg text-primary-foreground/80">
                            Sistema de Controle de Frequência Escolar
                        </p>
                        <div className="pt-8 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    ✓
                                </div>
                                <span>Registro de frequência via QR Code</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    ✓
                                </div>
                                <span>Relatórios em tempo real</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-primary-foreground/70">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                    ✓
                                </div>
                                <span>Notificação automática aos responsáveis</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex flex-1 flex-col justify-center items-center p-6 lg:p-12 bg-background">
                <div className="absolute top-4 right-4">
                    <ThemeToggle />
                </div>

                <div className="w-full max-w-md space-y-8 animate-fade-up">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex flex-col items-center space-y-4">
                        <BrandLogo />
                    </div>

                    <Card className="border-0 shadow-xl lg:border">
                        <CardHeader className="space-y-1 text-center lg:text-left">
                            <CardTitle className="text-2xl font-bold">Bem-vindo(a)!</CardTitle>
                            <CardDescription>
                                Entre com suas credenciais para acessar o sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <Alert variant="destructive" className="animate-scale-in">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="seu.email@escola.edu.br"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Senha</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 pr-10"
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded border-input h-4 w-4 text-primary focus:ring-primary"
                                        />
                                        <span className="text-muted-foreground">Lembrar-me</span>
                                    </label>
                                    <a
                                        href="#"
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Esqueceu a senha?
                                    </a>
                                </div>

                                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Entrando...
                                        </>
                                    ) : (
                                        'Entrar'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <p className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Amélia Figueiredo de Lavor. Todos os direitos
                        reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
