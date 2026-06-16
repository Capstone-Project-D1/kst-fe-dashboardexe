import { useState } from "react";
import {
  TrendingUp,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Leaf,
  Droplets,
  Trash2,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useApiData, usePageData } from "@/api/hooks";
import { API_ENDPOINTS } from "@/api/endpoints";
import { colValue, fieldNumber, fieldValue, getContractColumnIndex, isRecord, ngijoNumber, ngijoTimeSeries, textOrFallback } from "../adapters";

const energyConfig = {
  daya: { label: "Daya", color: "#3B82F6" },
  konsumsi: { label: "Konsumsi", color: "#93C5FD" },
} satisfies ChartConfig;

interface EnergyPoint {
  month: string;
  daya: number | null;
  konsumsi: number | null;
}

interface SensorRow {
  id?: string;
  lokasi: string;
  tipe: string;
  baca: string;
  status: string;
  tren: "up" | "down" | "stable" | null;
}

function CircularProgress({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="130" height="130" className="-rotate-90">
        <circle
          cx="65"
          cy="65"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="10"
        />
        <circle
          cx="65"
          cy="65"
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
        <span className="text-3xl font-extrabold text-gray-900">{value}</span>
        <span className="text-[10px] font-semibold text-emerald-600">
          {label}
        </span>
      </div>
    </div>
  );
}

function normalizeEnergyRows(rows: unknown[]): EnergyPoint[] {
  return rows
    .map((row, index) => {
      const record = isRecord(row) ? row : {};
      const daya = fieldNumber(record, ["daya", "power", "generatedPower", "generated_power", "value"]);
      const konsumsi = fieldNumber(record, ["konsumsi", "consumption", "energyConsumption", "energy_consumption"]);
      return {
        month: textOrFallback(record.month ?? record.bulan ?? record.label ?? record.time ?? record.timestamp, `Data ${index + 1}`),
        daya,
        konsumsi,
      };
    })
    .filter((row) => row.daya !== null || row.konsumsi !== null);
}

function normalizeSensorRows(rows: unknown[], contractPayload: unknown): SensorRow[] {
  const lokasiIdx = getContractColumnIndex(contractPayload, ["lokasi sensor", "lokasi", "location"]) ?? 0;
  const tipeIdx = getContractColumnIndex(contractPayload, ["tipe", "type"]) ?? 1;
  const bacaIdx = getContractColumnIndex(contractPayload, ["baca", "reading", "value"]) ?? 2;
  const statusIdx = getContractColumnIndex(contractPayload, ["status"]) ?? 3;
  const trenIdx = getContractColumnIndex(contractPayload, ["tren", "trend"]) ?? 4;

  return rows.map((row) => {
    const record = isRecord(row) ? row : {};
    const trend = fieldValue(record, ["tren", "trend"]) ?? colValue(record, trenIdx);
    return {
      id: textOrFallback(record.id ?? record.rowId ?? record.row_id, ""),
      lokasi: textOrFallback(fieldValue(record, ["lokasi", "location", "sensorLocation", "sensor_location"]) ?? colValue(record, lokasiIdx)),
      tipe: textOrFallback(fieldValue(record, ["tipe", "type", "sensorType", "sensor_type"]) ?? colValue(record, tipeIdx)),
      baca: textOrFallback(fieldValue(record, ["baca", "reading", "value", "currentValue", "current_value"]) ?? colValue(record, bacaIdx)),
      status: textOrFallback(fieldValue(record, ["status"]) ?? colValue(record, statusIdx)),
      tren: trend === "up" || trend === "down" || trend === "stable" ? trend : null,
    };
  });
}

