import {
  Activity,
  Package,
  TrendingUp,
  TrendingDown,
  Users,
  ClipboardList,
  CalendarDays,
  Eye,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useApiData } from "@/api/hooks";

const collaborationConfig = {

  jatikerto: {
    label: "Mitra KST Jatikerto",
    color: "#27A376",
  },
} satisfies ChartConfig;

const researchConfig = {
  value: {
    label: "Proyek Riset",
    color: "#3B82F6",
  },
} satisfies ChartConfig;

type DashboardSource = {
  kstIdentifier?: string;
  data?: Record<string, unknown> | null;
  warning?: string;
};

type DashboardSummary = {
  totalVisitors?: number;
  todayVisitors?: number;
  weekVisitors?: number;
  activeKst?: number;
  totalKst?: number;
  totalProduction?: number;
  activeOperations?: number;
  greenPerformance?: number;
  sources?: DashboardSource[] | Record<string, DashboardSource | Record<string, unknown>>;
  warnings?: string[];
};

function numberValue(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function sourceData(summary: DashboardSummary | null, kstIdentifier: string) {
  const sources = summary?.sources;
  if (Array.isArray(sources)) {
    const source = sources.find((item) => item.kstIdentifier === kstIdentifier);
    return {
      data: source?.data ?? null,
      warning: source?.warning,
    };
  }

  if (sources && typeof sources === "object") {
    const source = sources[kstIdentifier];
    if (source && typeof source === "object" && "data" in source) {
      const typedSource = source as DashboardSource;
      return {
        data: typedSource.data ?? null,
        warning: typedSource.warning,
      };
    }
    return {
      data: (source as Record<string, unknown>) ?? null,
      warning: undefined,
    };
  }

  return { data: null, warning: undefined };
}

function normalizeCollaborationRows(payload: unknown) {
  const rows = Array.isArray(payload) ? payload : [];
  return rows.map((item, index) => {
    const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      month: String(record.month ?? record.label ?? record.name ?? `Data ${index + 1}`),
      jatikerto: numberValue(record.jatikerto ?? record.value ?? record.total),
    };
  });
}

function normalizeResearchRows(payload: unknown) {
  const rows = Array.isArray(payload) ? payload : [];
  return rows.map((item, index) => {
    const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      month: String(record.month ?? record.label ?? record.name ?? `Data ${index + 1}`),
      value: numberValue(record.value ?? record.total ?? record.count),
    };
  });
}

function CircularProgress({
  value,
  label,
  color = "#168FFF",
}: {
  value: number;
  label: string;
  color?: string;
}) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="155" height="155" className="-rotate-90">
        <circle
          cx="77.5"
          cy="77.5"
          r={radius}
          fill="none"
          stroke="#EFEFEF"
          strokeWidth="10"
        />

        <circle
          cx="77.5"
          cy="77.5"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-extrabold text-gray-900">{value}</span>
        <span className="text-[12px] font-medium text-gray-400">{label}</span>
      </div>
    </div>
  );
}

function TrendBadge({ value }: { value: string }) {
  return (
    <Badge className="text-[#27A376] text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1 border-[#B2DDB5] bg-[#F5FBF5]">
      <TrendingUp className="size-4 text-[#46A758]" />
      {value}
    </Badge>
  );
}

