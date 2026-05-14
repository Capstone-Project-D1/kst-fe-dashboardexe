import {
  Activity,
  Package,
  TrendingUp,
  TrendingDown,
  Users,
  ClipboardList,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart"

// Mock data for collaboration chart
const collaborationData = [
  { month: "Januari", ngijo: 400, jatikerto: 600 },
  { month: "Februari", ngijo: 550, jatikerto: 350 },
  { month: "Maret", ngijo: 450, jatikerto: 550 },
  { month: "April", ngijo: 580, jatikerto: 420 },
  { month: "Mei", ngijo: 480, jatikerto: 400 },
  { month: "Juni", ngijo: 500, jatikerto: 600 },
  { month: "Juli", ngijo: 550, jatikerto: 500 },
]

const collaborationConfig = {
  ngijo: {
    label: "Mitra KST Ngijo",
    color: "#3B82F6",
  },
  jatikerto: {
    label: "Mitra KST Jatikerto",
    color: "#27A376",
  },
} satisfies ChartConfig

// Mock data for research projects chart
const researchData = [
  { month: "Jan", value: 1000 },
  { month: "Feb", value: 1400 },
  { month: "Mar", value: 1200 },
  { month: "Apr", value: 800 },
  { month: "May", value: 1100 },
  { month: "Jun", value: 1500 },
]

const researchConfig = {
  value: {
    label: "Proyek Riset",
    color: "#3B82F6",
  },
} satisfies ChartConfig

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-gray-50/50 min-h-screen">
      {/* SECTION 1: Summary Cards (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total KST Aktif */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center gap-3 pb-2 space-y-0">
            <div className="p-2 bg-[#27A376] rounded-lg">
              <Activity className="size-5 text-white" />
            </div>
            <CardTitle className="text-sm font-semibold text-gray-700">Total KST Aktif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">3 dari 5 KST</div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className="border-gray-200 text-gray-600 font-bold text-[10px] h-6 px-2.5 rounded-full">KST Ngijo</Badge>
              <Badge variant="outline" className="border-gray-200 text-gray-600 font-bold text-[10px] h-6 px-2.5 rounded-full">KST Cangar</Badge>
              <Badge variant="outline" className="border-gray-200 text-gray-600 font-bold text-[10px] h-6 px-2.5 rounded-full">KST Jatikerto</Badge>
              <Badge variant="outline" className="border-gray-200 text-gray-300 font-bold text-[10px] h-6 px-2.5 rounded-full">KST Kepanjen</Badge>
              <Badge variant="outline" className="border-gray-200 text-gray-300 font-bold text-[10px] h-6 px-2.5 rounded-full">KST Tegalweru</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Total Produksi */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#27A376] rounded-lg text-white">
                <Package className="size-5" />
              </div>
              <CardTitle className="text-sm font-semibold text-gray-700">Total Produksi</CardTitle>
            </div>
            <div className="flex gap-1.5">
              <Badge variant="outline" className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full">KST Ngijo</Badge>
              <Badge variant="outline" className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full">KST Jatikerto</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight">1.500</div>
              <Badge className="bg-[#E9F7F2] text-[#27A376] border-none text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <TrendingUp className="size-3" />
                +15%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-[14px] font-bold text-gray-800">Peningkatan 12.5% dari bulan lalu</p>
              <p className="text-[12px] text-gray-400 font-medium">Total barang pada bulan ini meningkat sebesar 15%.</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Operasional Aktif */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#27A376] rounded-lg text-white">
                <Package className="size-5" />
              </div>
              <CardTitle className="text-sm font-semibold text-gray-700">Total Operasional Aktif</CardTitle>
            </div>
            <Badge variant="outline" className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full">KST Cangar</Badge>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight">1.500</div>
              <Badge className="bg-[#E9F7F2] text-[#27A376] border-none text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <TrendingUp className="size-3" />
                +5%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-[14px] font-bold text-gray-800">Peningkatan 12.5% dari bulan lalu</p>
              <p className="text-[12px] text-gray-400 font-medium">Total barang pada bulan ini meningkat sebesar 5%.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 2: Charts (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 5: Total Proyek Riset Aktif */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#27A376] rounded-lg text-white">
                <ClipboardList className="size-5" />
              </div>
              <CardTitle className="text-sm font-semibold text-gray-700">Total Proyek Riset Aktif</CardTitle>
            </div>
            <Badge variant="outline" className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full">KST Ngijo</Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer config={researchConfig} className="h-[200px] w-full mb-4">
              <AreaChart data={researchData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ChartContainer>
            <div className="flex items-center justify-between mb-8">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
                <span key={m} className="text-[11px] text-gray-400 font-medium">{m}</span>
              ))}
            </div>

          </CardContent>
        </Card>

        {/* Card 6: Sustainability Index */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#27A376] rounded-lg text-white">
                <TrendingUp className="size-5" />
              </div>
              <CardTitle className="text-sm font-semibold text-gray-700">Sustainability Index</CardTitle>
            </div>
            <Badge variant="outline" className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full">KST Ngijo</Badge>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-extrabold text-gray-900 tracking-tight">1.500</span>
              <Badge className="bg-[#E9F7F2] text-[#27A376] border-none text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <TrendingUp className="size-3" />
                +15%
              </Badge>
            </div>
            <div className="space-y-3">
              <p className="text-[14px] font-bold text-gray-800">Peningkatan 12.5% dari bulan lalu</p>
              <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                Total barang pada bulan ini meningkat sebesar 15%.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3: Large Detailed Stats (1 Column) */}
      <div className="grid grid-cols-1 gap-4">
        {/* Card 4: Total Mitra/Kolaborasi */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#27A376] rounded-lg text-white">
                <Users className="size-5" />
              </div>
              <CardTitle className="text-sm font-semibold text-gray-700">Total Mitra/Kolaborasi</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full">KST Ngijo</Badge>
              <Badge variant="outline" className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full">KST Jatikerto</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-[#F8F9FA] rounded-2xl p-6 mb-4">
              <p className="text-[11px] font-medium text-gray-400 mb-6">Selama 6 Bulan terakhir</p>
              <ChartContainer config={collaborationConfig} className="h-[200px] w-full">
                <BarChart data={collaborationData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#9CA3AF', fontWeight: 500 }}
                  />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="ngijo" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={28} />
                  <Bar dataKey="jatikerto" fill="#27A376" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ChartContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F8F9FA] p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-blue-500" />
                  <span className="text-[12px] font-bold text-gray-700">Mitra KST Ngijo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-gray-900 tracking-tight">500</span>
                  <Badge className="bg-[#E9F7F2] text-[#27A376] border-none text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <TrendingUp className="size-3" />
                    +12.5%
                  </Badge>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">Peningkatan 12.5% dari 6 bulan lalu</p>
              </div>
              <div className="bg-[#F8F9FA] p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-[#27A376]" />
                  <span className="text-[12px] font-bold text-gray-700">Mitra KST Jatikerto</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-gray-900 tracking-tight">200</span>
                  <Badge className="bg-red-50 text-red-500 border-none text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                    <TrendingDown className="size-3" />
                    -20%
                  </Badge>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">Penurunan 20% dari 6 bulan lalu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
