import { useState } from 'react';
import { User, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { grades, mockClasses } from '@/data/mockData';
import { toast } from 'sonner';

interface StudentFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    editingStudent?: {
        id: string;
        name: string;
        registrationNumber: string;
        grade: string;
        class: string;
        parentName?: string;
        parentPhone?: string;
        parentEmail?: string;
    } | null;
}

export function StudentForm({ open, onOpenChange, onSuccess, editingStudent }: StudentFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: editingStudent?.name || '',
        registrationNumber: editingStudent?.registrationNumber || '',
        grade: editingStudent?.grade || '',
        class: editingStudent?.class || '',
        parentName: editingStudent?.parentName || '',
        parentPhone: editingStudent?.parentPhone || '',
        parentEmail: editingStudent?.parentEmail || ''
    });

    const filteredClasses = formData.grade
        ? mockClasses.filter((cls) => cls.grade === formData.grade)
        : mockClasses;

    const updateField = <K extends keyof typeof formData>(
        field: K,
        value: (typeof formData)[K]
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (field === 'grade') {
            setFormData((prev) => ({ ...prev, class: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.registrationNumber.trim() ||
            !formData.grade ||
            !formData.class
        ) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsLoading(false);

        toast.success(
            editingStudent ? 'Aluno atualizado com sucesso!' : 'Aluno cadastrado com sucesso!'
        );
        onOpenChange(false);
        onSuccess?.();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            registrationNumber: '',
            grade: '',
            class: '',
            parentName: '',
            parentPhone: '',
            parentEmail: ''
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) resetForm();
                onOpenChange(isOpen);
            }}
        >
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {editingStudent ? 'Editar Aluno' : 'Novo Aluno'}
                    </DialogTitle>
                    <DialogDescription>
                        {editingStudent
                            ? 'Atualize as informações do aluno'
                            : 'Preencha os dados para cadastrar um novo aluno'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Student info */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2 space-y-2">
                            <Label htmlFor="name">Nome Completo *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                placeholder="Nome do aluno"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="registration">Matrícula *</Label>
                            <Input
                                id="registration"
                                value={formData.registrationNumber}
                                onChange={(e) => updateField('registrationNumber', e.target.value)}
                                placeholder="Ex: 2024001"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Série *</Label>
                            <Select
                                value={formData.grade}
                                onValueChange={(v) => updateField('grade', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    {grades.map((grade) => (
                                        <SelectItem key={grade} value={grade}>
                                            {grade}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Turma *</Label>
                            <Select
                                value={formData.class}
                                onValueChange={(v) => updateField('class', v)}
                                disabled={!formData.grade}
                            >
                                <SelectTrigger>
                                    <SelectValue
                                        placeholder={
                                            formData.grade
                                                ? 'Selecione'
                                                : 'Selecione a série primeiro'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredClasses.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.name}>
                                            {cls.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Parent info */}
                    <div className="pt-4 border-t space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Dados do Responsável (Opcional)
                        </h4>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2 space-y-2">
                                <Label htmlFor="parentName">Nome do Responsável</Label>
                                <Input
                                    id="parentName"
                                    value={formData.parentName}
                                    onChange={(e) => updateField('parentName', e.target.value)}
                                    placeholder="Nome completo"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="parentPhone">Telefone</Label>
                                <Input
                                    id="parentPhone"
                                    value={formData.parentPhone}
                                    onChange={(e) => updateField('parentPhone', e.target.value)}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="parentEmail">Email</Label>
                                <Input
                                    id="parentEmail"
                                    type="email"
                                    value={formData.parentEmail}
                                    onChange={(e) => updateField('parentEmail', e.target.value)}
                                    placeholder="email@exemplo.com"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {editingStudent ? 'Salvar Alterações' : 'Cadastrar Aluno'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
