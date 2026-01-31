import { useState } from 'react';
import {
    Upload,
    FileSpreadsheet,
    ArrowRight,
    Check,
    AlertCircle,
    HelpCircle,
    Download
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ColumnMapping {
    systemField: string;
    label: string;
    required: boolean;
    description: string;
}

const systemColumns: ColumnMapping[] = [
    {
        systemField: 'name',
        label: 'Nome do Aluno',
        required: true,
        description: 'Nome completo do aluno'
    },
    {
        systemField: 'registration',
        label: 'Matrícula',
        required: true,
        description: 'Número de matrícula único'
    },
    {
        systemField: 'grade',
        label: 'Série',
        required: true,
        description: 'Série do aluno (ex: 6º Ano)'
    },
    {
        systemField: 'class',
        label: 'Turma',
        required: true,
        description: 'Turma do aluno (ex: 6º Ano A)'
    },
    {
        systemField: 'birthDate',
        label: 'Data de Nascimento',
        required: false,
        description: 'Formato: DD/MM/AAAA'
    },
    {
        systemField: 'parentName',
        label: 'Nome do Responsável',
        required: false,
        description: 'Nome do responsável'
    },
    {
        systemField: 'parentPhone',
        label: 'Telefone',
        required: false,
        description: 'Telefone do responsável'
    },
    {
        systemField: 'parentEmail',
        label: 'Email',
        required: false,
        description: 'Email do responsável'
    }
];

// Simulated file columns (would come from uploaded file)
const mockFileColumns = [
    'Nome Completo',
    'Num. Matrícula',
    'Série Escolar',
    'Turma',
    'Nascimento',
    'Responsável',
    'Contato',
    'Email Responsável'
];

interface StudentImportConfigProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function StudentImportConfig({ open, onOpenChange }: StudentImportConfigProps) {
    const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
    const [mappings, setMappings] = useState<Record<string, string>>({});
    const [hasFile, setHasFile] = useState(false);

    const handleFileSelect = () => {
        // Simulating file selection
        setHasFile(true);
        setStep('mapping');
        toast.success('Arquivo carregado com sucesso!');
    };

    const updateMapping = (systemField: string, fileColumn: string) => {
        setMappings((prev) => ({ ...prev, [systemField]: fileColumn }));
    };

    const requiredFieldsMapped = systemColumns
        .filter((c) => c.required)
        .every((c) => mappings[c.systemField]);

    const handleStartImport = () => {
        toast.success('Configuração salva!', {
            description: 'A importação será iniciada quando o backend estiver disponível'
        });
        onOpenChange(false);
        resetState();
    };

    const resetState = () => {
        setStep('upload');
        setMappings({});
        setHasFile(false);
    };

    const handleDownloadTemplate = () => {
        toast.success('Baixando modelo...', {
            description: 'O arquivo será salvo em sua pasta de downloads'
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) resetState();
                onOpenChange(isOpen);
            }}
        >
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5" />
                        Importar Alunos
                    </DialogTitle>
                    <DialogDescription>
                        Configure a importação de alunos a partir de uma planilha
                    </DialogDescription>
                </DialogHeader>

                {/* Progress steps */}
                <div className="flex items-center justify-center gap-2 py-4">
                    {['upload', 'mapping', 'preview'].map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                                    step === s
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : i < ['upload', 'mapping', 'preview'].indexOf(step)
                                          ? 'border-primary bg-primary/10 text-primary'
                                          : 'border-muted text-muted-foreground'
                                )}
                            >
                                {i < ['upload', 'mapping', 'preview'].indexOf(step) ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    i + 1
                                )}
                            </div>
                            {i < 2 && (
                                <div
                                    className={cn(
                                        'w-12 h-0.5 mx-1',
                                        i < ['upload', 'mapping', 'preview'].indexOf(step)
                                            ? 'bg-primary'
                                            : 'bg-muted'
                                    )}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Upload */}
                {step === 'upload' && (
                    <div className="space-y-4">
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                                    <Upload className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-lg font-medium mb-1">Carregar Planilha</p>
                                <p className="text-sm text-muted-foreground text-center mb-4">
                                    Arraste um arquivo ou clique para selecionar
                                </p>
                                <p className="text-xs text-muted-foreground mb-4">
                                    Formatos suportados: .xlsx, .xls, .csv
                                </p>
                                <Button onClick={handleFileSelect}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Selecionar Arquivo
                                </Button>
                            </CardContent>
                        </Card>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Modelo de Planilha</p>
                                    <p className="text-xs text-muted-foreground">
                                        Baixe um modelo com as colunas corretas
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                                <Download className="mr-2 h-4 w-4" />
                                Baixar Modelo
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Column Mapping */}
                {step === 'mapping' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-info/10 text-info">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p className="text-sm">
                                Associe as colunas do seu arquivo aos campos do sistema
                            </p>
                        </div>

                        <div className="space-y-3">
                            {systemColumns.map((column) => (
                                <div
                                    key={column.systemField}
                                    className="flex items-center gap-4 p-3 rounded-lg border"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">
                                                {column.label}
                                            </span>
                                            {column.required && (
                                                <Badge variant="destructive" className="text-xs">
                                                    Obrigatório
                                                </Badge>
                                            )}
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{column.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>

                                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

                                    <Select
                                        value={mappings[column.systemField] || 'none'}
                                        onValueChange={(v) =>
                                            updateMapping(column.systemField, v === 'none' ? '' : v)
                                        }
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue placeholder="Selecionar coluna" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">-- Não mapear --</SelectItem>
                                            {mockFileColumns.map((col) => (
                                                <SelectItem key={col} value={col}>
                                                    {col}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {mappings[column.systemField] && (
                                        <Check className="h-4 w-4 text-success shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Preview */}
                {step === 'preview' && (
                    <div className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Resumo da Importação</CardTitle>
                                <CardDescription>
                                    Revise as configurações antes de iniciar
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="p-3 rounded-lg bg-muted/50">
                                        <p className="text-xs text-muted-foreground">Arquivo</p>
                                        <p className="font-medium">alunos_2024.xlsx</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted/50">
                                        <p className="text-xs text-muted-foreground">
                                            Total de Linhas
                                        </p>
                                        <p className="font-medium">150 alunos</p>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <p className="text-sm font-medium mb-2">
                                        Mapeamento de Colunas
                                    </p>
                                    <div className="space-y-1">
                                        {Object.entries(mappings)
                                            .filter(([_, v]) => v)
                                            .map(([field, column]) => {
                                                const systemCol = systemColumns.find(
                                                    (c) => c.systemField === field
                                                );
                                                return (
                                                    <div
                                                        key={field}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        <Check className="h-3 w-3 text-success" />
                                                        <span>{systemCol?.label}</span>
                                                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-muted-foreground">
                                                            {column}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 text-warning">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <p className="text-sm">
                                A importação não pode ser desfeita. Verifique os dados antes de
                                continuar.
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    {step !== 'upload' && (
                        <Button
                            variant="outline"
                            onClick={() => setStep(step === 'preview' ? 'mapping' : 'upload')}
                        >
                            Voltar
                        </Button>
                    )}
                    {step === 'mapping' && (
                        <Button onClick={() => setStep('preview')} disabled={!requiredFieldsMapped}>
                            Continuar
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                    {step === 'preview' && (
                        <Button onClick={handleStartImport}>
                            <Check className="mr-2 h-4 w-4" />
                            Salvar Configuração
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
