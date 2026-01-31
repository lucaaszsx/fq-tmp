import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Presentation,
    Calendar,
    Clock,
    Users,
    Download,
    Settings2,
    ChevronDown,
    BarChart3,
    PieChart,
    Table2,
    CheckCircle,
    XCircle,
    AlertCircle,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { mockClasses, grades } from '@/data/mockData';
import { toast } from 'sonner';

type ViewMode = 'summary' | 'detailed' | 'chart';
type GroupBy = 'class' | 'grade' | 'date' | 'status';

interface PresentationConfig {
    startDate: Date | undefined;
    endDate: Date | undefined;
    viewMode: ViewMode;
    groupBy: GroupBy;
    selectedGrades: string[];
    selectedClasses: string[];
    showPresent: boolean;
    showLate: boolean;
    showAbsent: boolean;
    showPercentages: boolean;
    showTotals: boolean;
}

// Mock data for presentation
const mockPresentationData = [
    {
        class: '6º Ano A',
        grade: '6º Ano',
        present: 28,
        late: 2,
        absent: 2,
        total: 32,
        date: '2024-01-22'
    },
    {
        class: '6º Ano B',
        grade: '6º Ano',
        present: 26,
        late: 3,
        absent: 1,
        total: 30,
        date: '2024-01-22'
    },
    {
        class: '7º Ano A',
        grade: '7º Ano',
        present: 30,
        late: 1,
        absent: 4,
        total: 35,
        date: '2024-01-22'
    },
    {
        class: '7º Ano B',
        grade: '7º Ano',
        present: 29,
        late: 2,
        absent: 2,
        total: 33,
        date: '2024-01-22'
    },
    {
        class: '8º Ano A',
        grade: '8º Ano',
        present: 27,
        late: 4,
        absent: 1,
        total: 32,
        date: '2024-01-22'
    },
    {
        class: '9º Ano A',
        grade: '9º Ano',
        present: 31,
        late: 1,
        absent: 3,
        total: 35,
        date: '2024-01-22'
    }
];

