import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, TrendingUp } from 'lucide-react';
import { DashboardStatsCards } from '@/components/dashboard/StatsCards';
import { AttendanceAreaChart, AttendancePieChart } from '@/components/dashboard/AttendanceCharts';
import { RecentAttendance } from '@/components/dashboard/RecentAttendance';
import {
    mockDashboardStats,
    mockAttendanceChartData,
    mockAttendanceRecords
} from '@/data/mockData';

export default function DashboardPage() {
    const today = format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR });

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-description flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span className="capitalize">{today}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 text-success">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-medium">
                        Taxa de frequência: {mockDashboardStats.attendanceRate}%
                    </span>
                </div>
            </div>

            {/* Stats cards */}
            <DashboardStatsCards
                totalStudents={mockDashboardStats.totalStudents}
                presentToday={mockDashboardStats.presentToday}
                lateToday={mockDashboardStats.lateToday}
                absentToday={mockDashboardStats.absentToday}
            />

            {/* Charts and Recent Activity - Better layout for large screens */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Area chart - spans 8 columns on large screens */}
                <div className="lg:col-span-8">
                    <AttendanceAreaChart data={mockAttendanceChartData} />
                </div>

                {/* Pie chart - spans 4 columns on large screens */}
                <div className="lg:col-span-4">
                    <AttendancePieChart
                        present={mockDashboardStats.presentToday}
                        late={mockDashboardStats.lateToday}
                        absent={mockDashboardStats.absentToday}
                    />
                </div>
            </div>

            {/* Recent attendance - full width for better space usage */}
            <RecentAttendance records={mockAttendanceRecords} />
        </div>
    );
}
