import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, User, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AttendanceRecord } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface RecentAttendanceProps {
    records: AttendanceRecord[];
}

const statusConfig = {
    present: {
        label: 'Presente',
        variant: 'default' as const,
        className: 'bg-success/10 text-success border-success/20 hover:bg-success/20'
    },
    late: {
        label: 'Atrasado',
        variant: 'default' as const,
        className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20'
    },
    absent: {
        label: 'Ausente',
        variant: 'default' as const,
        className:
            'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20'
    }
};

export function RecentAttendance({ records }: RecentAttendanceProps) {
    const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });
    const [showAll, setShowAll] = useState(false);

    const displayedRecords = showAll ? records : records.slice(0, 6);

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <div>
                    <CardTitle>Registros Recentes</CardTitle>
                    <CardDescription className="capitalize">{today}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                    Ver todos
                    <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="p-0">
                {records.length === 0 ? (
                    <div className="empty-state py-8">
                        <Clock className="empty-state-icon" />
                        <p className="empty-state-title">Nenhum registro</p>
                        <p className="empty-state-description">
                            Os registros de frequência aparecerão aqui
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Responsive grid for records */}
                        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
                            {displayedRecords.map((record, index) => (
                                <div
                                    key={record.id}
                                    className="flex items-center gap-3 p-4 bg-card transition-smooth hover:bg-muted/50"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted shrink-0">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">
                                            {record.studentName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {record.class} •{' '}
                                            {record.time !== '-' ? record.time : 'Sem registro'}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'shrink-0',
                                            statusConfig[record.status].className
                                        )}
                                    >
                                        {statusConfig[record.status].label}
                                    </Badge>
                                </div>
                            ))}
                        </div>

                        {/* Show more button */}
                        {records.length > 6 && (
                            <div className="p-4 border-t flex justify-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAll(!showAll)}
                                >
                                    {showAll
                                        ? 'Mostrar menos'
                                        : `Ver mais ${records.length - 6} registros`}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
