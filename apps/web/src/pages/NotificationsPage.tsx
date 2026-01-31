import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    MessageSquare,
    Phone,
    Mail,
    CheckCircle,
    Clock,
    XCircle,
    Filter,
    RefreshCw,
    Pencil,
    Save,
    X,
    Settings,
    UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockNotifications } from '@/data/mockData';
import { cn } from '@/lib/utils';

const typeIcons = {
    whatsapp: MessageSquare,
    sms: Phone,
    email: Mail
};

const typeLabels = {
    whatsapp: 'WhatsApp',
    sms: 'SMS',
    email: 'Email'
};

const statusConfig = {
    sent: {
        icon: CheckCircle,
        label: 'Enviado',
        className: 'bg-success/10 text-success border-success/20'
    },
    pending: {
        icon: Clock,
        label: 'Pendente',
        className: 'bg-warning/10 text-warning border-warning/20'
    },
    failed: {
        icon: XCircle,
        label: 'Falhou',
        className: 'bg-destructive/10 text-destructive border-destructive/20'
    }
};

interface MessageTemplate {
    id: string;
    name: string;
    type: 'absence' | 'late' | 'presence';
    content: string;
}

const defaultTemplates: MessageTemplate[] = [
    {
        id: '1',
        name: 'Notificação de Ausência',
        type: 'absence',
        content:
            'Prezado(a) responsável, informamos que seu filho(a) [Nome do Aluno] não compareceu às aulas hoje na escola Amélia Figueiredo de Lavor. Em caso de dúvidas, entre em contato com a coordenação.'
    },
    {
        id: '2',
        name: 'Notificação de Atraso',
        type: 'late',
        content:
            'Prezado(a) responsável, informamos que seu filho(a) [Nome do Aluno] chegou com atraso hoje às [Horário] na escola Amélia Figueiredo de Lavor.'
    },
    {
        id: '3',
        name: 'Confirmação de Presença',
        type: 'presence',
        content:
            'Prezado(a) responsável, confirmamos que seu filho(a) [Nome do Aluno] está presente na escola Amélia Figueiredo de Lavor hoje, [Data]. Horário de entrada: [Horário].'
    }
];

