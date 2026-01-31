// Mock data and types for Amélia Figueiredo de Lavor Attendance System
// This file contains all mock data that will be replaced by real API calls

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'coordination';
    avatar?: string;
}

export interface Student {
    id: string;
    name: string;
    registrationNumber: string;
    class: string;
    grade: string;
    photo?: string;
    qrCodeId: string;
    parentPhone?: string;
    parentEmail?: string;
    status: 'active' | 'inactive' | 'transferred';
}

export interface AttendanceRecord {
    id: string;
    studentId: string;
    studentName: string;
    class: string;
    date: string;
    time: string;
    status: 'present' | 'late' | 'absent';
    scannedBy?: string;
    notes?: string;
}

export interface DashboardStats {
    totalStudents: number;
    presentToday: number;
    lateToday: number;
    absentToday: number;
    attendanceRate: number;
}

export interface AttendanceChartData {
    date: string;
    present: number;
    late: number;
    absent: number;
}

export interface ClassInfo {
    id: string;
    name: string;
    grade: string;
    shift: 'morning' | 'afternoon' | 'evening';
    teacherId: string;
    studentCount: number;
}

export interface Notification {
    id: string;
    type: 'sms' | 'whatsapp' | 'email';
    recipient: string;
    studentName: string;
    message: string;
    status: 'sent' | 'pending' | 'failed';
    sentAt?: string;
    createdAt: string;
}

// Mock current user
export const mockCurrentUser: User = {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@ameliafigueiredo.edu.br',
    role: 'admin'
};

// Mock students
export const mockStudents: Student[] = [
    {
        id: '1',
        name: 'João Pedro Santos',
        registrationNumber: '2024001',
        class: '6º A',
        grade: '6º Ano',
        qrCodeId: 'QR-2024001-AFL',
        parentPhone: '(85) 99999-1111',
        status: 'active'
    },
    {
        id: '2',
        name: 'Ana Carolina Lima',
        registrationNumber: '2024002',
        class: '6º A',
        grade: '6º Ano',
        qrCodeId: 'QR-2024002-AFL',
        parentPhone: '(85) 99999-2222',
        status: 'active'
    },
    {
        id: '3',
        name: 'Lucas Gabriel Oliveira',
        registrationNumber: '2024003',
        class: '6º B',
        grade: '6º Ano',
        qrCodeId: 'QR-2024003-AFL',
        parentPhone: '(85) 99999-3333',
        status: 'active'
    },
    {
        id: '4',
        name: 'Mariana Costa Souza',
        registrationNumber: '2024004',
        class: '7º A',
        grade: '7º Ano',
        qrCodeId: 'QR-2024004-AFL',
        parentPhone: '(85) 99999-4444',
        status: 'active'
    },
    {
        id: '5',
        name: 'Pedro Henrique Almeida',
        registrationNumber: '2024005',
        class: '7º A',
        grade: '7º Ano',
        qrCodeId: 'QR-2024005-AFL',
        parentPhone: '(85) 99999-5555',
        status: 'active'
    },
    {
        id: '6',
        name: 'Beatriz Fernandes',
        registrationNumber: '2024006',
        class: '7º B',
        grade: '7º Ano',
        qrCodeId: 'QR-2024006-AFL',
        parentPhone: '(85) 99999-6666',
        status: 'active'
    },
    {
        id: '7',
        name: 'Gabriel Silva Moreira',
        registrationNumber: '2024007',
        class: '8º A',
        grade: '8º Ano',
        qrCodeId: 'QR-2024007-AFL',
        parentPhone: '(85) 99999-7777',
        status: 'active'
    },
    {
        id: '8',
        name: 'Isabella Rodrigues',
        registrationNumber: '2024008',
        class: '8º A',
        grade: '8º Ano',
        qrCodeId: 'QR-2024008-AFL',
        parentPhone: '(85) 99999-8888',
        status: 'active'
    }
];