function sensorStatusClass(status: string): string {
  const value = status.toLowerCase().trim();
  if (["optimal", "ok", "normal", "good", "healthy"].includes(value)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (["critical", "error", "danger", "alert", "fault"].includes(value)) {
    return "border-red-200 bg-red-50 text-red-700";
  }
  if (!value || value === "-") {
    return "border-gray-200 bg-gray-50 text-gray-500";
  }
  return "border-amber-200 bg-amber-50 text-amber-700";
}

function NullState({ children = "Data belum tersedia." }: { children?: string }) {
  return (
    <div className="flex h-[140px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-4 text-center">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
        <span className="text-gray-400">?</span>
      </div>
      <p className="text-[13px] font-medium text-gray-500">{children}</p>
    </div>
  );
}

export default function Keberlanjutan() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const { data: renewableEnergyPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.ngijo.renewableEnergy,
  );
  const { data: greenPerformancePayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.ngijo.greenPerformance,
  );
  const { data: recycledWaterPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.ngijo.recycledWater,
  );
  const { data: wasteMetricPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.ngijo.wasteMetric,
  );
  const { data: energyDynamicsPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.ngijo.energyDynamics,
    { start_time: 0, end_time: 9999999999, limit: 100 },
  );
  const { data: contractPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.ngijo.contract,
  );
  const { items: sensorRows, isLoading: isSensorLoading, error: sensorError, warning: sensorWarning } = usePageData<unknown>(
    API_ENDPOINTS.kst.ngijo.sensorFeed,
    { offset: 0, limit: 50, sort_col: -1 },
  );
  const renewableEnergy = ngijoNumber(renewableEnergyPayload);
  const greenPerformance = ngijoNumber(greenPerformancePayload);
  const recycledWater = ngijoNumber(recycledWaterPayload);
  const wasteMetric = ngijoNumber(wasteMetricPayload);
  const energyRows = normalizeEnergyRows(ngijoTimeSeries<unknown>(energyDynamicsPayload));
  const sensorData = normalizeSensorRows(sensorRows, contractPayload);

  const rowsPerPageNumber = Number(rowsPerPage);
  const totalPages = Math.max(
    1,
    Math.ceil(sensorData.length / rowsPerPageNumber)
  );

  const paginatedSensorData = sensorData.slice(
    (currentPage - 1) * rowsPerPageNumber,
    currentPage * rowsPerPageNumber
  );

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col gap-1 rounded-xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-emerald-700">
          <Leaf className="size-4" />
          KST Ngijo
        </div>
        <h1 className="text-xl font-extrabold text-gray-950">Keberlanjutan</h1>
        <p className="text-sm font-medium text-gray-500">
          Kinerja energi, air, limbah, dan feed sensor dari gateway Ngijo.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <Leaf className="size-5 text-gray-500" />
            <div>
              <p className="text-[13px] font-bold text-gray-900">
                Green Performance
              </p>
              <p className="text-[11px] text-gray-400 font-medium">
                Q1 / January - Maret 2026
              </p>
            </div>
          </div>

          {greenPerformance === null ? (
            <NullState>Green performance belum tersedia.</NullState>
          ) : (
            <>
              <div className="flex justify-center py-2">
                <CircularProgress
                  value={greenPerformance}
                  label="Skor"
                  color="#27A376"
                />
              </div>

              <p className="text-[12px] text-gray-500 font-medium text-center">
                Data green performance berasal dari backend pusat.
              </p>
            </>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <Droplets className="size-5 text-gray-500" />
            <div>
              <p className="text-[13px] font-bold text-gray-900">
                Siklus Hidup Air
              </p>
              <p className="text-[11px] text-gray-400 font-medium">
                Q1 / January - Maret 2026
              </p>
            </div>
          </div>

          {recycledWater === null ? (
            <NullState>Siklus hidup air belum tersedia.</NullState>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-4">
              <span className="text-3xl font-extrabold text-gray-900">
                {recycledWater.toLocaleString("id-ID")}
              </span>
              <span className="text-[12px] font-semibold text-emerald-600">
                Air daur ulang
              </span>
              <p className="text-[11px] text-gray-400 font-medium text-center">
                Distribusi rinci belum dikirim backend.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <Trash2 className="size-5 text-gray-500" />
              <div>
                <p className="text-[13px] font-bold text-gray-900">
                  Metrik Limbah
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  Januari / Minggu Pertama
                </p>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 font-medium max-w-[120px] text-right leading-snug">
              Metrik mingguan dalam pengelolaan proses limbah.
            </p>
          </div>

          {wasteMetric === null ? (
            <NullState>Metrik limbah belum tersedia.</NullState>
          ) : (
            <div className="flex flex-col justify-center gap-2 py-6">
              <span className="text-3xl font-extrabold text-gray-900">
                {wasteMetric.toLocaleString("id-ID")}
              </span>
              <span className="text-[12px] font-semibold text-gray-500">
                Metrik limbah
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <Zap className="size-5 text-gray-500" />
              <div>
                <p className="text-[13px] font-bold text-gray-900">
                  Dinamika Energi
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  Q1 / January - Maret 2026
                </p>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 font-medium max-w-[240px] text-right leading-snug">
              Perbandingan antara daya dengan konsumsi secara langsung.
            </p>
          </div>

          {energyRows.length === 0 ? (
            <NullState>Dinamika energi belum tersedia.</NullState>
          ) : (
            <>
              <ChartContainer config={energyConfig} className="h-[200px] w-full">
                <AreaChart
                  data={energyRows}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradDaya" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradKonsumsi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#93C5FD" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9CA3AF" }}
                  />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="daya"
                    stroke="#3B82F6"
                    fill="url(#gradDaya)"
                    strokeWidth={2.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="konsumsi"
                    stroke="#93C5FD"
                    fill="url(#gradKonsumsi)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>

              <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-blue-500 inline-block" />
                  Daya
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-blue-300 inline-block" />
                  Konsumsi
                </span>
              </div>
            </>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <Zap className="size-5 text-gray-500" />
            <div>
              <p className="text-[13px] font-bold text-gray-900 leading-tight">
                Total Energi Terbarukan yang Dihasilkan
              </p>
              <p className="text-[11px] text-gray-400 font-medium">
                Q1 / January - Maret 2026
              </p>
            </div>
          </div>

          {renewableEnergy === null ? (
            <NullState>Energi terbarukan belum tersedia.</NullState>
          ) : (
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {renewableEnergy.toLocaleString("id-ID")}
              </span>
              <span className="text-[14px] font-semibold text-gray-500">
                MWh
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-[14px] font-bold text-gray-900 border border-gray-200 rounded-lg px-4 py-2 bg-white shadow-sm">
          Real Time Sensor Feed
        </h2>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="font-bold text-gray-500 text-[12px] w-[60px] pl-5">
                  No.
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[260px]">
                  Lokasi Sensor
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[220px]">
                  Tipe
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[140px]">
                  Baca
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[120px]">
                  Status
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[100px]">
                  Tren
                </TableHead>

                <TableHead className="w-[48px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {isSensorLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm font-medium text-gray-500">
                    Memuat data sensor...
                  </TableCell>
                </TableRow>
              ) : sensorError ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm font-medium text-red-500">
                    {sensorError}
                  </TableCell>
                </TableRow>
              ) : paginatedSensorData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-sm font-medium text-gray-500">
                    {sensorWarning ?? "Data sensor belum tersedia."}
                  </TableCell>
                </TableRow>
              ) : paginatedSensorData.map((row, index) => (
                <TableRow key={row.id || `${row.lokasi}-${index}`} className="hover:bg-gray-50/50 group">
                  <TableCell className="text-[13px] text-gray-500 font-medium pl-5">
                    {(currentPage - 1) * rowsPerPageNumber + index + 1}.
                  </TableCell>

                  <TableCell className="text-[13px] font-medium text-gray-900 max-w-[260px] whitespace-normal break-words leading-relaxed">
                    {row.lokasi}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-500 max-w-[220px] whitespace-normal break-words leading-relaxed">
                    {row.tipe}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 font-medium min-w-[140px] whitespace-nowrap tabular-nums">
                    {row.baca}
                  </TableCell>

                  <TableCell className="min-w-[120px] whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-1 text-[12px] font-bold",
                        sensorStatusClass(row.status),
                      )}
                    >
                      {row.status}
                    </span>
                  </TableCell>

                  <TableCell className="min-w-[100px] whitespace-nowrap">
                    {row.tren === null ? (
                      <span className="text-[12px] font-medium text-gray-400">Belum tersedia</span>
                    ) : (
                      <TrendingUp
                        className={cn(
                          "size-4",
                          row.tren === "up"
                            ? "text-emerald-500"
                            : row.tren === "down"
                              ? "text-red-400 rotate-180"
                              : "text-gray-400"
                        )}
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-gray-100">
                      <MoreVertical className="size-4 text-gray-400" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
            <span className="whitespace-nowrap">Baris per Page</span>

            <Select
              value={rowsPerPage}
              onValueChange={(value) => {
                setRowsPerPage(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[70px] border-gray-200 bg-white text-[13px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">
              Page {currentPage} dari {totalPages}
            </span>

            <div className="flex items-center gap-1">
              {[
                {
                  icon: ChevronsLeft,
                  action: () => setCurrentPage(1),
                  disabled: currentPage === 1,
                },
                {
                  icon: ChevronLeft,
                  action: () =>
                    setCurrentPage(Math.max(1, currentPage - 1)),
                  disabled: currentPage === 1,
                },
                {
                  icon: ChevronRight,
                  action: () =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1)),
                  disabled: currentPage === totalPages,
                },
                {
                  icon: ChevronsRight,
                  action: () => setCurrentPage(totalPages),
                  disabled: currentPage === totalPages,
                },
              ].map((btn, index) => (
                <button
                  key={index}
                  onClick={btn.action}
                  disabled={btn.disabled}
                  className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <btn.icon className="size-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
