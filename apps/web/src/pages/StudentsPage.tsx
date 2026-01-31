import { useState } from 'react';
import {
    Search,
    User,
    QrCode,
    ChevronRight,
    Mail,
    Phone,
    GraduationCap,
    UserPlus,
    Upload
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { mockStudents, grades, mockClasses } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { StudentForm } from '@/components/students/StudentForm';
import { StudentImportConfig } from '@/components/students/StudentImportConfig';

export default function StudentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<string>('all');
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [selectedStudent, setSelectedStudent] = useState<(typeof mockStudents)[0] | null>(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const [displayCount, setDisplayCount] = useState(8);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

    // Filter students
    const filteredStudents = mockStudents.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.registrationNumber.includes(searchQuery);
        const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
        const matchesClass = selectedClass === 'all' || student.class === selectedClass;
        return matchesSearch && matchesGrade && matchesClass;
    });

    const displayedStudents = filteredStudents.slice(0, displayCount);
    const hasMore = displayCount < filteredStudents.length;

    // Filter classes by grade
    const filteredClasses =
        selectedGrade !== 'all'
            ? mockClasses.filter((cls) => cls.grade === selectedGrade)
            : mockClasses;

    const statusStyles = {
        active: 'bg-success/10 text-success border-success/20',
        inactive: 'bg-muted text-muted-foreground border-muted',
        transferred: 'bg-warning/10 text-warning border-warning/20'
    };

    const statusLabels = {
        active: 'Ativo',
        inactive: 'Inativo',
        transferred: 'Transferido'
    };

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title">Alunos</h1>
                    <p className="page-description">Visualize e gerencie os alunos matriculados</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" />
                        Importar
                    </Button>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Novo Aluno
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome ou matrícula..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select
                    value={selectedGrade}
                    onValueChange={(value) => {
                        setSelectedGrade(value);
                        setSelectedClass('all');
                        setDisplayCount(8);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Série" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {grades.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                                {grade}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={selectedClass}
                    onValueChange={(value) => {
                        setSelectedClass(value);
                        setDisplayCount(8);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Turma" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {filteredClasses.map((cls) => (
                            <SelectItem key={cls.id} value={cls.name}>
                                {cls.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Students grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredStudents.length === 0 ? (
                    <Card className="col-span-full">
                        <CardContent className="empty-state py-16">
                            <User className="empty-state-icon" />
                            <p className="empty-state-title">Nenhum aluno encontrado</p>
                            <p className="empty-state-description">
                                Tente ajustar os filtros para encontrar alunos
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {displayedStudents.map((student) => (
                            <Card
                                key={student.id}
                                className="group cursor-pointer transition-smooth hover:shadow-lg hover:border-primary/20"
                                onClick={() => setSelectedStudent(student)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate group-hover:text-primary transition-colors">
                                                {student.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {student.registrationNumber}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="secondary" className="text-xs">
                                                    {student.class}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-xs',
                                                        statusStyles[student.status]
                                                    )}
                                                >
                                                    {statusLabels[student.status]}
                                                </Badge>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </>
                )}
            </div>

            {/* Load more button */}
            {hasMore && (
                <div className="flex justify-center">
                    <Button variant="outline" onClick={() => setDisplayCount((prev) => prev + 8)}>
                        Carregar mais ({filteredStudents.length - displayCount} restantes)
                    </Button>
                </div>
            )}

            {/* Student detail dialog */}
            <Dialog
                open={!!selectedStudent}
                onOpenChange={(open) => !open && setSelectedStudent(null)}
            >
                <DialogContent className="sm:max-w-lg">
                    {selectedStudent && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Detalhes do Aluno</DialogTitle>
                                <DialogDescription>
                                    Informações de {selectedStudent.name}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Student info */}
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <User className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            {selectedStudent.name}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Matrícula: {selectedStudent.registrationNumber}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Turma</p>
                                            <p className="font-medium">{selectedStudent.class}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">
                                                Telefone do Responsável
                                            </p>
                                            <p className="font-medium">
                                                {selectedStudent.parentPhone || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code section */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <QrCode className="h-4 w-4" />
                                            QR Code do Aluno
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {showQRCode ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="qr-code-frame bg-white p-3 rounded-xl">
                                                    <QRCodeSVG
                                                        value={selectedStudent.qrCodeId}
                                                        size={150}
                                                        level="H"
                                                        bgColor="#ffffff"
                                                        fgColor="#000000"
                                                    />
                                                </div>
                                                <p className="text-sm text-muted-foreground font-mono">
                                                    {selectedStudent.qrCodeId}
                                                </p>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                                onClick={() => setShowQRCode(true)}
                                            >
                                                <QrCode className="mr-2 h-4 w-4" />
                                                Mostrar QR Code
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>

                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Enviar Mensagem
                                    </Button>
                                    <Button className="flex-1">Ver Histórico</Button>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Add Student Dialog */}
            <StudentForm open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

            {/* Import Config Dialog */}
            <StudentImportConfig open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen} />
        </div>
    );
}
