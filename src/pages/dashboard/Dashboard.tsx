import {
  Activity,
  Package,
  TrendingUp,
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
import { API_ENDPOINTS } from "@/api/endpoints";
import {
  adaptDashboardSummary,
  numberOrNull,
  sourceData,
  valueOf,
} from "./adapters";

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

function numberValue(value: unknown) {
  return numberOrNull(value) ?? 0;
}

function normalizeCollaborationRows(payload: unknown) {
  const value = valueOf(payload, ["value", "items", "data"]);
  const rows = Array.isArray(payload) ? payload : Array.isArray(value) ? value : [];
  return rows.map((item, index) => {
    const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      month: String(record.month ?? record.label ?? record.name ?? `Data ${index + 1}`),
      jatikerto: numberValue(record.jatikerto ?? record.value ?? record.total),
    };
  });
}

function normalizeResearchRows(payload: unknown) {
  const value = valueOf(payload, ["value", "items", "data"]);
  const rows = Array.isArray(payload) ? payload : Array.isArray(value) ? value : [];
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

function DisplayNumber({ value }: { value: number | null }) {
  return value === null ? <>Belum tersedia</> : <>{value.toLocaleString("id-ID")}</>;
}

function MutedUnavailable() {
  return <span className="text-xs font-semibold text-gray-400">Belum tersedia</span>;
}

function sourceStatusLabel(
  source: ReturnType<typeof sourceData>,
  label: string,
  summaryLoaded: boolean,
) {
  if (source.warning) return `${label} belum terintegrasi`;
  if (source.status) return `${label}: ${source.status}`;
  if (source.data) return `${label} berhasil dimuat`;
  return summaryLoaded ? `${label} belum tersedia` : `${label} menunggu data`;
}

export default function Dashboard() {
  const {
    data: summaryPayload,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useApiData<unknown>(API_ENDPOINTS.dashboard.summary);
  const {
    data: collaboration,
    isLoading: isCollaborationLoading,
    error: collaborationError,
  } = useApiData<unknown>(
    API_ENDPOINTS.dashboard.collaboration,
    { period: "6months" },
  );
  const {
    data: research,
    isLoading: isResearchLoading,
    error: researchError,
  } = useApiData<unknown>(
    API_ENDPOINTS.dashboard.researchProjects,
    { period: "6months" },
  );
  const summary = adaptDashboardSummary(summaryPayload);
  const liveCollaborationData = normalizeCollaborationRows(collaboration);
  const liveResearchData = normalizeResearchRows(research);
  const cangarSource = sourceData(summary, "cangar");
  const jatikertoSource = sourceData(summary, "jatikerto");
  const ngijoSource = sourceData(summary, "ngijo");
  const cangarData = cangarSource.data;
  const isCangarActive = Boolean(cangarData);
  const hasEndpointError = Boolean(summaryError || collaborationError || researchError);
  const latestCollaborationTotal =
    liveCollaborationData.length > 0
      ? liveCollaborationData[liveCollaborationData.length - 1].jatikerto
      : null;
  const summaryLoaded = !isSummaryLoading && !summaryError;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 bg-gray-50/50 min-h-screen">
      {hasEndpointError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Data gagal dimuat. Silakan coba lagi nanti.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {[cangarSource, jatikertoSource, ngijoSource].map((source, index) => {
          const label = ["Cangar", "Jatikerto", "Ngijo"][index];
          const isWarning = Boolean(source.warning);
          return (
            <Badge
              key={label}
              variant="outline"
              className={`w-fit rounded-md bg-white text-[11px] font-semibold ${
                isWarning ? "border-red-200 text-red-700" : source.data ? "border-emerald-200 text-emerald-700" : "border-gray-200 text-gray-500"
              }`}
            >
              {sourceStatusLabel(source, label, summaryLoaded)}
            </Badge>
          );
        })}
      </div>

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
                    {isSummaryLoading ? "Memuat..." : <DisplayNumber value={summary.totalVisitors} />}
                  </span>
                  <MutedUnavailable />
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium mb-2">
                  <CalendarDays className="size-3.5 text-gray-500" />
                  Hari ini
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-gray-900">
                    {isSummaryLoading ? "Memuat..." : <DisplayNumber value={summary.todayVisitors} />}
                  </span>
                  <MutedUnavailable />
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-1.5 text-[12px] text-gray-600 font-medium mb-2">
                  <CalendarDays className="size-3.5 text-gray-500" />
                  Minggu ini
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-gray-900">
                    {isSummaryLoading ? "Memuat..." : <DisplayNumber value={summary.weekVisitors} />}
                  </span>
                  <MutedUnavailable />
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
                    {summary.totalVisitors === null ? "Belum tersedia" : summary.totalVisitors.toLocaleString("id-ID")}
                  </span>{" "}
                  Pengunjung
                </p>
              </div>

              <div>
                <p className="text-[12px] font-bold text-gray-700">
                  Hari Tertinggi
                </p>
                <p className="text-[14px] font-extrabold text-gray-900">
                  Belum tersedia
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
              {summary.activeKst === null || summary.totalKst === null
                ? "Belum tersedia"
                : `${summary.activeKst} dari ${summary.totalKst} KST`}
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
                <DisplayNumber value={summary.totalProduction} />
              </div>
              <MutedUnavailable />
            </div>

            <div className="space-y-1">
              <p className="text-[14px] font-bold text-gray-800">
                Tren belum tersedia
              </p>
              <p className="text-[12px] text-gray-400 font-medium">
                Data historis produksi belum tersedia untuk menghitung tren.
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
                <DisplayNumber value={summary.activeOperations} />
              </div>
              <MutedUnavailable />
            </div>

            <div className="space-y-1">
              <p className="text-[14px] font-bold text-gray-800">
                Tren belum tersedia
              </p>
              <p className="text-[12px] text-gray-400 font-medium">
                Data perbandingan periode belum tersedia.
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
                  <DisplayNumber value={numberOrNull(valueOf(cangarData, ["totalVisitors", "total_visitors"]))} />
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-500">
                  Operasi
                </p>
                <p className="text-xl font-extrabold text-gray-900">
                  <DisplayNumber value={numberOrNull(valueOf(cangarData, ["activeOperations", "active_operations"]))} />
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-500">
                  Stok
                </p>
                <p className="text-xl font-extrabold text-gray-900">
                  <DisplayNumber value={numberOrNull(valueOf(cangarData, ["totalProduction", "total_production"]))} />
                </p>
              </div>
            </div>

            <p className="text-[12px] text-gray-400 font-medium">
              {cangarSource.warning ??
                (isCangarActive
                  ? "Data Cangar tersedia."
                  : "Data Cangar belum tersedia.")}
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
            {isResearchLoading ? (
              <div className="h-50 w-full flex items-center justify-center rounded-xl bg-gray-50 text-sm font-medium text-gray-500">
                Memuat data proyek riset...
              </div>
            ) : liveResearchData.length === 0 ? (
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
            {summary.greenPerformance === null ? (
              <div className="flex h-[190px] items-center justify-center text-sm font-semibold text-gray-400">
                Belum tersedia
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4">
                <CircularProgress value={summary.greenPerformance} label="Skor" />

                <p className="text-[12px] text-gray-700 font-semibold text-center">
                  Data green performance tersedia.
                </p>
              </div>
            )}
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

              {isCollaborationLoading ? (
                <div className="h-50 w-full flex items-center justify-center text-sm font-medium text-gray-500">
                  Memuat data kolaborasi...
                </div>
              ) : liveCollaborationData.length === 0 ? (
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
                  {latestCollaborationTotal === null
                    ? "Belum tersedia"
                    : latestCollaborationTotal.toLocaleString("id-ID")}
                </span>

                <MutedUnavailable />
              </div>

              <p className="text-[11px] text-gray-400 font-medium">
                Tren 6 bulan belum dapat dihitung karena data tanggal kemitraan belum tersedia.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div >
  );
}
