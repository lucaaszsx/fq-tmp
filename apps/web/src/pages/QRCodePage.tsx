import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, Users, User, Search, Check, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { mockStudents, mockClasses, grades } from '@/data/mockData';
import { toast } from 'sonner';

export default function QRCodePage() {
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    // Filter students based on search
    const filteredStudents = mockStudents.filter(
        (student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.registrationNumber.includes(searchQuery)
    );

    // Filter classes based on grade
    const filteredClasses =
        selectedGrade !== 'all'
            ? mockClasses.filter((cls) => cls.grade === selectedGrade)
            : mockClasses;

    // Get selected student details
    const studentDetails = mockStudents.find((s) => s.id === selectedStudent);

    // Handle bulk selection
    const toggleStudentSelection = (studentId: string) => {
        setSelectedStudents((prev) =>
            prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
        );
    };

    const selectAllFiltered = () => {
        const allIds = filteredStudents.map((s) => s.id);
        setSelectedStudents(allIds);
    };

    const clearSelection = () => {
        setSelectedStudents([]);
    };

    // Mock generate/download functions
    const handleDownloadSingle = () => {
        toast.success('QR Code baixado com sucesso!', {
            description: `Arquivo: QR_${studentDetails?.registrationNumber}.png`
        });
    };

    const handlePrintSingle = () => {
        toast.success('Enviado para impressão!');
    };

    const handleBulkGenerate = async () => {
        if (selectedStudents.length === 0) {
            toast.error('Selecione ao menos um aluno');
            return;
        }

        setIsGenerating(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsGenerating(false);

        toast.success(`${selectedStudents.length} QR Codes gerados!`, {
            description: 'Clique para baixar o arquivo PDF'
        });
    };

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="page-header">
                <h1 className="page-title">Gerar QR Codes</h1>
                <p className="page-description">
                    Gere QR Codes individuais ou em lote para os alunos
                </p>
            </div>

            <Tabs defaultValue="individual" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="individual" className="gap-2">
                        <User className="h-4 w-4" />
                        Individual
                    </TabsTrigger>
                    <TabsTrigger value="batch" className="gap-2">
                        <Users className="h-4 w-4" />
                        Em Lote
                    </TabsTrigger>
                </TabsList>

                {/* Individual QR Code */}
                <TabsContent value="individual" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Student selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Selecionar Aluno</CardTitle>
                                <CardDescription>
                                    Busque e selecione um aluno para gerar o QR Code
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar por nome ou matrícula..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <div className="max-h-64 overflow-y-auto rounded-lg border divide-y">
                                    {filteredStudents.length === 0 ? (
                                        <div className="p-4 text-center text-muted-foreground text-sm">
                                            Nenhum aluno encontrado
                                        </div>
                                    ) : (
                                        filteredStudents.map((student) => (
                                            <button
                                                key={student.id}
                                                onClick={() => setSelectedStudent(student.id)}
                                                className={`w-full flex items-center gap-3 p-3 text-left transition-smooth hover:bg-muted/50 ${
                                                    selectedStudent === student.id
                                                        ? 'bg-primary/5 border-l-2 border-l-primary'
                                                        : ''
                                                }`}
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                    <User className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">
                                                        {student.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {student.registrationNumber} •{' '}
                                                        {student.class}
                                                    </p>
                                                </div>
                                                {selectedStudent === student.id && (
                                                    <Check className="h-4 w-4 text-primary shrink-0" />
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* QR Code preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Visualização do QR Code</CardTitle>
                                <CardDescription>
                                    {studentDetails
                                        ? `QR Code de ${studentDetails.name}`
                                        : 'Selecione um aluno para visualizar'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center space-y-6">
                                {studentDetails ? (
                                    <>
                                        <div className="qr-code-frame bg-white p-4 rounded-xl">
                                            <QRCodeSVG
                                                value={studentDetails.qrCodeId}
                                                size={200}
                                                level="H"
                                                includeMargin={false}
                                                bgColor="#ffffff"
                                                fgColor="#000000"
                                            />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="font-semibold">{studentDetails.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Matrícula: {studentDetails.registrationNumber}
                                            </p>
                                            <Badge variant="secondary">
                                                {studentDetails.class}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button variant="outline" onClick={handlePrintSingle}>
                                                <Printer className="mr-2 h-4 w-4" />
                                                Imprimir
                                            </Button>
                                            <Button onClick={handleDownloadSingle}>
                                                <Download className="mr-2 h-4 w-4" />
                                                Baixar
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="empty-state">
                                        <div className="empty-state-icon">
                                            <User className="h-full w-full" />
                                        </div>
                                        <p className="empty-state-title">
                                            Nenhum aluno selecionado
                                        </p>
                                        <p className="empty-state-description">
                                            Selecione um aluno na lista ao lado para visualizar e
                                            baixar o QR Code
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Batch QR Code generation */}
                <TabsContent value="batch" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Filters */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Filtros</CardTitle>
                                <CardDescription>
                                    Filtre os alunos por série ou turma
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Série</Label>
                                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todas as séries" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas as séries</SelectItem>
                                            {grades.map((grade) => (
                                                <SelectItem key={grade} value={grade}>
                                                    {grade}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Turma</Label>
                                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todas as turmas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas as turmas</SelectItem>
                                            {filteredClasses.map((cls) => (
                                                <SelectItem key={cls.id} value={cls.name}>
                                                    {cls.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="pt-4 space-y-2">
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={selectAllFiltered}
                                    >
                                        Selecionar Todos
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full"
                                        onClick={clearSelection}
                                    >
                                        Limpar Seleção
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Student list */}
                        <Card className="lg:col-span-2">
                            <CardHeader className="flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle>Alunos</CardTitle>
                                    <CardDescription>
                                        {selectedStudents.length} de {mockStudents.length}{' '}
                                        selecionados
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={handleBulkGenerate}
                                    disabled={selectedStudents.length === 0 || isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Gerando...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Gerar PDF
                                        </>
                                    )}
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="max-h-[400px] overflow-y-auto">
                                    <table className="w-full">
                                        <thead className="bg-muted/50 sticky top-0">
                                            <tr>
                                                <th className="p-3 text-left text-xs font-medium text-muted-foreground">
                                                    <Checkbox
                                                        checked={
                                                            selectedStudents.length ===
                                                            mockStudents.length
                                                        }
                                                        onCheckedChange={(checked) =>
                                                            checked
                                                                ? selectAllFiltered()
                                                                : clearSelection()
                                                        }
                                                    />
                                                </th>
                                                <th className="p-3 text-left text-xs font-medium text-muted-foreground">
                                                    Aluno
                                                </th>
                                                <th className="p-3 text-left text-xs font-medium text-muted-foreground">
                                                    Matrícula
                                                </th>
                                                <th className="p-3 text-left text-xs font-medium text-muted-foreground">
                                                    Turma
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {mockStudents.map((student) => (
                                                <tr
                                                    key={student.id}
                                                    className="transition-smooth hover:bg-muted/30"
                                                >
                                                    <td className="p-3">
                                                        <Checkbox
                                                            checked={selectedStudents.includes(
                                                                student.id
                                                            )}
                                                            onCheckedChange={() =>
                                                                toggleStudentSelection(student.id)
                                                            }
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                                                <User className="h-4 w-4 text-muted-foreground" />
                                                            </div>
                                                            <span className="font-medium text-sm">
                                                                {student.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-sm text-muted-foreground">
                                                        {student.registrationNumber}
                                                    </td>
                                                    <td className="p-3">
                                                        <Badge variant="secondary">
                                                            {student.class}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
