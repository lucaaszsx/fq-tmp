import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendanceChartData } from '@/data/mockData';

interface AttendanceAreaChartProps {
    data: AttendanceChartData[];
}

export function AttendanceAreaChart({ data }: AttendanceAreaChartProps) {
    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Frequência Semanal</CardTitle>
                <CardDescription>Visão geral dos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="h-[280px] sm:h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(var(--success))"
                                        stopOpacity={0.4}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(var(--success))"
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                                <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(var(--warning))"
                                        stopOpacity={0.4}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(var(--warning))"
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                                <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="hsl(var(--destructive))"
                                        stopOpacity={0.4}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="hsl(var(--destructive))"
                                        stopOpacity={0.05}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(var(--border))"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dy={8}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dx={-4}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--popover))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    padding: '12px'
                                }}
                                labelStyle={{
                                    color: 'hsl(var(--foreground))',
                                    fontWeight: 600,
                                    marginBottom: '4px'
                                }}
                                itemStyle={{ padding: '2px 0' }}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: '16px' }}
                                iconType="circle"
                                iconSize={8}
                                formatter={(value) => {
                                    const labels: Record<string, string> = {
                                        present: 'Presentes',
                                        late: 'Atrasados',
                                        absent: 'Ausentes'
                                    };
                                    return (
                                        <span className="text-xs text-muted-foreground ml-1">
                                            {labels[value]}
                                        </span>
                                    );
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="present"
                                stroke="hsl(var(--success))"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorPresent)"
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="late"
                                stroke="hsl(var(--warning))"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorLate)"
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="absent"
                                stroke="hsl(var(--destructive))"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#colorAbsent)"
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--background))' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

interface AttendancePieChartProps {
    present: number;
    late: number;
    absent: number;
}

export function AttendancePieChart({ present, late, absent }: AttendancePieChartProps) {
    const data = [
        { name: 'Presentes', value: present, color: 'hsl(var(--success))' },
        { name: 'Atrasados', value: late, color: 'hsl(var(--warning))' },
        { name: 'Ausentes', value: absent, color: 'hsl(var(--destructive))' }
    ];

    const total = present + late + absent;
    const attendanceRate = (((present + late) / total) * 100).toFixed(1);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Distribuição de Hoje</CardTitle>
                <CardDescription>Status de frequência atual</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center pt-0">
                <div className="h-[180px] sm:h-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius="55%"
                                outerRadius="85%"
                                paddingAngle={3}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--popover))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    padding: '12px'
                                }}
                                formatter={(value: number, name: string) => [
                                    `${value} alunos (${((value / total) * 100).toFixed(1)}%)`,
                                    name
                                ]}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold">{attendanceRate}%</span>
                        <span className="text-xs text-muted-foreground">Taxa</span>
                    </div>
                </div>

                {/* Legend below chart */}
                <div className="flex justify-center gap-4 mt-4 flex-wrap">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-xs text-muted-foreground">
                                {item.name}:{' '}
                                <span className="font-medium text-foreground">{item.value}</span>
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
