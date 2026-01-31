import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Camera,
    FlipHorizontal,
    Keyboard,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Clock,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScannerStore } from '@/stores/appStore';
import { mockStudents } from '@/data/mockData';
import { cn } from '@/lib/utils';

type ScanResult = {
    id: string;
    studentName: string;
    time: string;
    status: 'success' | 'error' | 'duplicate' | 'late';
    message: string;
};

const statusConfig = {
    success: {
        icon: CheckCircle,
        color: 'text-success',
        bg: 'bg-success/10',
        border: 'border-success',
        label: 'Registrado'
    },
    late: {
        icon: Clock,
        color: 'text-warning',
        bg: 'bg-warning/10',
        border: 'border-warning',
        label: 'Atrasado'
    },
    duplicate: {
        icon: AlertTriangle,
        color: 'text-warning',
        bg: 'bg-warning/10',
        border: 'border-warning',
        label: 'Duplicado'
    },
    error: {
        icon: XCircle,
        color: 'text-destructive',
        bg: 'bg-destructive/10',
        border: 'border-destructive',
        label: 'Erro'
    }
};

export default function ScannerPage() {
    const [manualCode, setManualCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [lastScan, setLastScan] = useState<ScanResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { scanHistory, addScan, clearHistory } = useScannerStore();

    // Mock QR code processing
    const processQRCode = useCallback(
        async (code: string): Promise<ScanResult> => {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const student = mockStudents.find((s) => s.qrCodeId === code);
            const now = new Date();
            const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            if (!student) {
                return {
                    id: Date.now().toString(),
                    studentName: 'Desconhecido',
                    time,
                    status: 'error',
                    message: 'QR Code não reconhecido no sistema'
                };
            }

            // Check for duplicate (mock - would check backend)
            const isDuplicate = scanHistory.some(
                (scan) => scan.studentName === student.name && scan.status !== 'error'
            );

            if (isDuplicate) {
                return {
                    id: Date.now().toString(),
                    studentName: student.name,
                    time,
                    status: 'duplicate',
                    message: 'Frequência já registrada hoje'
                };
            }

            // Check if late (after 7:30)
            const isLate = now.getHours() > 7 || (now.getHours() === 7 && now.getMinutes() > 30);

            return {
                id: Date.now().toString(),
                studentName: student.name,
                time,
                status: isLate ? 'late' : 'success',
                message: isLate ? 'Chegou com atraso' : 'Frequência registrada com sucesso'
            };
        },
        [scanHistory]
    );

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualCode.trim() || isProcessing) return;

        setIsProcessing(true);
        const result = await processQRCode(manualCode.trim());
        setLastScan(result);
        addScan(result);
        setManualCode('');
        setIsProcessing(false);
    };

    // Camera handling
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsScanning(true);
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsScanning(false);
    };

    // Simulate a scan for demo purposes
    const simulateScan = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
        const result = await processQRCode(randomStudent.qrCodeId);
        setLastScan(result);
        addScan(result);
        setIsProcessing(false);
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="page-header">
                <h1 className="page-title">Escanear QR Code</h1>
                <p className="page-description">
                    Registre a frequência dos alunos escaneando o QR Code
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Scanner area */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="camera" className="space-y-4">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="camera" className="gap-2">
                                <Camera className="h-4 w-4" />
                                Câmera
                            </TabsTrigger>
                            <TabsTrigger value="manual" className="gap-2">
                                <Keyboard className="h-4 w-4" />
                                Manual
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="camera" className="space-y-4">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
                                        {isScanning ? (
                                            <>
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    playsInline
                                                    muted
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Scanner overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="scanner-frame">
                                                        <div className="scanner-corner top-0 left-0 border-t-4 border-l-4 rounded-tl-xl" />
                                                        <div className="scanner-corner top-0 right-0 border-t-4 border-r-4 rounded-tr-xl" />
                                                        <div className="scanner-corner bottom-0 left-0 border-b-4 border-l-4 rounded-bl-xl" />
                                                        <div className="scanner-corner bottom-0 right-0 border-b-4 border-r-4 rounded-br-xl" />
                                                        <div className="absolute top-0 left-0 right-0 h-1 bg-primary scanner-line" />
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                                <Camera className="h-16 w-16 text-muted-foreground/50" />
                                                <p className="text-muted-foreground">
                                                    Câmera desativada
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <Button
                                            variant={isScanning ? 'destructive' : 'default'}
                                            onClick={isScanning ? stopCamera : startCamera}
                                            className="flex-1"
                                        >
                                            {isScanning ? 'Parar Câmera' : 'Iniciar Câmera'}
                                        </Button>
                                        <Button variant="outline" size="icon">
                                            <FlipHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Demo button */}
                                    <Button
                                        variant="outline"
                                        className="w-full mt-3"
                                        onClick={simulateScan}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processando...
                                            </>
                                        ) : (
                                            'Simular Leitura (Demo)'
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="manual">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Entrada Manual</CardTitle>
                                    <CardDescription>
                                        Digite o código do QR Code manualmente
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleManualSubmit} className="flex gap-3">
                                        <Input
                                            placeholder="Ex: QR-2024001-AFL"
                                            value={manualCode}
                                            onChange={(e) => setManualCode(e.target.value)}
                                            className="flex-1"
                                            disabled={isProcessing}
                                        />
                                        <Button
                                            type="submit"
                                            disabled={isProcessing || !manualCode.trim()}
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                'Registrar'
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Last scan feedback */}
                    {lastScan && (
                        <Card
                            className={cn(
                                'animate-scale-in border-2',
                                statusConfig[lastScan.status].border
                            )}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        className={cn(
                                            'flex h-14 w-14 items-center justify-center rounded-full',
                                            statusConfig[lastScan.status].bg
                                        )}
                                    >
                                        {(() => {
                                            const Icon = statusConfig[lastScan.status].icon;
                                            return (
                                                <Icon
                                                    className={cn(
                                                        'h-7 w-7',
                                                        statusConfig[lastScan.status].color
                                                    )}
                                                />
                                            );
                                        })()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-lg">
                                            {lastScan.studentName}
                                        </p>
                                        <p className="text-muted-foreground">{lastScan.message}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                statusConfig[lastScan.status].bg,
                                                statusConfig[lastScan.status].color
                                            )}
                                        >
                                            {statusConfig[lastScan.status].label}
                                        </Badge>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {lastScan.time}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Scan history */}
                <Card className="h-fit">
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle>Histórico da Sessão</CardTitle>
                            <CardDescription>{scanHistory.length} registros</CardDescription>
                        </div>
                        {scanHistory.length > 0 && (
                            <Button variant="ghost" size="sm" onClick={clearHistory}>
                                Limpar
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        {scanHistory.length === 0 ? (
                            <div className="empty-state py-8">
                                <Clock className="empty-state-icon" />
                                <p className="empty-state-title">Sem registros</p>
                                <p className="empty-state-description">
                                    Os registros desta sessão aparecerão aqui
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y max-h-[400px] overflow-y-auto">
                                {scanHistory.map((scan) => {
                                    const Icon = statusConfig[scan.status].icon;
                                    return (
                                        <li
                                            key={scan.id}
                                            className="flex items-center gap-3 px-6 py-3"
                                        >
                                            <Icon
                                                className={cn(
                                                    'h-5 w-5 shrink-0',
                                                    statusConfig[scan.status].color
                                                )}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">
                                                    {scan.studentName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {scan.time}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'shrink-0 text-xs',
                                                    statusConfig[scan.status].bg,
                                                    statusConfig[scan.status].color
                                                )}
                                            >
                                                {statusConfig[scan.status].label}
                                            </Badge>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
