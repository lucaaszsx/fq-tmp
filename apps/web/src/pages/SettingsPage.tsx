import { useState } from 'react';
import { Moon, Sun, Shield, Clock, Bell, GraduationCap, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useThemeStore, useAuthStore } from '@/stores/appStore';
import { BrandLogo } from '@/components/BrandLogo';
import { roleLabels } from '@/data/mockData';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { theme, toggleTheme } = useThemeStore();
    const { user } = useAuthStore();

    // Frequency settings state
    const [entryTime, setEntryTime] = useState('07:00');
    const [toleranceMinutes, setToleranceMinutes] = useState('30');
    const [registrationLimit, setRegistrationLimit] = useState('08:30');
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveFrequencySettings = () => {
        toast.success('Configurações de frequência salvas!');
        setIsEditing(false);
    };

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="page-header">
                <h1 className="page-title">Configurações</h1>
                <p className="page-description">
                    Gerencie as configurações do sistema e suas preferências
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Institutional identity */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            Identidade Institucional
                        </CardTitle>
                        <CardDescription>
                            Informações da instituição configuradas no sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                            <div className="shrink-0">
                                <BrandLogo className="scale-110 origin-left" />
                            </div>
                            <Separator className="sm:hidden" />
                            <div className="hidden sm:block h-16 w-px bg-border shrink-0" />
                            <div className="space-y-1 min-w-0">
                                <p className="font-semibold text-lg">Amélia Figueiredo de Lavor</p>
                                <p className="text-muted-foreground">
                                    Sistema de Controle de Frequência Escolar
                                </p>
                                <p className="text-sm text-muted-foreground">Versão 1.0.0</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {theme === 'light' ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                            Aparência
                        </CardTitle>
                        <CardDescription>Personalize a aparência do sistema</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="theme-toggle">Modo Escuro</Label>
                                <p className="text-sm text-muted-foreground">
                                    Alterne entre os temas claro e escuro
                                </p>
                            </div>
                            <Switch
                                id="theme-toggle"
                                checked={theme === 'dark'}
                                onCheckedChange={toggleTheme}
                            />
                        </div>

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => theme !== 'light' && toggleTheme()}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    theme === 'light'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <Sun className="h-6 w-6" />
                                    <span className="text-sm font-medium">Claro</span>
                                </div>
                            </button>
                            <button
                                onClick={() => theme !== 'dark' && toggleTheme()}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    theme === 'dark'
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'
                                }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <Moon className="h-6 w-6" />
                                    <span className="text-sm font-medium">Escuro</span>
                                </div>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Session & Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Sessão e Segurança
                        </CardTitle>
                        <CardDescription>Informações da sua sessão atual</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div>
                                    <p className="text-sm font-medium">Usuário</p>
                                    <p className="text-sm text-muted-foreground">{user?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div>
                                    <p className="text-sm font-medium">Cargo</p>
                                    <p className="text-sm text-muted-foreground">
                                        {user?.role && roleLabels[user.role]}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <Button variant="outline" className="w-full">
                                Alterar Senha
                            </Button>
                            <Button variant="destructive" className="w-full">
                                Encerrar Sessão
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance settings */}
                <Card>
                    <CardHeader className="flex-row items-start justify-between space-y-0">
                        <div className="space-y-1.5">
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Configurações de Frequência
                            </CardTitle>
                            <CardDescription>
                                Configurações relacionadas ao registro de frequência
                            </CardDescription>
                        </div>
                        {!isEditing ? (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                Editar
                            </Button>
                        ) : (
                            <Button size="sm" onClick={handleSaveFrequencySettings}>
                                <Save className="mr-2 h-4 w-4" />
                                Salvar
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex-1">
                                <p className="text-sm font-medium">Horário de Entrada</p>
                                <p className="text-sm text-muted-foreground">
                                    Início do turno matutino
                                </p>
                            </div>
                            {isEditing ? (
                                <Input
                                    type="time"
                                    value={entryTime}
                                    onChange={(e) => setEntryTime(e.target.value)}
                                    className="w-28"
                                />
                            ) : (
                                <span className="font-mono font-medium">{entryTime}</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex-1">
                                <p className="text-sm font-medium">Tolerância para Atraso</p>
                                <p className="text-sm text-muted-foreground">
                                    Minutos de tolerância
                                </p>
                            </div>
                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={toleranceMinutes}
                                        onChange={(e) => setToleranceMinutes(e.target.value)}
                                        className="w-20"
                                        min={0}
                                        max={120}
                                    />
                                    <span className="text-sm text-muted-foreground">min</span>
                                </div>
                            ) : (
                                <span className="font-mono font-medium">
                                    {toleranceMinutes} min
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex-1">
                                <p className="text-sm font-medium">Limite para Registro</p>
                                <p className="text-sm text-muted-foreground">
                                    Horário máximo de registro
                                </p>
                            </div>
                            {isEditing ? (
                                <Input
                                    type="time"
                                    value={registrationLimit}
                                    onChange={(e) => setRegistrationLimit(e.target.value)}
                                    className="w-28"
                                />
                            ) : (
                                <span className="font-mono font-medium">{registrationLimit}</span>
                            )}
                        </div>
                        {isEditing && (
                            <Button
                                variant="ghost"
                                className="w-full mt-2"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancelar
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Notifications settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notificações
                        </CardTitle>
                        <CardDescription>
                            Configure como as notificações são enviadas
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Notificar Ausências</Label>
                                <p className="text-sm text-muted-foreground">
                                    Enviar mensagem quando aluno faltar
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Notificar Atrasos</Label>
                                <p className="text-sm text-muted-foreground">
                                    Enviar mensagem quando aluno chegar atrasado
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Canal Preferencial</Label>
                                <p className="text-sm text-muted-foreground">
                                    WhatsApp como canal principal
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