export default function Dashboard() {
  const { data: summary } = useApiData<DashboardSummary>("/dashboard/summary");
  const { data: collaboration } = useApiData<{ value?: unknown }>(
    "/dashboard/collaboration",
    { period: "6months" },
  );
  const { data: research } = useApiData<{ value?: unknown }>(
    "/dashboard/research-projects",
    { period: "6months" },
  );
  const liveCollaborationData = normalizeCollaborationRows(collaboration?.value);
  const liveResearchData = normalizeResearchRows(research?.value);
  const cangarSource = sourceData(summary, "cangar");
  const cangarData = cangarSource.data;
  const isCangarActive = Boolean(cangarData);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-gray-50/50 min-h-screen">
      {/* SECTION 1: Top Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-4">
        {/* Statistik Pengunjung Website */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#27A376] rounded-lg text-white">
                <Eye className="size-5" />
              </div>

              <CardTitle className="text-sm font-semibold text-gray-700">
                Statistik Pengunjung Website
              </CardTitle>
            </div>

            <div className="flex gap-1.5">
              <Badge
                variant="outline"
                className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full"
              >
                KST Ngijo
              </Badge>
              <Badge
                variant="outline"
                className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full"
              >
                KST Cangar
              </Badge>
              <Badge
                variant="outline"
                className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full"
              >
                KST Jatikerto
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium mb-2">
                  <Users className="size-3.5 text-gray-500" />
                  Total Pengunjung
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-gray-900">
                    {summary?.totalVisitors ?? 0}
                  </span>
                  <TrendBadge value="+12.5%" />
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium mb-2">
                  <CalendarDays className="size-3.5 text-gray-500" />
                  Hari ini
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-gray-900">
                    {summary?.todayVisitors ?? 0}
                  </span>
                  <TrendBadge value="+12.5%" />
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium mb-2">
                  <CalendarDays className="size-3.5 text-gray-500" />
                  Minggu ini
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-gray-900">
                    {summary?.weekVisitors ?? 0}
                  </span>
                  <TrendBadge value="+12.5%" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <p className="text-[12px] font-bold text-gray-700">
                  Rata-rata Harian
                </p>
                <p className="text-[13px] text-gray-500">
                  <span className="text-xl font-extrabold text-gray-900">
                    {summary?.totalVisitors ?? 0}
                  </span>{" "}
                  Pengunjung
                </p>
              </div>

              <div>
                <p className="text-[12px] font-bold text-gray-700">
                  Hari Tertinggi
                </p>
                <p className="text-[14px] font-extrabold text-gray-900">
                  Minggu, 10 Mei{" "}
                  <span className="text-[12px] font-medium text-gray-400">
                  ({summary?.todayVisitors ?? 0})
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total KST Aktif */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center gap-3 pb-2 space-y-0">
            <div className="p-2 bg-[#27A376] rounded-lg">
              <Activity className="size-5 text-white" />
            </div>

            <CardTitle className="text-sm font-semibold text-gray-700">
              Total KST Aktif
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {summary?.activeKst ?? 0} dari {summary?.totalKst ?? 0} KST
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Badge
                variant="outline"
                className="border-gray-200 text-gray-600 font-bold text-[10px] h-6 px-2.5 rounded-full"
              >
                KST Ngijo
              </Badge>
              <Badge
                variant="outline"
                className="border-gray-200 text-gray-600 font-bold text-[10px] h-6 px-2.5 rounded-full"
              >
                KST Cangar
              </Badge>
              <Badge
                variant="outline"
                className="border-gray-200 text-gray-600 font-bold text-[10px] h-6 px-2.5 rounded-full"
              >
                KST Jatikerto
              </Badge>
              <Badge
                variant="outline"
                className="border-gray-200 text-gray-300 font-bold text-[10px] h-6 px-2.5 rounded-full"
              >
                KST Kepanjen
              </Badge>
              <Badge
                variant="outline"
                className="border-gray-200 text-gray-300 font-bold text-[10px] h-6 px-2.5 rounded-full"
              >
                KST Tegalweru
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 2: Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Total Produksi */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#27A376] rounded-lg text-white">
                <Package className="size-5" />
              </div>

              <CardTitle className="text-sm font-semibold text-gray-700">
                Total Produksi
              </CardTitle>
            </div>

            <Badge
              variant="outline"
              className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full"
            >
              KST Jatikerto
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {(summary?.totalProduction ?? 0).toLocaleString("id-ID")}
              </div>
              <TrendBadge value="+15%" />
            </div>

            <div className="space-y-1">
              <p className="text-[14px] font-bold text-gray-800">
                Peningkatan 12.5% dari bulan lalu
              </p>
              <p className="text-[12px] text-gray-400 font-medium">
                Total barang pada bulan ini meningkat sebesar 15%.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Operasional Aktif */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#27A376] rounded-lg text-white">
                <Package className="size-5" />
              </div>

              <CardTitle className="text-sm font-semibold text-gray-700">
                Total Operasional Aktif
              </CardTitle>
            </div>

            <Badge
              variant="outline"
              className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full"
            >
              KST Cangar
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {(summary?.activeOperations ?? 0).toLocaleString("id-ID")}
              </div>
              <TrendBadge value="+5%" />
            </div>

            <div className="space-y-1">
              <p className="text-[14px] font-bold text-gray-800">
                Peningkatan 12.5% dari bulan lalu
              </p>
              <p className="text-[12px] text-gray-400 font-medium">
                Total barang pada bulan ini meningkat sebesar 5%.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status KST Cangar */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#27A376] rounded-lg text-white">
                <Activity className="size-5" />
              </div>

              <CardTitle className="text-sm font-semibold text-gray-700">
                Status KST Cangar
              </CardTitle>
            </div>

            <Badge
              variant="outline"
              className={`bg-white border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full ${
                isCangarActive ? "text-[#27A376]" : "text-gray-400"
              }`}
            >
              {isCangarActive ? "Aktif" : "Kosong"}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[11px] font-semibold text-gray-500">
                  Reservasi
                </p>
                <p className="text-xl font-extrabold text-gray-900">
                  {numberValue(cangarData?.totalVisitors).toLocaleString("id-ID")}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-500">
                  Operasi
                </p>
                <p className="text-xl font-extrabold text-gray-900">
                  {numberValue(cangarData?.activeOperations).toLocaleString("id-ID")}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-500">
                  Stok
                </p>
                <p className="text-xl font-extrabold text-gray-900">
                  {numberValue(cangarData?.totalProduction).toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            <p className="text-[12px] text-gray-400 font-medium">
              {cangarSource.warning ??
                (isCangarActive
                  ? "Data Cangar tersedia dari backend gateway."
                  : "Data Cangar belum tersedia dari backend gateway.")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3: Charts */}
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Total Proyek Riset Aktif */}
        <Card className="shadow-sm border-gray-100 w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#27A376] rounded-lg text-white">
                <ClipboardList className="size-5" />
              </div>

              <CardTitle className="text-sm font-semibold text-gray-700">
                Total Proyek Riset Aktif
              </CardTitle>
            </div>

            <Badge
              variant="outline"
              className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full"
            >
              KST Ngijo
            </Badge>
          </CardHeader>

          <CardContent className="pt-6">
            {liveResearchData.length === 0 ? (
              <div className="h-50 w-full flex items-center justify-center rounded-xl bg-gray-50 text-sm font-medium text-gray-500">
                Data proyek riset belum tersedia.
              </div>
            ) : (
              <ChartContainer
                config={researchConfig}
                className="h-50 w-full mb-4"
              >
                <AreaChart
                  data={liveResearchData}
                  margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#F1F5F9"
                />

                <YAxis
                  domain={[0, 1500]}
                  ticks={[0, 500, 1000, 1500]}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={10}
                  width={44}
                  tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 500 }}
                  tickFormatter={(value) => value.toLocaleString("id-ID")}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={12}
                  tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 500 }}
                />

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
            )}
          </CardContent>
        </Card>

        {/* Green Performance */}
        <Card className="shadow-sm border-gray-100 w-full md:w-100 md:max-w-107.5 md:justify-self-end">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#27A376] rounded-lg text-white">
                <TrendingUp className="size-5" />
              </div>

              <CardTitle className="text-sm font-semibold text-gray-700">
                Green Performance
              </CardTitle>
            </div>

            <Badge
              variant="outline"
              className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full"
            >
              KST Ngijo
            </Badge>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <CircularProgress value={summary?.greenPerformance ?? 0} label="Excellent" />

              <p className="text-[12px] text-gray-700 font-semibold text-center">
                Kinerja 12% lebih tinggi dibandingkan kuartal lalu.
                <TrendingUp className="inline-block ml-1 size-3 text-gray-700" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 4: Total Mitra/Kolaborasi */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#27A376] rounded-lg text-white">
                <Users className="size-5" />
              </div>

              <CardTitle className="text-sm font-semibold text-gray-700">
                Total Mitra/Kolaborasi
              </CardTitle>
            </div>

            <div className="flex gap-2">

              <Badge
                variant="outline"
                className="bg-white text-gray-900 border-gray-200 text-[10px] font-bold h-6 px-2.5 rounded-full"
              >
                KST Jatikerto
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="bg-[#F8F9FA] rounded-2xl p-6 mb-4">
              <p className="text-[11px] font-medium text-gray-400 mb-6">
                Selama 6 Bulan terakhir
              </p>

              {liveCollaborationData.length === 0 ? (
                <div className="h-50 w-full flex items-center justify-center text-sm font-medium text-gray-500">
                  Data kolaborasi belum tersedia.
                </div>
              ) : (
                <ChartContainer
                  config={collaborationConfig}
                  className="h-50 w-full"
                >
                  <BarChart
                    data={liveCollaborationData}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9CA3AF", fontWeight: 500 }}
                  />

                  <YAxis hide />

                  <ChartTooltip content={<ChartTooltipContent />} />

                  <Bar
                    dataKey="jatikerto"
                    fill="#27A376"
                    radius={[4, 4, 0, 0]}
                    barSize={28}
                  />
                  </BarChart>
                </ChartContainer>
              )}
            </div>

            <div className="bg-[#F8F9FA] p-5 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-[#27A376]" />
                <span className="text-[12px] font-bold text-gray-700">
                  Mitra KST Jatikerto
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  200
                </span>

                <Badge className="text-[#E5484D] border-[#F8D7DA] bg-[#FFF5F5] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <TrendingDown className="size-4 text-[#E5484D]" />
                  -20%
                </Badge>
              </div>

              <p className="text-[11px] text-gray-400 font-medium">
                Penurunan 20% dari 6 bulan lalu
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div >
  );
}
