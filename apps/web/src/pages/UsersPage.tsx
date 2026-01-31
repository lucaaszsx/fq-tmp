import { useState } from 'react';
import { Search, UserPlus, User, Mail, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { roleLabels } from '@/data/mockData';
import { cn } from '@/lib/utils';

type Role = 'admin' | 'teacher' | 'coordination';

interface SystemUser {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: 'active' | 'inactive';
    lastLogin?: string;
}

const mockUsers: SystemUser[] = [
    {
        id: '1',
        name: 'Maria Silva',
        email: 'maria.silva@ameliafigueiredo.edu.br',
        role: 'admin',
        status: 'active',
        lastLogin: '23/01/2024 08:30'
    },
    {
        id: '2',
        name: 'Carlos Pereira',
        email: 'carlos.pereira@ameliafigueiredo.edu.br',
        role: 'teacher',
        status: 'active',
        lastLogin: '23/01/2024 07:45'
    },
    {
        id: '3',
        name: 'Ana Costa',
        email: 'ana.costa@ameliafigueiredo.edu.br',
        role: 'coordination',
        status: 'active',
        lastLogin: '22/01/2024 14:20'
    },
    {
        id: '4',
        name: 'José Santos',
        email: 'jose.santos@ameliafigueiredo.edu.br',
        role: 'teacher',
        status: 'inactive'
    }
];

const roleStyles: Record<Role, string> = {
    admin: 'bg-primary/10 text-primary border-primary/20',
    teacher: 'bg-success/10 text-success border-success/20',
    coordination: 'bg-info/10 text-info border-info/20'
};

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [displayCount, setDisplayCount] = useState(10);

    const filteredUsers = mockUsers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const displayedUsers = filteredUsers.slice(0, displayCount);
    const hasMore = displayCount < filteredUsers.length;

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title">Usuários</h1>
                    <p className="page-description">Gerencie os usuários do sistema</p>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Novo Usuário
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nome ou email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select
                    value={selectedRole}
                    onValueChange={(value) => {
                        setSelectedRole(value);
                        setDisplayCount(10);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filtrar por cargo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos os cargos</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="teacher">Professor(a)</SelectItem>
                        <SelectItem value="coordination">Coordenação</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Users table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Usuários</CardTitle>
                    <CardDescription>
                        {filteredUsers.length} usuário(s) encontrado(s)
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                                        Usuário
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                                        Cargo
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                                        Status
                                    </th>
                                    <th className="p-4 text-left text-xs font-medium text-muted-foreground uppercase">
                                        Último Acesso
                                    </th>
                                    <th className="p-4 text-right text-xs font-medium text-muted-foreground uppercase">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {displayedUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="transition-smooth hover:bg-muted/30"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                    <User className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge
                                                variant="outline"
                                                className={cn(roleStyles[user.role])}
                                            >
                                                {roleLabels[user.role]}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    user.status === 'active'
                                                        ? 'bg-success/10 text-success border-success/20'
                                                        : 'bg-muted text-muted-foreground'
                                                )}
                                            >
                                                {user.status === 'active' ? 'Ativo' : 'Inativo'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-muted-foreground">
                                            {user.lastLogin || 'Nunca'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Remover
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {hasMore && (
                        <div className="p-4 border-t flex justify-center">
                            <Button
                                variant="outline"
                                onClick={() => setDisplayCount((prev) => prev + 10)}
                            >
                                Carregar mais ({filteredUsers.length - displayCount} restantes)
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
