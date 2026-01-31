import { useState } from 'react';
import {
    Shield,
    Plus,
    Pencil,
    Trash2,
    Users,
    Check,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Permissions available in the system
const availablePermissions = [
    { id: 'dashboard.view', label: 'Visualizar Dashboard', category: 'Dashboard' },
    { id: 'dashboard.export', label: 'Exportar Relatórios', category: 'Dashboard' },
    { id: 'students.view', label: 'Visualizar Alunos', category: 'Alunos' },
    { id: 'students.create', label: 'Cadastrar Alunos', category: 'Alunos' },
    { id: 'students.edit', label: 'Editar Alunos', category: 'Alunos' },
    { id: 'students.delete', label: 'Remover Alunos', category: 'Alunos' },
    { id: 'attendance.view', label: 'Visualizar Frequência', category: 'Frequência' },
    { id: 'attendance.register', label: 'Registrar Frequência', category: 'Frequência' },
    { id: 'attendance.edit', label: 'Editar Registros', category: 'Frequência' },
    { id: 'qrcode.generate', label: 'Gerar QR Codes', category: 'QR Codes' },
    { id: 'qrcode.bulk', label: 'Gerar QR Codes em Lote', category: 'QR Codes' },
    { id: 'users.view', label: 'Visualizar Usuários', category: 'Usuários' },
    { id: 'users.create', label: 'Criar Usuários', category: 'Usuários' },
    { id: 'users.edit', label: 'Editar Usuários', category: 'Usuários' },
    { id: 'users.delete', label: 'Remover Usuários', category: 'Usuários' },
    { id: 'roles.manage', label: 'Gerenciar Cargos', category: 'Cargos' },
    { id: 'notifications.send', label: 'Enviar Notificações', category: 'Notificações' },
    { id: 'notifications.templates', label: 'Editar Modelos', category: 'Notificações' },
    { id: 'settings.view', label: 'Visualizar Configurações', category: 'Configurações' },
    { id: 'settings.edit', label: 'Editar Configurações', category: 'Configurações' },
    { id: 'calendar.manage', label: 'Gerenciar Calendário', category: 'Calendário' },
    { id: 'presentation.view', label: 'Visualizar Apresentações', category: 'Apresentação' },
    { id: 'presentation.create', label: 'Criar Apresentações', category: 'Apresentação' }
];

// Group permissions by category
const permissionsByCategory = availablePermissions.reduce(
    (acc, perm) => {
        if (!acc[perm.category]) {
            acc[perm.category] = [];
        }
        acc[perm.category].push(perm);
        return acc;
    },
    {} as Record<string, typeof availablePermissions>
);

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    isSystem: boolean;
    userCount: number;
    color: string;
}

const initialRoles: Role[] = [
    {
        id: 'admin',
        name: 'Administrador',
        description:
            'Acesso total ao sistema, incluindo gerenciamento de usuários e configurações.',
        permissions: availablePermissions.map((p) => p.id),
        isSystem: true,
        userCount: 1,
        color: 'primary'
    },
    {
        id: 'teacher',
        name: 'Professor(a)',
        description: 'Pode registrar frequência e visualizar relatórios de suas turmas.',
        permissions: [
            'dashboard.view',
            'students.view',
            'attendance.view',
            'attendance.register',
            'qrcode.generate'
        ],
        isSystem: true,
        userCount: 2,
        color: 'success'
    },
    {
        id: 'coordination',
        name: 'Coordenação',
        description: 'Acesso a relatórios gerais e gestão de frequência de todos os alunos.',
        permissions: [
            'dashboard.view',
            'dashboard.export',
            'students.view',
            'students.edit',
            'attendance.view',
            'attendance.register',
            'attendance.edit',
            'qrcode.generate',
            'qrcode.bulk',
            'notifications.send',
            'presentation.view',
            'presentation.create'
        ],
        isSystem: true,
        userCount: 1,
        color: 'info'
    }
];

