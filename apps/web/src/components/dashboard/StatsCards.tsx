import { LucideIcon, Users, CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
    className?: string;
}

const variantStyles = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
    info: 'text-info'
};

const iconBgStyles = {
    default: 'bg-primary/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    destructive: 'bg-destructive/10',
    info: 'bg-info/10'
};

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    variant = 'default',
    className
}: StatsCardProps) {
    return (
        <div className={cn('stats-card group', className)}>
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className={cn('text-3xl font-bold tracking-tight', variantStyles[variant])}>
                        {value}
                    </p>
                    {description && <p className="text-xs text-muted-foreground">{description}</p>}
                    {trend && (
                        <div className="flex items-center gap-1">
                            <span
                                className={cn(
                                    'text-xs font-medium',
                                    trend.isPositive ? 'text-success' : 'text-destructive'
                                )}
                            >
                                {trend.isPositive ? '+' : '-'}
                                {Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-muted-foreground">vs. ontem</span>
                        </div>
                    )}
                </div>
                <div
                    className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
                        iconBgStyles[variant]
                    )}
                >
                    <Icon className={cn('h-6 w-6', variantStyles[variant])} />
                </div>
            </div>
            <div className="stats-card-icon" />
        </div>
    );
}

// Pre-configured stats cards for dashboard
interface DashboardStatsProps {
    totalStudents: number;
    presentToday: number;
    lateToday: number;
    absentToday: number;
}

export function DashboardStatsCards({
    totalStudents,
    presentToday,
    lateToday,
    absentToday
}: DashboardStatsProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
                title="Total de Alunos"
                value={totalStudents}
                description="Alunos matriculados"
                icon={Users}
                variant="info"
            />
            <StatsCard
                title="Presentes Hoje"
                value={presentToday}
                description={`${((presentToday / totalStudents) * 100).toFixed(1)}% do total`}
                icon={CheckCircle}
                variant="success"
                trend={{ value: 2.5, isPositive: true }}
            />
            <StatsCard
                title="Atrasados Hoje"
                value={lateToday}
                description={`${((lateToday / totalStudents) * 100).toFixed(1)}% do total`}
                icon={Clock}
                variant="warning"
                trend={{ value: 1.2, isPositive: false }}
            />
            <StatsCard
                title="Ausentes Hoje"
                value={absentToday}
                description={`${((absentToday / totalStudents) * 100).toFixed(1)}% do total`}
                icon={XCircle}
                variant="destructive"
                trend={{ value: 0.8, isPositive: false }}
            />
        </div>
    );
}
