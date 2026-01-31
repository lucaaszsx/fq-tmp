import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Search,
    Download,
    Filter,
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { mockAttendanceRecords, mockClasses, attendanceStatusOptions } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusStyles = {
    present: 'bg-success/10 text-success border-success/20',
    late: 'bg-warning/10 text-warning border-warning/20',
    absent: 'bg-destructive/10 text-destructive border-destructive/20'
};

const statusLabels = {
    present: 'Presente',
    late: 'Atrasado',
    absent: 'Ausente'
};

export default function AttendancePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter records
    const filteredRecords = mockAttendanceRecords.filter((record) => {
        const matchesSearch = record.studentName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = selectedClass === 'all' || record.class === selectedClass;
        const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
        return matchesSearch && matchesClass && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
    const paginatedRecords = filteredRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleExport = (format: 'csv' | 'xlsx') => {
        toast.success(`Exportando para ${format.toUpperCase()}...`, {
            description: `${filteredRecords.length} registros serão exportados`
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedClass('all');
        setSelectedStatus('all');
        setDate(new Date());
        setCurrentPage(1);
    };

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title">Registros de Frequência</h1>
                    <p className="page-description">
                        Visualize e gerencie os registros de frequência dos alunos
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleExport('csv')}>
                        <Download className="mr-2 h-4 w-4" />
                        CSV
                    </Button>
                    <Button variant="outline" onClick={() => handleExport('xlsx')}>
                        <Download className="mr-2 h-4 w-4" />
                        Excel
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-base">Filtros</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {/* Search */}
                        <div className="relative lg:col-span-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome do aluno..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Date picker */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="justify-start text-left font-normal"
                                >
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    {date ? format(date, 'dd/MM/yyyy') : 'Selecionar data'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    locale={ptBR}
                                    className="pointer-events-auto"
                                />
                            </PopoverContent>
                        </Popover>

                        {/* Class filter */}
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="Turma" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as turmas</SelectItem>
                                {mockClasses.map((cls) => (
                                    <SelectItem key={cls.id} value={cls.name}>
                                        {cls.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Status filter */}
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os status</SelectItem>
                                {attendanceStatusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Active filters indicator */}
                    {(searchQuery || selectedClass !== 'all' || selectedStatus !== 'all') && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                            <div className="flex flex-wrap gap-2">
                                {searchQuery && (
                                    <Badge variant="secondary">Busca: {searchQuery}</Badge>
                                )}
                                {selectedClass !== 'all' && (
                                    <Badge variant="secondary">Turma: {selectedClass}</Badge>
                                )}
                                {selectedStatus !== 'all' && (
                                    <Badge variant="secondary">
                                        Status:{' '}
                                        {statusLabels[selectedStatus as keyof typeof statusLabels]}
                                    </Badge>
                                )}
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    Limpar filtros
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Data table */}
            <Card>
                <CardHeader>
                    <CardTitle>Registros</CardTitle>
                    <CardDescription>
                        {filteredRecords.length} registro(s) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Aluno
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Turma
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Data
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Hora
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        Registrado por
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {paginatedRecords.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center">
                                            <div className="empty-state">
                                                <User className="empty-state-icon" />
                                                <p className="empty-state-title">
                                                    Nenhum registro encontrado
                                                </p>
                                                <p className="empty-state-description">
                                                    Tente ajustar os filtros para encontrar
                                                    registros
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedRecords.map((record) => (
                                        <tr
                                            key={record.id}
                                            className="transition-smooth hover:bg-muted/30"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <span className="font-medium">
                                                        {record.studentName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="secondary">{record.class}</Badge>
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {format(new Date(record.date), 'dd/MM/yyyy')}
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {record.time}
                                            </td>
                                            <td className="p-4">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(statusStyles[record.status])}
                                                >
                                                    {statusLabels[record.status]}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {record.scannedBy || '-'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between p-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                                {Math.min(currentPage * itemsPerPage, filteredRecords.length)} de{' '}
                                {filteredRecords.length} registros
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm">
                                    Página {currentPage} de {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