const colorOptions = [
    { value: 'primary', label: 'Verde', className: 'bg-primary/10 text-primary border-primary/20' },
    {
        value: 'success',
        label: 'Sucesso',
        className: 'bg-success/10 text-success border-success/20'
    },
    { value: 'info', label: 'Azul', className: 'bg-info/10 text-info border-info/20' },
    {
        value: 'warning',
        label: 'Amarelo',
        className: 'bg-warning/10 text-warning border-warning/20'
    },
    {
        value: 'destructive',
        label: 'Vermelho',
        className: 'bg-destructive/10 text-destructive border-destructive/20'
    }
];

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>(initialRoles);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<string[]>(
        Object.keys(permissionsByCategory)
    );

    // Form state
    const [formName, setFormName] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formPermissions, setFormPermissions] = useState<string[]>([]);
    const [formColor, setFormColor] = useState('primary');

    const resetForm = () => {
        setFormName('');
        setFormDescription('');
        setFormPermissions([]);
        setFormColor('primary');
        setEditingRole(null);
    };

    const openCreateDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    const openEditDialog = (role: Role) => {
        setEditingRole(role);
        setFormName(role.name);
        setFormDescription(role.description);
        setFormPermissions([...role.permissions]);
        setFormColor(role.color);
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!formName.trim()) {
            toast.error('Digite um nome para o cargo');
            return;
        }

        if (editingRole) {
            setRoles(
                roles.map((r) =>
                    r.id === editingRole.id
                        ? {
                              ...r,
                              name: formName,
                              description: formDescription,
                              permissions: formPermissions,
                              color: formColor
                          }
                        : r
                )
            );
            toast.success('Cargo atualizado com sucesso!');
        } else {
            const newRole: Role = {
                id: `role-${Date.now()}`,
                name: formName,
                description: formDescription,
                permissions: formPermissions,
                isSystem: false,
                userCount: 0,
                color: formColor
            };
            setRoles([...roles, newRole]);
            toast.success('Cargo criado com sucesso!');
        }

        setIsDialogOpen(false);
        resetForm();
    };

    const handleDelete = (roleId: string) => {
        const role = roles.find((r) => r.id === roleId);
        if (role?.isSystem) {
            toast.error('Não é possível excluir cargos do sistema');
            return;
        }
        setRoles(roles.filter((r) => r.id !== roleId));
        toast.success('Cargo removido com sucesso!');
    };

    const togglePermission = (permId: string) => {
        setFormPermissions((prev) =>
            prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
        );
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const selectAllInCategory = (category: string) => {
        const categoryPerms = permissionsByCategory[category].map((p) => p.id);
        const allSelected = categoryPerms.every((p) => formPermissions.includes(p));

        if (allSelected) {
            setFormPermissions((prev) => prev.filter((p) => !categoryPerms.includes(p)));
        } else {
            setFormPermissions((prev) => [...new Set([...prev, ...categoryPerms])]);
        }
    };

    const getColorClass = (color: string) => {
        return colorOptions.find((c) => c.value === color)?.className || colorOptions[0].className;
    };

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title">Cargos e Permissões</h1>
                    <p className="page-description">
                        Gerencie os cargos e suas permissões no sistema
                    </p>
                </div>
                <Button onClick={openCreateDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cargo
                </Button>
            </div>

            {/* Roles grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                    <Card key={role.id} className="relative overflow-hidden">
                        <div
                            className={cn(
                                'absolute top-0 left-0 w-1 h-full',
                                getColorClass(role.color).split(' ')[0]
                            )}
                        />
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            'flex h-10 w-10 items-center justify-center rounded-lg',
                                            getColorClass(role.color)
                                        )}
                                    >
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{role.name}</CardTitle>
                                        <CardDescription className="text-xs">
                                            {role.userCount} usuário(s)
                                        </CardDescription>
                                    </div>
                                </div>
                                {!role.isSystem && (
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => openEditDialog(role)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(role.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                {role.isSystem && (
                                    <Badge variant="outline" className="text-xs">
                                        Sistema
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {role.permissions.slice(0, 4).map((permId) => {
                                    const perm = availablePermissions.find((p) => p.id === permId);
                                    return perm ? (
                                        <Badge key={permId} variant="secondary" className="text-xs">
                                            {perm.label}
                                        </Badge>
                                    ) : null;
                                })}
                                {role.permissions.length > 4 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{role.permissions.length - 4} mais
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    if (!open) resetForm();
                    setIsDialogOpen(open);
                }}
            >
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingRole ? 'Editar Cargo' : 'Novo Cargo'}</DialogTitle>
                        <DialogDescription>
                            {editingRole
                                ? 'Atualize as informações e permissões do cargo'
                                : 'Defina o nome, descrição e permissões do novo cargo'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Basic info */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome do Cargo *</Label>
                                <Input
                                    id="name"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="Ex: Secretário(a)"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Cor do Cargo</Label>
                                <div className="flex gap-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => setFormColor(color.value)}
                                            className={cn(
                                                'h-8 w-8 rounded-full border-2 transition-all',
                                                color.className.split(' ')[0],
                                                formColor === color.value
                                                    ? 'ring-2 ring-offset-2 ring-primary'
                                                    : 'opacity-60 hover:opacity-100'
                                            )}
                                            title={color.label}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                placeholder="Descreva as responsabilidades deste cargo..."
                                rows={3}
                            />
                        </div>

                        {/* Permissions */}
                        <div className="space-y-3">
                            <Label>Permissões</Label>
                            <div className="rounded-lg border divide-y">
                                {Object.entries(permissionsByCategory).map(([category, perms]) => {
                                    const isExpanded = expandedCategories.includes(category);
                                    const selectedCount = perms.filter((p) =>
                                        formPermissions.includes(p.id)
                                    ).length;
                                    const allSelected = selectedCount === perms.length;

                                    return (
                                        <Collapsible
                                            key={category}
                                            open={isExpanded}
                                            onOpenChange={() => toggleCategory(category)}
                                        >
                                            <CollapsibleTrigger asChild>
                                                <button className="flex items-center justify-between w-full p-3 hover:bg-muted/50 transition-colors text-left">
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            checked={allSelected}
                                                            onCheckedChange={() =>
                                                                selectAllInCategory(category)
                                                            }
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <span className="font-medium text-sm">
                                                            {category}
                                                        </span>
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {selectedCount}/{perms.length}
                                                        </Badge>
                                                    </div>
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <div className="px-3 pb-3 pt-1 grid gap-2 sm:grid-cols-2">
                                                    {perms.map((perm) => (
                                                        <label
                                                            key={perm.id}
                                                            className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                                                        >
                                                            <Checkbox
                                                                checked={formPermissions.includes(
                                                                    perm.id
                                                                )}
                                                                onCheckedChange={() =>
                                                                    togglePermission(perm.id)
                                                                }
                                                            />
                                                            <span className="text-sm">
                                                                {perm.label}
                                                            </span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave}>
                            {editingRole ? 'Salvar Alterações' : 'Criar Cargo'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
