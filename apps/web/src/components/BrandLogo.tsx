import { GraduationCap } from 'lucide-react';

interface BrandLogoProps {
    variant?: 'default' | 'compact';
    className?: string;
}

export function BrandLogo({ variant = 'default', className = '' }: BrandLogoProps) {
    if (variant === 'compact') {
        return (
            <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shrink-0 ${className}`}
            >
                <GraduationCap className="h-5 w-5" />
            </div>
        );
    }

    return (
        <div className={`brand-logo ${className}`}>
            <div className="brand-icon">
                <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
                <span className="brand-text">Amélia Figueiredo</span>
                <span className="brand-subtitle">de Lavor</span>
            </div>
        </div>
    );
}
