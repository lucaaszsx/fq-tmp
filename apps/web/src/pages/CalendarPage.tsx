import { useState } from 'react';
import {
    format,
    isSameDay,
    isSameMonth,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    addMonths,
    subMonths,
    getDay,
    isWeekend
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Plus,
    Trash2,
    Sun,
    Moon,
    PartyPopper,
    BookX,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type EventType = 'holiday' | 'no-class' | 'special';

interface CalendarEvent {
    id: string;
    date: Date;
    title: string;
    type: EventType;
    recurring?: boolean;
}

const eventTypeConfig: Record<
    EventType,
    { label: string; icon: React.ElementType; className: string }
> = {
    'holiday': {
        label: 'Feriado',
        icon: PartyPopper,
        className: 'bg-destructive/10 text-destructive border-destructive/20'
    },
    'no-class': {
        label: 'Sem Aula',
        icon: BookX,
        className: 'bg-warning/10 text-warning border-warning/20'
    },
    'special': {
        label: 'Evento Especial',
        icon: CalendarDays,
        className: 'bg-info/10 text-info border-info/20'
    }
};

const initialEvents: CalendarEvent[] = [
    { id: '1', date: new Date(2024, 0, 1), title: 'Confraternização Universal', type: 'holiday' },
    { id: '2', date: new Date(2024, 1, 12), title: 'Carnaval', type: 'holiday' },
    { id: '3', date: new Date(2024, 1, 13), title: 'Carnaval', type: 'holiday' },
    { id: '4', date: new Date(2024, 3, 21), title: 'Tiradentes', type: 'holiday' },
    { id: '5', date: new Date(2024, 4, 1), title: 'Dia do Trabalho', type: 'holiday' },
    { id: '6', date: new Date(2024, 8, 7), title: 'Independência do Brasil', type: 'holiday' },
    { id: '7', date: new Date(2024, 9, 12), title: 'Nossa Senhora Aparecida', type: 'holiday' },
    { id: '8', date: new Date(2024, 10, 2), title: 'Finados', type: 'holiday' },
    { id: '9', date: new Date(2024, 10, 15), title: 'Proclamação da República', type: 'holiday' },
    { id: '10', date: new Date(2024, 11, 25), title: 'Natal', type: 'holiday' },
    { id: '11', date: new Date(2024, 0, 15), title: 'Reunião de Pais', type: 'no-class' },
    { id: '12', date: new Date(2024, 5, 24), title: 'São João', type: 'special' }
];

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [weekendConfig, setWeekendConfig] = useState({
        saturdayOff: true,
        sundayOff: true
    });

    // Form state
    const [eventTitle, setEventTitle] = useState('');
    const [eventType, setEventType] = useState<EventType>('holiday');

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Add padding days for proper calendar alignment
    const startPadding = getDay(monthStart);
    const paddingDays = Array(startPadding).fill(null);

    const getEventsForDate = (date: Date) => {
        return events.filter((event) => isSameDay(event.date, date));
    };

    const isNonClassDay = (date: Date) => {
        if (weekendConfig.sundayOff && getDay(date) === 0) return true;
        if (weekendConfig.saturdayOff && getDay(date) === 6) return true;
        return events.some(
            (e) => isSameDay(e.date, date) && (e.type === 'holiday' || e.type === 'no-class')
        );
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setEventTitle('');
        setEventType('holiday');
        setIsDialogOpen(true);
    };

    const handleAddEvent = () => {
        if (!selectedDate || !eventTitle.trim()) {
            toast.error('Preencha o título do evento');
            return;
        }

        const newEvent: CalendarEvent = {
            id: `event-${Date.now()}`,
            date: selectedDate,
            title: eventTitle.trim(),
            type: eventType
        };

        setEvents([...events, newEvent]);
        setIsDialogOpen(false);
        toast.success('Evento adicionado com sucesso!');
    };

    const handleDeleteEvent = (eventId: string) => {
        setEvents(events.filter((e) => e.id !== eventId));
        toast.success('Evento removido');
    };

    const upcomingEvents = events
        .filter((e) => e.date >= new Date())
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 5);

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="page-header">
                <h1 className="page-title flex items-center gap-3">
                    <CalendarDays className="h-8 w-8 text-primary" />
                    Calendário Escolar
                </h1>
                <p className="page-description">
                    Configure feriados, dias sem aula e finais de semana
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Calendar */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <h2 className="text-lg font-semibold capitalize">
                                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentMonth(new Date())}
                        >
                            Hoje
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {/* Week days header */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map((day, i) => (
                                <div
                                    key={day}
                                    className={cn(
                                        'text-center text-xs font-medium py-2',
                                        i === 0 || i === 6
                                            ? 'text-muted-foreground'
                                            : 'text-foreground'
                                    )}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {paddingDays.map((_, index) => (
                                <div key={`pad-${index}`} className="aspect-square" />
                            ))}
                            {monthDays.map((day) => {
                                const dayEvents = getEventsForDate(day);
                                const isNonClass = isNonClassDay(day);
                                const isToday = isSameDay(day, new Date());
                                const isWeekendDay = isWeekend(day);

                                return (
                                    <button
                                        key={day.toISOString()}
                                        onClick={() => handleDateClick(day)}
                                        className={cn(
                                            'aspect-square p-1 rounded-lg border transition-all hover:border-primary/50 hover:bg-primary/5 relative',
                                            isToday && 'ring-2 ring-primary ring-offset-2',
                                            isNonClass && 'bg-muted/50',
                                            isWeekendDay && !isNonClass && 'bg-muted/30'
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                'text-sm font-medium',
                                                isToday && 'text-primary',
                                                isWeekendDay && 'text-muted-foreground'
                                            )}
                                        >
                                            {format(day, 'd')}
                                        </span>
                                        {dayEvents.length > 0 && (
                                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                                {dayEvents.slice(0, 3).map((event) => (
                                                    <div
                                                        key={event.id}
                                                        className={cn(
                                                            'w-1.5 h-1.5 rounded-full',
                                                            event.type === 'holiday' &&
                                                                'bg-destructive',
                                                            event.type === 'no-class' &&
                                                                'bg-warning',
                                                            event.type === 'special' && 'bg-info'
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
                            {Object.entries(eventTypeConfig).map(([type, config]) => (
                                <div key={type} className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            'w-3 h-3 rounded-full',
                                            config.className.split(' ')[0]
                                        )}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                        {config.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Weekend config */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                Configuração de Fins de Semana
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="saturday" className="flex items-center gap-2">
                                    <span>Sábado sem aula</span>
                                </Label>
                                <Switch
                                    id="saturday"
                                    checked={weekendConfig.saturdayOff}
                                    onCheckedChange={(c) =>
                                        setWeekendConfig({ ...weekendConfig, saturdayOff: c })
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="sunday" className="flex items-center gap-2">
                                    <span>Domingo sem aula</span>
                                </Label>
                                <Switch
                                    id="sunday"
                                    checked={weekendConfig.sundayOff}
                                    onCheckedChange={(c) =>
                                        setWeekendConfig({ ...weekendConfig, sundayOff: c })
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming events */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Próximos Eventos</CardTitle>
                            <CardDescription>Feriados e dias sem aula</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingEvents.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Nenhum evento próximo
                                </p>
                            ) : (
                                upcomingEvents.map((event) => {
                                    const config = eventTypeConfig[event.type];
                                    const Icon = config.icon;
                                    return (
                                        <div
                                            key={event.id}
                                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 group"
                                        >
                                            <div
                                                className={cn(
                                                    'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                                                    config.className
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {event.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(event.date, "d 'de' MMMM", {
                                                        locale: ptBR
                                                    })}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleDeleteEvent(event.id)}
                                            >
                                                <Trash2 className="h-3 w-3 text-destructive" />
                                            </Button>
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick stats */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Resumo do Ano</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center p-3 rounded-lg bg-destructive/10">
                                    <p className="text-2xl font-bold text-destructive">
                                        {events.filter((e) => e.type === 'holiday').length}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Feriados</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-warning/10">
                                    <p className="text-2xl font-bold text-warning">
                                        {events.filter((e) => e.type === 'no-class').length}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Dias sem aula</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Add event dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Evento</DialogTitle>
                        <DialogDescription>
                            {selectedDate &&
                                format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedDate && (
                        <div className="space-y-4 py-4">
                            {/* Existing events for this date */}
                            {getEventsForDate(selectedDate).length > 0 && (
                                <div className="space-y-2">
                                    <Label>Eventos neste dia</Label>
                                    <div className="space-y-2">
                                        {getEventsForDate(selectedDate).map((event) => {
                                            const config = eventTypeConfig[event.type];
                                            return (
                                                <div
                                                    key={event.id}
                                                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Badge
                                                            variant="outline"
                                                            className={config.className}
                                                        >
                                                            {config.label}
                                                        </Badge>
                                                        <span className="text-sm">
                                                            {event.title}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7"
                                                        onClick={() => handleDeleteEvent(event.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3 text-destructive" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Separator className="my-4" />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="title">Título do Evento</Label>
                                <Input
                                    id="title"
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                    placeholder="Ex: Feriado Municipal"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Tipo de Evento</Label>
                                <Select
                                    value={eventType}
                                    onValueChange={(v) => setEventType(v as EventType)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(eventTypeConfig).map(([type, config]) => {
                                            const Icon = config.icon;
                                            return (
                                                <SelectItem key={type} value={type}>
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="h-4 w-4" />
                                                        {config.label}
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleAddEvent}>
                            <Plus className="mr-2 h-4 w-4" />
                            Adicionar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
