import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/appStore';

export function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-lg transition-smooth hover:bg-accent"
            aria-label={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        >
            {theme === 'light' ? (
                <Moon className="h-4 w-4 text-muted-foreground" />
            ) : (
                <Sun className="h-4 w-4 text-muted-foreground" />
            )}
        </Button>
    );
}