export default function NotificationsPage() {
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [displayCount, setDisplayCount] = useState(5);
    const [templates, setTemplates] = useState<MessageTemplate[]>(defaultTemplates);
    const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState('');
    const [editedName, setEditedName] = useState('');

    const filteredNotifications = mockNotifications.filter((notification) => {
        const matchesType = selectedType === 'all' || notification.type === selectedType;
        const matchesStatus = selectedStatus === 'all' || notification.status === selectedStatus;
        return matchesType && matchesStatus;
    });

    const displayedNotifications = filteredNotifications.slice(0, displayCount);
    const hasMore = displayCount < filteredNotifications.length;

    const stats = {
        total: mockNotifications.length,
        sent: mockNotifications.filter((n) => n.status === 'sent').length,
        pending: mockNotifications.filter((n) => n.status === 'pending').length,
        failed: mockNotifications.filter((n) => n.status === 'failed').length
    };

    const handleEditTemplate = (template: MessageTemplate) => {
        setEditingTemplate(template.id);
        setEditedContent(template.content);
        setEditedName(template.name);
    };

    const handleSaveTemplate = (id: string) => {
        setTemplates((prev) =>
            prev.map((t) => (t.id === id ? { ...t, content: editedContent, name: editedName } : t))
        );
        setEditingTemplate(null);
    };

    const handleCancelEdit = () => {
        setEditingTemplate(null);
        setEditedContent('');
        setEditedName('');
    };

    const getTemplateIcon = (type: MessageTemplate['type']) => {
        switch (type) {
            case 'presence':
                return UserCheck;
            case 'late':
                return Clock;
            case 'absence':
                return XCircle;
            default:
                return MessageSquare;
        }
    };

    const getTemplateColor = (type: MessageTemplate['type']) => {
        switch (type) {
            case 'presence':
                return 'bg-success/10 text-success border-success/20';
            case 'late':
                return 'bg-warning/10 text-warning border-warning/20';
            case 'absence':
                return 'bg-destructive/10 text-destructive border-destructive/20';
            default:
                return 'bg-muted';
        }
    };

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title">Notificações</h1>
                    <p className="page-description">
                        Acompanhe as notificações enviadas aos responsáveis
                    </p>
                </div>
                <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Atualizar
                </Button>
            </div>

            {/* Stats cards */}
            <div className="grid gap-4 sm:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Enviadas</p>
                                <p className="text-2xl font-bold text-success">{stats.sent}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-success/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Pendentes</p>
                                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                            </div>
                            <Clock className="h-8 w-8 text-warning/50" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Falhas</p>
                                <p className="text-2xl font-bold text-destructive">
                                    {stats.failed}
                                </p>
                            </div>
                            <XCircle className="h-8 w-8 text-destructive/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="history" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="history">Histórico</TabsTrigger>
                    <TabsTrigger value="templates" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Modelos de Mensagem
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="space-y-6">
                    {/* Filters */}
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <CardTitle className="text-base">Filtros</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Select
                                    value={selectedType}
                                    onValueChange={(value) => {
                                        setSelectedType(value);
                                        setDisplayCount(5);
                                    }}
                                >
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="Tipo de notificação" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os tipos</SelectItem>
                                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                        <SelectItem value="sms">SMS</SelectItem>
                                        <SelectItem value="email">Email</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedStatus}
                                    onValueChange={(value) => {
                                        setSelectedStatus(value);
                                        setDisplayCount(5);
                                    }}
                                >
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os status</SelectItem>
                                        <SelectItem value="sent">Enviado</SelectItem>
                                        <SelectItem value="pending">Pendente</SelectItem>
                                        <SelectItem value="failed">Falhou</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications list */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Notificações</CardTitle>
                            <CardDescription>
                                {filteredNotifications.length} notificação(ões) encontrada(s)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {filteredNotifications.length === 0 ? (
                                <div className="empty-state py-16">
                                    <MessageSquare className="empty-state-icon" />
                                    <p className="empty-state-title">Nenhuma notificação</p>
                                    <p className="empty-state-description">
                                        As notificações enviadas aparecerão aqui
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <ul className="divide-y">
                                        {displayedNotifications.map((notification) => {
                                            const TypeIcon = typeIcons[notification.type];
                                            const StatusIcon =
                                                statusConfig[notification.status].icon;
                                            return (
                                                <li
                                                    key={notification.id}
                                                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 transition-smooth hover:bg-muted/30"
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                                            <TypeIcon className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <p className="font-medium">
                                                                    {notification.studentName}
                                                                </p>
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {typeLabels[notification.type]}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground truncate">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                Para: {notification.recipient}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 sm:shrink-0">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                'gap-1',
                                                                statusConfig[notification.status]
                                                                    .className
                                                            )}
                                                        >
                                                            <StatusIcon className="h-3 w-3" />
                                                            {
                                                                statusConfig[notification.status]
                                                                    .label
                                                            }
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                                                            {notification.sentAt
                                                                ? format(
                                                                      new Date(notification.sentAt),
                                                                      'dd/MM HH:mm',
                                                                      { locale: ptBR }
                                                                  )
                                                                : format(
                                                                      new Date(
                                                                          notification.createdAt
                                                                      ),
                                                                      'dd/MM HH:mm',
                                                                      { locale: ptBR }
                                                                  )}
                                                        </span>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    {hasMore && (
                                        <div className="p-4 border-t flex justify-center">
                                            <Button
                                                variant="outline"
                                                onClick={() => setDisplayCount((prev) => prev + 5)}
                                            >
                                                Carregar mais (
                                                {filteredNotifications.length - displayCount}{' '}
                                                restantes)
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="templates" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Configuração de Modelos
                            </CardTitle>
                            <CardDescription>
                                Configure os modelos de mensagens enviadas automaticamente aos
                                responsáveis. Use [Nome do Aluno], [Horário], e [Data] como
                                variáveis.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {templates.map((template) => {
                                const TemplateIcon = getTemplateIcon(template.type);
                                const isEditing = editingTemplate === template.id;

                                return (
                                    <div
                                        key={template.id}
                                        className="p-4 rounded-lg bg-muted/50 border space-y-4"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={cn(
                                                        'flex h-10 w-10 items-center justify-center rounded-full shrink-0',
                                                        getTemplateColor(template.type)
                                                    )}
                                                >
                                                    <TemplateIcon className="h-5 w-5" />
                                                </div>
                                                {isEditing ? (
                                                    <Input
                                                        value={editedName}
                                                        onChange={(e) =>
                                                            setEditedName(e.target.value)
                                                        }
                                                        className="font-medium max-w-xs"
                                                    />
                                                ) : (
                                                    <div>
                                                        <p className="font-medium">
                                                            {template.name}
                                                        </p>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                'text-xs mt-1',
                                                                getTemplateColor(template.type)
                                                            )}
                                                        >
                                                            {template.type === 'presence'
                                                                ? 'Presença'
                                                                : template.type === 'late'
                                                                  ? 'Atraso'
                                                                  : 'Ausência'}
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={handleCancelEdit}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            Cancelar
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                handleSaveTemplate(template.id)
                                                            }
                                                        >
                                                            <Save className="h-4 w-4 mr-1" />
                                                            Salvar
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditTemplate(template)}
                                                    >
                                                        <Pencil className="h-4 w-4 mr-1" />
                                                        Editar
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <Label htmlFor={`template-${template.id}`}>
                                                    Conteúdo da mensagem
                                                </Label>
                                                <Textarea
                                                    id={`template-${template.id}`}
                                                    value={editedContent}
                                                    onChange={(e) =>
                                                        setEditedContent(e.target.value)
                                                    }
                                                    rows={4}
                                                    className="resize-none"
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Variáveis disponíveis: [Nome do Aluno],
                                                    [Horário], [Data]
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                {template.content}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