// Mock attendance records
export const mockAttendanceRecords: AttendanceRecord[] = [
    {
        id: '1',
        studentId: '1',
        studentName: 'João Pedro Santos',
        class: '6º A',
        date: '2024-01-23',
        time: '07:15',
        status: 'present',
        scannedBy: 'Maria Silva'
    },
    {
        id: '2',
        studentId: '2',
        studentName: 'Ana Carolina Lima',
        class: '6º A',
        date: '2024-01-23',
        time: '07:20',
        status: 'present',
        scannedBy: 'Maria Silva'
    },
    {
        id: '3',
        studentId: '3',
        studentName: 'Lucas Gabriel Oliveira',
        class: '6º B',
        date: '2024-01-23',
        time: '07:35',
        status: 'late',
        scannedBy: 'Maria Silva',
        notes: 'Trânsito na região'
    },
    {
        id: '4',
        studentId: '4',
        studentName: 'Mariana Costa Souza',
        class: '7º A',
        date: '2024-01-23',
        time: '07:18',
        status: 'present',
        scannedBy: 'Carlos Pereira'
    },
    {
        id: '5',
        studentId: '5',
        studentName: 'Pedro Henrique Almeida',
        class: '7º A',
        date: '2024-01-23',
        time: '-',
        status: 'absent',
        notes: 'Consulta médica'
    },
    {
        id: '6',
        studentId: '6',
        studentName: 'Beatriz Fernandes',
        class: '7º B',
        date: '2024-01-23',
        time: '07:22',
        status: 'present',
        scannedBy: 'Carlos Pereira'
    },
    {
        id: '7',
        studentId: '7',
        studentName: 'Gabriel Silva Moreira',
        class: '8º A',
        date: '2024-01-23',
        time: '07:40',
        status: 'late',
        scannedBy: 'Ana Costa'
    },
    {
        id: '8',
        studentId: '8',
        studentName: 'Isabella Rodrigues',
        class: '8º A',
        date: '2024-01-23',
        time: '07:10',
        status: 'present',
        scannedBy: 'Ana Costa'
    }
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
    totalStudents: 485,
    presentToday: 412,
    lateToday: 28,
    absentToday: 45,
    attendanceRate: 90.7
};

// Mock attendance chart data (last 7 days)
export const mockAttendanceChartData: AttendanceChartData[] = [
    { date: '17/01', present: 420, late: 25, absent: 40 },
    { date: '18/01', present: 415, late: 30, absent: 40 },
    { date: '19/01', present: 425, late: 22, absent: 38 },
    { date: '20/01', present: 410, late: 35, absent: 40 },
    { date: '21/01', present: 418, late: 28, absent: 39 },
    { date: '22/01', present: 422, late: 24, absent: 39 },
    { date: '23/01', present: 412, late: 28, absent: 45 }
];

// Mock classes
export const mockClasses: ClassInfo[] = [
    { id: '1', name: '6º A', grade: '6º Ano', shift: 'morning', teacherId: '1', studentCount: 32 },
    { id: '2', name: '6º B', grade: '6º Ano', shift: 'morning', teacherId: '2', studentCount: 30 },
    { id: '3', name: '7º A', grade: '7º Ano', shift: 'morning', teacherId: '3', studentCount: 35 },
    { id: '4', name: '7º B', grade: '7º Ano', shift: 'morning', teacherId: '4', studentCount: 33 },
    {
        id: '5',
        name: '8º A',
        grade: '8º Ano',
        shift: 'afternoon',
        teacherId: '5',
        studentCount: 31
    },
    {
        id: '6',
        name: '8º B',
        grade: '8º Ano',
        shift: 'afternoon',
        teacherId: '6',
        studentCount: 29
    },
    {
        id: '7',
        name: '9º A',
        grade: '9º Ano',
        shift: 'afternoon',
        teacherId: '7',
        studentCount: 34
    },
    { id: '8', name: '9º B', grade: '9º Ano', shift: 'afternoon', teacherId: '8', studentCount: 32 }
];

// Mock notifications
export const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'whatsapp',
        recipient: '(85) 99999-5555',
        studentName: 'Pedro Henrique Almeida',
        message: 'Informamos que seu filho(a) não compareceu às aulas hoje.',
        status: 'sent',
        sentAt: '2024-01-23T08:30:00',
        createdAt: '2024-01-23T08:30:00'
    },
    {
        id: '2',
        type: 'sms',
        recipient: '(85) 99999-3333',
        studentName: 'Lucas Gabriel Oliveira',
        message: 'Seu filho(a) chegou com atraso hoje às 07:35.',
        status: 'sent',
        sentAt: '2024-01-23T07:40:00',
        createdAt: '2024-01-23T07:40:00'
    },
    {
        id: '3',
        type: 'whatsapp',
        recipient: '(85) 99999-7777',
        studentName: 'Gabriel Silva Moreira',
        message: 'Seu filho(a) chegou com atraso hoje às 07:40.',
        status: 'pending',
        createdAt: '2024-01-23T07:45:00'
    }
];

// Grades list
export const grades = ['6º Ano', '7º Ano', '8º Ano', '9º Ano'];

// Status options
export const attendanceStatusOptions = [
    { value: 'present', label: 'Presente', color: 'success' },
    { value: 'late', label: 'Atrasado', color: 'warning' },
    { value: 'absent', label: 'Ausente', color: 'destructive' }
];

// Role labels in Portuguese
export const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    teacher: 'Professor(a)',
    coordination: 'Coordenação'
};