export default function PresentationPage() {
    const [config, setConfig] = useState<PresentationConfig>({
        startDate: new Date(),
        endDate: new Date(),
        viewMode: 'summary',
        groupBy: 'class',
        selectedGrades: [],
        selectedClasses: [],
        showPresent: true,
        showLate: true,
        showAbsent: true,
        showPercentages: true,
        showTotals: true
    });

    const [isConfigOpen, setIsConfigOpen] = useState(false);

    const updateConfig = <K extends keyof PresentationConfig>(
        key: K,
        value: PresentationConfig[K]
    ) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    const toggleGrade = (grade: string) => {
        setConfig((prev) => ({
            ...prev,
            selectedGrades: prev.selectedGrades.includes(grade)
                ? prev.selectedGrades.filter((g) => g !== grade)
                : [...prev.selectedGrades, grade]
        }));
    };

    const filteredData = mockPresentationData.filter((item) => {
        if (config.selectedGrades.length > 0 && !config.selectedGrades.includes(item.grade)) {
            return false;
        }
        if (config.selectedClasses.length > 0 && !config.selectedClasses.includes(item.class)) {
            return false;
        }
        return true;
    });

    const totals = filteredData.reduce(
        (acc, item) => ({
            present: acc.present + item.present,
            late: acc.late + item.late,
            absent: acc.absent + item.absent,
            total: acc.total + item.total
        }),
        { present: 0, late: 0, absent: 0, total: 0 }
    );

    const handleExport = () => {
        toast.success('Exportando apresentação...', {
            description: 'O arquivo será baixado em instantes'
        });
    };

    const viewModeOptions = [
        { value: 'summary', label: 'Resumo', icon: Table2 },
        { value: 'detailed', label: 'Detalhado', icon: BarChart3 },
        { value: 'chart', label: 'Gráficos', icon: PieChart }
    ];

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title flex items-center gap-3">
                        <Presentation className="h-8 w-8 text-primary" />
                        Apresentação
                    </h1>
                    <p className="page-description">
                        Visualize e exporte dados de frequência em formato de apresentação
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsConfigOpen(!isConfigOpen)}>
                        <Settings2 className="mr-2 h-4 w-4" />
                        Configurar
                        <ChevronDown
                            className={cn(
                                'ml-2 h-4 w-4 transition-transform',
                                isConfigOpen && 'rotate-180'
                            )}
                        />
                    </Button>
                    <Button onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Configuration Panel */}
            {isConfigOpen && (
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base">Configurações da Apresentação</CardTitle>
                        <CardDescription>
                            Personalize o período, métricas e visualização dos dados
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Date range and view mode */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Start Date */}
                            <div className="space-y-2">
                                <Label>Data Inicial</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {config.startDate
                                                ? format(config.startDate, 'dd/MM/yyyy', {
                                                      locale: ptBR
                                                  })
                                                : 'Selecionar'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={config.startDate}
                                            onSelect={(date) => updateConfig('startDate', date)}
                                            initialFocus
                                            className="pointer-events-auto"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* End Date */}
                            <div className="space-y-2">
                                <Label>Data Final</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {config.endDate
                                                ? format(config.endDate, 'dd/MM/yyyy', {
                                                      locale: ptBR
                                                  })
                                                : 'Selecionar'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={config.endDate}
                                            onSelect={(date) => updateConfig('endDate', date)}
                                            initialFocus
                                            className="pointer-events-auto"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* View Mode */}
                            <div className="space-y-2">
                                <Label>Modo de Visualização</Label>
                                <Select
                                    value={config.viewMode}
                                    onValueChange={(v) => updateConfig('viewMode', v as ViewMode)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {viewModeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex items-center gap-2">
                                                    <option.icon className="h-4 w-4" />
                                                    {option.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Group By */}
                            <div className="space-y-2">
                                <Label>Agrupar por</Label>
                                <Select
                                    value={config.groupBy}
                                    onValueChange={(v) => updateConfig('groupBy', v as GroupBy)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="class">Turma</SelectItem>
                                        <SelectItem value="grade">Série</SelectItem>
                                        <SelectItem value="date">Data</SelectItem>
                                        <SelectItem value="status">Status</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Separator />

                        {/* Filters and metrics */}
                        <div className="grid gap-6 sm:grid-cols-2">
                            {/* Grade filter */}
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filtrar por Série
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {grades.map((grade) => (
                                        <Badge
                                            key={grade}
                                            variant={
                                                config.selectedGrades.includes(grade)
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className="cursor-pointer transition-colors"
                                            onClick={() => toggleGrade(grade)}
                                        >
                                            {grade}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Display options */}
                            <div className="space-y-3">
                                <Label>Métricas Exibidas</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Checkbox
                                            checked={config.showPresent}
                                            onCheckedChange={(c) =>
                                                updateConfig('showPresent', !!c)
                                            }
                                        />
                                        <span className="text-sm flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3 text-success" />
                                            Presentes
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Checkbox
                                            checked={config.showLate}
                                            onCheckedChange={(c) => updateConfig('showLate', !!c)}
                                        />
                                        <span className="text-sm flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3 text-warning" />
                                            Atrasados
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Checkbox
                                            checked={config.showAbsent}
                                            onCheckedChange={(c) => updateConfig('showAbsent', !!c)}
                                        />
                                        <span className="text-sm flex items-center gap-1">
                                            <XCircle className="h-3 w-3 text-destructive" />
                                            Ausentes
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Checkbox
                                            checked={config.showPercentages}
                                            onCheckedChange={(c) =>
                                                updateConfig('showPercentages', !!c)
                                            }
                                        />
                                        <span className="text-sm">Percentuais</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Summary stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{totals.total}</p>
                            <p className="text-sm text-muted-foreground">Total de Alunos</p>
                        </div>
                    </CardContent>
                </Card>
                {config.showPresent && (
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                                <CheckCircle className="h-6 w-6 text-success" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-success">{totals.present}</p>
                                <p className="text-sm text-muted-foreground">
                                    Presentes{' '}
                                    {config.showPercentages &&
                                        `(${((totals.present / totals.total) * 100).toFixed(1)}%)`}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
                {config.showLate && (
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                                <Clock className="h-6 w-6 text-warning" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-warning">{totals.late}</p>
                                <p className="text-sm text-muted-foreground">
                                    Atrasados{' '}
                                    {config.showPercentages &&
                                        `(${((totals.late / totals.total) * 100).toFixed(1)}%)`}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
                {config.showAbsent && (
                    <Card>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                                <XCircle className="h-6 w-6 text-destructive" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-destructive">
                                    {totals.absent}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Ausentes{' '}
                                    {config.showPercentages &&
                                        `(${((totals.absent / totals.total) * 100).toFixed(1)}%)`}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Main content - Data table */}
            <Card>
                <CardHeader>
                    <CardTitle>Dados de Frequência</CardTitle>
                    <CardDescription>
                        {config.startDate && config.endDate
                            ? `Período: ${format(config.startDate, 'dd/MM/yyyy')} a ${format(config.endDate, 'dd/MM/yyyy')}`
                            : 'Selecione um período para visualizar os dados'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                                        {config.groupBy === 'class'
                                            ? 'Turma'
                                            : config.groupBy === 'grade'
                                              ? 'Série'
                                              : 'Data'}
                                    </th>
                                    <th className="p-4 text-center text-xs font-medium text-muted-foreground uppercase">
                                        Total
                                    </th>
                                    {config.showPresent && (
                                        <th className="p-4 text-center text-xs font-medium text-muted-foreground uppercase">
                                            <span className="flex items-center justify-center gap-1">
                                                <CheckCircle className="h-3 w-3 text-success" />
                                                Presentes
                                            </span>
                                        </th>
                                    )}
                                    {config.showLate && (
                                        <th className="p-4 text-center text-xs font-medium text-muted-foreground uppercase">
                                            <span className="flex items-center justify-center gap-1">
                                                <AlertCircle className="h-3 w-3 text-warning" />
                                                Atrasados
                                            </span>
                                        </th>
                                    )}
                                    {config.showAbsent && (
                                        <th className="p-4 text-center text-xs font-medium text-muted-foreground uppercase">
                                            <span className="flex items-center justify-center gap-1">
                                                <XCircle className="h-3 w-3 text-destructive" />
                                                Ausentes
                                            </span>
                                        </th>
                                    )}
                                    {config.showPercentages && (
                                        <th className="p-4 text-center text-xs font-medium text-muted-foreground uppercase">
                                            Taxa
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredData.map((item, index) => {
                                    const rate = (
                                        ((item.present + item.late) / item.total) *
                                        100
                                    ).toFixed(1);
                                    return (
                                        <tr
                                            key={index}
                                            className="hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="p-4 font-medium">{item.class}</td>
                                            <td className="p-4 text-center">{item.total}</td>
                                            {config.showPresent && (
                                                <td className="p-4 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-success/10 text-success border-success/20"
                                                    >
                                                        {item.present}
                                                    </Badge>
                                                </td>
                                            )}
                                            {config.showLate && (
                                                <td className="p-4 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-warning/10 text-warning border-warning/20"
                                                    >
                                                        {item.late}
                                                    </Badge>
                                                </td>
                                            )}
                                            {config.showAbsent && (
                                                <td className="p-4 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-destructive/10 text-destructive border-destructive/20"
                                                    >
                                                        {item.absent}
                                                    </Badge>
                                                </td>
                                            )}
                                            {config.showPercentages && (
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-success rounded-full"
                                                                style={{ width: `${rate}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium">
                                                            {rate}%
                                                        </span>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                            {config.showTotals && (
                                <tfoot className="bg-muted/30 font-semibold">
                                    <tr>
                                        <td className="p-4">Total Geral</td>
                                        <td className="p-4 text-center">{totals.total}</td>
                                        {config.showPresent && (
                                            <td className="p-4 text-center text-success">
                                                {totals.present}
                                            </td>
                                        )}
                                        {config.showLate && (
                                            <td className="p-4 text-center text-warning">
                                                {totals.late}
                                            </td>
                                        )}
                                        {config.showAbsent && (
                                            <td className="p-4 text-center text-destructive">
                                                {totals.absent}
                                            </td>
                                        )}
                                        {config.showPercentages && (
                                            <td className="p-4 text-center">
                                                {(
                                                    ((totals.present + totals.late) /
                                                        totals.total) *
                                                    100
                                                ).toFixed(1)}
                                                %
                                            </td>
                                        )}
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
