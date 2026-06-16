import type { ComponentType, ReactNode } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  ClipboardList,
  GraduationCap,
  Handshake,
  Leaf,
  Sprout,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { API_ENDPOINTS } from "@/api/endpoints";
import { useApiData, usePageData } from "@/api/hooks";
import {
  adaptBookingRows,
  adaptBookingSummary,
  adaptFinanceRows,
  adaptFinanceSummary,
  adaptStockRows,
  adaptStockSummary,
  formatRupiah,
} from "@/pages/kst-cangar/adapters";
import { ngijoNumber } from "@/pages/kst-ngijo/adapters";
import { parseDate } from "@/pages/kst-jatikerto/dashboardUi";
import {
  fieldAliases,
  getDateValue,
  getNumberValue,
  getTextValue,
  type JatikertoApiRow,
} from "@/pages/kst-jatikerto/rowMappers";
import { adaptDashboardSummary, sourceData } from "./adapters";

type IconComponent = ComponentType<{ className?: string }>;
type Tone = "emerald" | "amber" | "teal";

const KST_KEYS = ["ngijo", "cangar", "jatikerto"] as const;
const EMPTY_TEXT = "Data belum tersedia";
const WAITING_TEXT = "Menunggu sinkronisasi data";

const toneClass = {
  emerald: {
    accent: "bg-emerald-600",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: "border-emerald-100 bg-emerald-50 text-emerald-700",
    progress: "bg-emerald-600",
    soft: "bg-emerald-50 text-emerald-700",
    text: "text-emerald-700",
  },
  amber: {
    accent: "bg-amber-500",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    icon: "border-amber-100 bg-amber-50 text-amber-700",
    progress: "bg-amber-500",
    soft: "bg-amber-50 text-amber-700",
    text: "text-amber-700",
  },
  teal: {
    accent: "bg-teal-500",
    badge: "border-teal-200 bg-teal-50 text-teal-700",
    icon: "border-teal-100 bg-teal-50 text-teal-700",
    progress: "bg-teal-500",
    soft: "bg-teal-50 text-teal-700",
    text: "text-teal-700",
  },
} satisfies Record<Tone, Record<string, string>>;

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function hasValue(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatNumber(value: number | null | undefined, suffix?: string) {
  if (!hasValue(value)) return EMPTY_TEXT;
  return [value.toLocaleString("id-ID"), suffix].filter(Boolean).join(" ");
}

function formatPercent(value: number | null | undefined) {
  if (!hasValue(value)) return EMPTY_TEXT;
  return `${value.toLocaleString("id-ID")}%`;
}

function dataStatusText(isLoading: boolean, error?: string | null) {
  if (isLoading) return "Memuat data...";
  if (error) return "Sebagian data belum dapat dimuat";
  return WAITING_TEXT;
}

function sourceStatusLabel(
  source: ReturnType<typeof sourceData>,
  label: string,
  summaryLoaded: boolean,
) {
  if (source.warning) return `${label} menunggu sinkronisasi`;
  if (source.status) return `${label}: ${source.status}`;
  if (source.data) return `${label} terintegrasi`;
  return summaryLoaded ? `${label} belum tersedia` : `${label} menunggu data`;
}

function CardShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`overflow-hidden rounded-[8px] border-gray-200/80 bg-white shadow-sm ${className}`}>
      {children}
    </Card>
  );
}

function SectionHeader({
  title,
  tone,
}: {
  title: string;
  tone: Tone;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`h-1 w-9 rounded-full ${toneClass[tone].accent}`} />
      <h2 className="text-lg font-extrabold text-gray-950 md:text-xl">{title}</h2>
    </div>
  );
}

function ExecutiveSummaryCard({
  label,
  value,
  description,
  icon: Icon,
  featured = false,
  children,
}: {
  label: string;
  value: ReactNode;
  description: string;
  icon: IconComponent;
  featured?: boolean;
  children?: ReactNode;
}) {
  if (featured) {
    return (
      <CardShell className="border-emerald-950 bg-emerald-950 text-white shadow-lg shadow-emerald-950/15">
        <CardContent className="relative min-h-[158px] p-5">
          <div className="absolute -bottom-8 -right-6 h-24 w-24 rounded-full border-[14px] border-emerald-700/40" />
          <p className="text-[11px] font-extrabold uppercase text-emerald-100">{label}</p>
          <div className="mt-4 text-4xl font-black leading-none">{value}</div>
          <div className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald-100">
            <Icon className="size-4" />
            <span>{description}</span>
          </div>
        </CardContent>
      </CardShell>
    );
  }

  return (
    <CardShell>
      <CardContent className="flex min-h-[158px] flex-col justify-between p-5">
        <div>
          <p className="text-[11px] font-extrabold uppercase text-gray-500">{label}</p>
          <div className="mt-3 break-words text-3xl font-black leading-tight text-gray-950">{value}</div>
          <p className="mt-2 text-sm leading-5 text-gray-500">{description}</p>
        </div>
        {children ? (
          <div className="mt-4">{children}</div>
        ) : (
          <div className="mt-4 flex items-center gap-2 text-emerald-700">
            <Icon className="size-5" />
            <span className="h-2 w-16 rounded-full bg-emerald-100" />
          </div>
        )}
      </CardContent>
    </CardShell>
  );
}

function IconBadge({ icon: Icon, tone }: { icon: IconComponent; tone: Tone }) {
  return (
    <div className={`grid size-11 shrink-0 place-items-center rounded-full border ${toneClass[tone].icon}`}>
      <Icon className="size-5" />
    </div>
  );
}

function CompactMetricCard({
  label,
  value,
  description,
  icon,
  tone,
  className = "",
}: {
  label: string;
  value: ReactNode;
  description: string;
  icon: IconComponent;
  tone: Tone;
  className?: string;
}) {
  return (
    <CardShell className={className}>
      <CardContent className="flex min-h-[124px] items-center gap-4 p-5">
        <IconBadge icon={icon} tone={tone} />
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase text-gray-500">{label}</p>
          <div className="mt-1 break-words text-2xl font-black leading-tight text-gray-950">{value}</div>
          <p className="mt-1 text-xs leading-5 text-gray-500">{description}</p>
        </div>
      </CardContent>
    </CardShell>
  );
}

function ProgressLine({
  label,
  value,
  max = 100,
  tone,
}: {
  label: string;
  value: number | null;
  max?: number;
  tone: Tone;
}) {
  const percent = value === null ? 0 : clamp((value / max) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-[11px] font-extrabold uppercase text-gray-500">
        <span className="min-w-0">{label}</span>
        <span className={toneClass[tone].text}>{value === null ? EMPTY_TEXT : `${Math.round(percent)}%`}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${toneClass[tone].progress}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function SemiGauge({
  value,
  max,
  tone,
}: {
  value: number | null;
  max: number;
  tone: Tone;
}) {
  const percent = value === null ? 0 : clamp((value / max) * 100);
  const color = tone === "emerald" ? "#059669" : tone === "amber" ? "#f59e0b" : "#14b8a6";

  return (
    <div className="mx-auto grid w-full max-w-[260px] place-items-center pt-3">
      <div
        className="relative h-[118px] w-full overflow-hidden"
        style={{
          background: `conic-gradient(from 270deg at 50% 100%, ${color} ${percent / 2}%, #e5e7eb 0 50%, transparent 0)`,
          borderTopLeftRadius: 260,
          borderTopRightRadius: 260,
        }}
      >
        <div className="absolute bottom-0 left-1/2 h-[82px] w-[72%] -translate-x-1/2 rounded-t-full bg-white" />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center">
          <div className="text-3xl font-black leading-none text-gray-950">
            {value === null ? "-" : value.toLocaleString("id-ID", { maximumFractionDigits: 1 })}
          </div>
          <div className="mt-1 text-[11px] font-extrabold uppercase text-gray-500">Avg TRL</div>
        </div>
      </div>
    </div>
  );
}

function DonutMetricCard({
  total,
  pending,
  isLoading,
  error,
}: {
  total: number | null;
  pending: number | null;
  isLoading: boolean;
  error?: string | null;
}) {
  const safeTotal = total ?? 0;
  const safePending = pending ?? 0;
  const completed = Math.max(safeTotal - safePending, 0);
  const completedPercent = safeTotal > 0 ? clamp((completed / safeTotal) * 100) : 0;

  return (
    <CardShell>
      <CardContent className="flex min-h-[250px] flex-col p-5">
        <p className="text-[11px] font-extrabold uppercase text-gray-500">Booking vs Pending</p>
        <div className="mt-6 grid place-items-center">
          <div
            className="grid size-32 place-items-center rounded-full"
            style={{
              background: `conic-gradient(#92400e ${completedPercent}%, #fde68a 0)`,
            }}
          >
            <div className="grid size-24 place-items-center rounded-full bg-white">
              <div className="text-center">
                <div className="text-3xl font-black text-gray-950">
                  {isLoading ? "..." : `${Math.round(completedPercent)}%`}
                </div>
                <div className="text-[11px] font-bold text-gray-500">Booking aktif</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-auto flex flex-wrap gap-3 text-xs font-bold text-gray-600">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-amber-800" />
            {formatNumber(total)}
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-amber-200" />
            {formatNumber(pending)} pending
          </span>
        </div>
        <p className="mt-3 text-xs leading-5 text-gray-500">{dataStatusText(isLoading, error)}</p>
      </CardContent>
    </CardShell>
  );
}

function MiniBarComparisonCard({
  title,
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  description,
}: {
  title: string;
  leftLabel: string;
  leftValue: number;
  rightLabel: string;
  rightValue: number;
  description: string;
}) {
  const maxValue = Math.max(leftValue, rightValue, 1);
  const rows = [
    { label: leftLabel, value: leftValue, icon: ArrowDownRight, color: "bg-amber-700" },
    { label: rightLabel, value: rightValue, icon: ArrowUpRight, color: "bg-blue-200" },
  ];

  return (
    <CardShell>
      <CardContent className="flex min-h-[250px] flex-col p-5">
        <p className="text-[11px] font-extrabold uppercase text-gray-500">{title}</p>
        <div className="mt-6 space-y-5">
          {rows.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm font-bold text-gray-700">
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon className="size-4 shrink-0 text-gray-500" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span>{formatNumber(item.value)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.value / maxValue) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-auto rounded-[8px] bg-amber-50 p-4 text-sm leading-5 text-amber-900">
          {description}
        </div>
      </CardContent>
    </CardShell>
  );
}

function FinancialHighlightCard({
  saldo,
  income,
  expense,
  itemCount,
  isLoading,
  error,
}: {
  saldo: number | null;
  income: number | null;
  expense: number | null;
  itemCount: number | null;
  isLoading: boolean;
  error?: string | null;
}) {
  return (
    <CardShell className="border-amber-100">
      <CardContent className="relative flex min-h-[250px] flex-col p-5">
        <div className="absolute -right-10 -top-10 size-32 rounded-full bg-amber-50" />
        <div className="relative">
          <p className="text-[11px] font-extrabold uppercase text-gray-500">Financial Highlight</p>
          <p className="mt-5 text-sm font-medium text-gray-500">Saldo aktif unit</p>
          <div className="mt-2 break-words text-3xl font-black leading-tight text-gray-950">
            {isLoading ? "Memuat..." : saldo === null ? EMPTY_TEXT : formatRupiah(saldo)}
          </div>
        </div>
        <div className="relative mt-auto space-y-3 border-t border-gray-100 pt-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">Pemasukan</span>
            <span className="font-extrabold text-emerald-700">
              {income === null ? EMPTY_TEXT : formatRupiah(income)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">Pengeluaran</span>
            <span className="font-extrabold text-amber-700">
              {expense === null ? EMPTY_TEXT : formatRupiah(expense)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500">Barang terpantau</span>
            <span className="font-extrabold text-gray-950">{formatNumber(itemCount)}</span>
          </div>
        </div>
        <p className="relative mt-3 text-xs leading-5 text-gray-500">{dataStatusText(isLoading, error)}</p>
      </CardContent>
    </CardShell>
  );
}

function HarvestBars({ rows }: { rows: JatikertoApiRow[] }) {
  const values = rows
    .map((row, index) => ({
      label: getTextValue(row, 0, fieldAliases.nama, `Item ${index + 1}`),
      value: getNumberValue(row, 4, ["proyeksiPanen", "proyeksi_panen", "panen", ...fieldAliases.jumlah], 0),
    }))
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value)
    .slice(0, 8);
  const maxValue = Math.max(...values.map((item) => item.value), 1);

  if (values.length === 0) {
    return (
      <div className="grid min-h-[142px] place-items-center rounded-[8px] bg-teal-50 text-sm font-semibold text-teal-700">
        Data panen belum tersedia
      </div>
    );
  }

  return (
    <div className="flex min-h-[170px] items-end gap-3 pt-6">
      {values.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <div
            className={`w-full rounded-t-[8px] ${index === 0 ? "bg-teal-600" : "bg-teal-100"}`}
            style={{ height: `${Math.max((item.value / maxValue) * 132, 28)}px` }}
            title={`${item.label}: ${formatNumber(item.value)}`}
          />
          <span className="w-full truncate text-center text-[11px] font-bold text-gray-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function getResearchStatus(row: JatikertoApiRow) {
  const start = parseDate(getDateValue(row, 3, ["mulai", "tanggalMulai", "tanggal_mulai", "startDate", "start_date"]));
  const end = parseDate(getDateValue(row, 4, ["selesai", "tanggalSelesai", "tanggal_selesai", "endDate", "end_date"]));
  if (!start || !end) return "-";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  if (start > today) return "Akan Dimulai";
  if (end < today) return "Selesai";
  return "Aktif";
}

export default function Dashboard() {
  const {
    data: summaryPayload,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useApiData<unknown>(API_ENDPOINTS.dashboard.summary);

  const { data: averageTrlPayload, isLoading: isAverageTrlLoading, error: averageTrlError } =
    useApiData<unknown>(API_ENDPOINTS.kst.ngijo.averageTrl);
  const { data: greenPerformancePayload, isLoading: isGreenLoading, error: greenError } =
    useApiData<unknown>(API_ENDPOINTS.kst.ngijo.greenPerformance);
  const { data: renewableEnergyPayload, isLoading: isRenewableLoading, error: renewableError } =
    useApiData<unknown>(API_ENDPOINTS.kst.ngijo.renewableEnergy);
  const { data: pendingPatentsPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.ngijo.pendingPatents,
  );
  const { data: ngijoCollaborationPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.ngijo.collaboration,
  );

  const { data: cangarSummaryPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.cangar.summary,
  );
  const { data: bookingPayload, isLoading: isBookingLoading, error: bookingError } =
    useApiData<unknown>(API_ENDPOINTS.kst.cangar.booking);
  const { data: stockPayload, isLoading: isStockLoading, error: stockError } =
    useApiData<unknown>(API_ENDPOINTS.kst.cangar.stock);
  const { data: stockItemsPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.cangar.stockItems,
  );
  const { data: financePayload, isLoading: isFinanceLoading, error: financeError } =
    useApiData<unknown>(API_ENDPOINTS.kst.cangar.finance);
  const { data: financeRecapPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.cangar.financeRecap,
  );

  const { items: pertanianRows, isLoading: isPertanianLoading, error: pertanianError } =
    usePageData<JatikertoApiRow>(API_ENDPOINTS.kst.jatikerto.pertanianItems, {
      year: "2026",
      month: "Semua Bulan",
      limit: 50,
    });
  const { items: peternakanRows, isLoading: isPeternakanLoading, error: peternakanError } =
    usePageData<JatikertoApiRow>(API_ENDPOINTS.kst.jatikerto.peternakanItems, {
      year: "2026",
      month: "Semua Bulan",
      limit: 50,
    });
  const { items: konservasiHewanRows } = usePageData<JatikertoApiRow>(
    API_ENDPOINTS.kst.jatikerto.konservasiHewan,
    { year: "2026", month: "Semua Bulan", limit: 50 },
  );
  const { items: konservasiTanamanRows, isLoading: isKonservasiLoading, error: konservasiError } =
    usePageData<JatikertoApiRow>(API_ENDPOINTS.kst.jatikerto.konservasiTanaman, {
      year: "2026",
      month: "Semua Bulan",
      limit: 50,
    });
  const { items: akademikRows, isLoading: isAkademikLoading, error: akademikError } =
    usePageData<JatikertoApiRow>(API_ENDPOINTS.kst.jatikerto.akademikItems, {
      year: "2026",
      month: "Semua Bulan",
      limit: 50,
    });

  const summary = adaptDashboardSummary(summaryPayload);
  const sources = KST_KEYS.map((key) => sourceData(summary, key));
  const summaryLoaded = !isSummaryLoading && !summaryError;
  const integratedKst = sources.filter((source) => source.data && !source.warning).length;

  const averageTrl = ngijoNumber(averageTrlPayload);
  const greenPerformance = ngijoNumber(greenPerformancePayload);
  const renewableEnergy = ngijoNumber(renewableEnergyPayload);
  const pendingPatents = ngijoNumber(pendingPatentsPayload);
  const ngijoCollaboration = ngijoNumber(ngijoCollaborationPayload);
  const ngijoPartnershipMetric = ngijoCollaboration ?? pendingPatents;

  const bookingRows = adaptBookingRows(bookingPayload);
  const bookingSummary = adaptBookingSummary(bookingPayload, bookingRows);
  const totalBooking = bookingRows.length || bookingSummary.confirmedMonth + bookingSummary.pending;
  const hasBookingData = bookingPayload !== null || bookingRows.length > 0;
  const displayTotalBooking = hasBookingData ? totalBooking : null;
  const displayPendingBooking = hasBookingData ? bookingSummary.pending : null;
  const stockRows = adaptStockRows(stockItemsPayload);
  const stockSummary = adaptStockSummary(stockPayload ?? cangarSummaryPayload, stockRows);
  const hasStockData = stockPayload !== null || cangarSummaryPayload !== null || stockRows.length > 0;
  const displayStockItems = hasStockData ? stockSummary.totalBarang : null;
  const displayStockIn = hasStockData ? stockSummary.totalMasuk : null;
  const displayStockOut = hasStockData ? stockSummary.totalKeluar : null;
  const financeRows = adaptFinanceRows(financePayload);
  const financeSummary = adaptFinanceSummary(financeRecapPayload ?? financePayload, financeRows);
  const hasFinanceData = financeRecapPayload !== null || financePayload !== null || financeRows.length > 0;
  const displaySaldo = hasFinanceData ? financeSummary.saldoHariIni : null;
  const displayIncome = hasFinanceData ? financeSummary.pemasukanHariIni : null;
  const displayExpense = hasFinanceData ? financeSummary.pengeluaranHariIni : null;

  const totalPanen = pertanianRows.reduce(
    (sum, row) =>
      sum +
      getNumberValue(row, 4, ["proyeksiPanen", "proyeksi_panen", "panen", ...fieldAliases.jumlah], 0),
    0,
  );
  const totalPopulasiTernak = peternakanRows.reduce(
    (sum, row) => sum + getNumberValue(row, 4, fieldAliases.jumlah, 0),
    0,
  );
  const totalKonservasi =
    konservasiHewanRows.reduce(
      (sum, row) => sum + getNumberValue(row, 2, fieldAliases.jumlah, 0),
      0,
    ) +
    konservasiTanamanRows.reduce(
      (sum, row) => sum + getNumberValue(row, 4, fieldAliases.jumlah, 0),
      0,
    );
  const activeAcademicResearch = akademikRows.filter(
    (row) => getResearchStatus(row) === "Aktif",
  ).length;
  const displayTotalPanen = pertanianRows.length > 0 ? totalPanen : null;
  const displayKomoditasAgro = pertanianRows.length > 0 ? pertanianRows.length : null;
  const displayPopulasiTernak = peternakanRows.length > 0 ? totalPopulasiTernak : null;
  const displayKonservasi = totalKonservasi > 0 ? totalKonservasi : null;
  const displayActiveResearch = akademikRows.length > 0 ? activeAcademicResearch : null;
  const conservationOrResearchMetric = displayKonservasi ?? displayActiveResearch;

  const mainIndicators = [
    averageTrl,
    greenPerformance,
    renewableEnergy,
    ngijoPartnershipMetric,
    displayTotalBooking,
    displayPendingBooking,
    displayStockItems,
    displaySaldo,
    displayTotalPanen,
    displayKomoditasAgro,
    displayPopulasiTernak,
    conservationOrResearchMetric,
  ].filter(hasValue).length;

  const hasNgijoData = [averageTrl, greenPerformance, renewableEnergy, ngijoPartnershipMetric].some(hasValue);
  const hasCangarData = [displayTotalBooking, displayStockItems, displaySaldo].some(hasValue);
  const hasJatikertoData = [
    displayTotalPanen,
    displayKomoditasAgro,
    displayPopulasiTernak,
    conservationOrResearchMetric,
  ].some(hasValue);
  const hasEndpointError = Boolean(
    summaryError ||
      averageTrlError ||
      greenError ||
      renewableError ||
      bookingError ||
      stockError ||
      financeError ||
      pertanianError ||
      peternakanError ||
      konservasiError ||
      akademikError,
  );

  return (
    <div className="min-h-screen bg-gray-100/70 px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        {hasEndpointError ? (
          <div className="rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Sebagian data belum dapat dimuat. Highlight yang tersedia tetap ditampilkan.
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {sources.map((source, index) => {
            const label = ["Ngijo", "Cangar", "Jatikerto"][index];
            const isWarning = Boolean(source.warning);
            return (
              <Badge
                key={label}
                variant="outline"
                className={`rounded-[6px] bg-white text-[11px] font-semibold ${
                  isWarning
                    ? "border-amber-200 text-amber-700"
                    : source.data
                      ? "border-emerald-200 text-emerald-700"
                      : "border-gray-200 text-gray-500"
                }`}
              >
                {sourceStatusLabel(source, label, summaryLoaded)}
              </Badge>
            );
          })}
        </div>

        <section className="space-y-5">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-black text-gray-950 md:text-3xl">
              Executive Dashboard
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ExecutiveSummaryCard
              label="KST Terpantau"
              value={
                isSummaryLoading
                  ? "..."
                  : summary.activeKst !== null && summary.totalKst !== null
                    ? `${summary.activeKst}/${summary.totalKst}`
                    : `${integratedKst}/${KST_KEYS.length}`
              }
              description="Live feed active"
              icon={Activity}
              featured
            />
            <ExecutiveSummaryCard
              label="Total Indikator Utama"
              value={mainIndicators > 0 ? mainIndicators : WAITING_TEXT}
              description="Highlight yang memiliki data angka"
              icon={ClipboardList}
            >
              <div className="flex items-center gap-3">
                {[0, 1, 2, 3].map((item) => (
                  <span
                    key={item}
                    className={`h-5 rounded-full ${item % 2 === 0 ? "w-10 bg-emerald-200" : "w-8 bg-emerald-900"}`}
                  />
                ))}
              </div>
            </ExecutiveSummaryCard>
            <ExecutiveSummaryCard
              label="Fokus Riset & Keberlanjutan"
              value={hasNgijoData ? formatPercent(greenPerformance) : WAITING_TEXT}
              description="TRL, green performance, energi, kolaborasi atau paten"
              icon={Leaf}
            >
              <ProgressLine label="Ngijo" value={greenPerformance} tone="emerald" />
            </ExecutiveSummaryCard>
            <ExecutiveSummaryCard
              label="Fokus Agro / Operasional / Konservasi"
              value={`${[hasCangarData, hasJatikertoData].filter(Boolean).length} fokus`}
              description="Booking, stok, saldo, panen, ternak, konservasi"
              icon={TrendingUp}
            />
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeader title="Ngijo Highlight: Riset & Keberlanjutan" tone="emerald" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <CardShell>
              <CardContent className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_minmax(240px,1fr)] md:p-6">
                <div className="flex min-h-[260px] flex-col items-center justify-center border-b border-gray-100 pb-6 text-center md:border-b-0 md:border-r md:pb-0 md:pr-6">
                  <SemiGauge value={averageTrl} max={9} tone="emerald" />
                  <h3 className="mt-4 text-xl font-black text-gray-950">Technology Readiness Level</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    Rata-rata TRL dari data riset Ngijo yang tersedia.
                  </p>
                </div>
                <div className="flex min-h-[260px] flex-col justify-center gap-6">
                  <ProgressLine label="Green Performance" value={greenPerformance} tone="emerald" />
                  <div className="rounded-[8px] border border-emerald-100 bg-emerald-50 p-4">
                    <p className="text-[11px] font-extrabold uppercase text-emerald-700">Status data</p>
                    <p className="mt-2 text-sm leading-6 text-emerald-900">
                      {dataStatusText(
                        isAverageTrlLoading || isGreenLoading,
                        averageTrlError || greenError,
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </CardShell>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <CompactMetricCard
                label="Energi Terbarukan"
                value={isRenewableLoading ? "Memuat..." : formatNumber(renewableEnergy, "MWh")}
                description={dataStatusText(isRenewableLoading, renewableError)}
                icon={Zap}
                tone="emerald"
              />
              <CompactMetricCard
                label={ngijoCollaboration !== null ? "Kolaborasi" : "Paten Tertunda"}
                value={formatNumber(ngijoPartnershipMetric)}
                description={
                  ngijoPartnershipMetric === null
                    ? WAITING_TEXT
                    : ngijoCollaboration !== null
                      ? "Kolaborasi yang dilaporkan API Ngijo."
                      : "Paten tertunda yang dilaporkan API Ngijo."
                }
                icon={Handshake}
                tone="emerald"
              />
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeader title="Cangar Highlight: Operasional & Keuangan" tone="amber" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <DonutMetricCard
              total={displayTotalBooking}
              pending={displayPendingBooking}
              isLoading={isBookingLoading}
              error={bookingError}
            />
            <MiniBarComparisonCard
              title="Stok Masuk vs Keluar"
              leftLabel="Stok Masuk"
              leftValue={displayStockIn ?? 0}
              rightLabel="Stok Keluar"
              rightValue={displayStockOut ?? 0}
              description={dataStatusText(isStockLoading, stockError)}
            />
            <FinancialHighlightCard
              saldo={displaySaldo}
              income={displayIncome}
              expense={displayExpense}
              itemCount={displayStockItems}
              isLoading={isFinanceLoading}
              error={financeError}
            />
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeader title="Jatikerto Highlight: Agro & Konservasi" tone="teal" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <CardShell>
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold uppercase text-teal-700">Proyeksi Panen</p>
                    <h3 className="mt-2 text-2xl font-black text-gray-950">
                      {isPertanianLoading ? "Memuat..." : formatNumber(displayTotalPanen, "Kg")}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                      Visual ringkasan berdasarkan komoditas pertanian yang tersedia, bukan data historis bulanan.
                    </p>
                  </div>
                  <Badge className="w-fit rounded-[6px] border border-teal-200 bg-teal-50 font-bold text-teal-700">
                    {formatNumber(displayKomoditasAgro)} komoditas
                  </Badge>
                </div>
                <HarvestBars rows={pertanianRows} />
                <p className="mt-4 text-xs leading-5 text-gray-500">
                  {dataStatusText(isPertanianLoading, pertanianError)}
                </p>
              </CardContent>
            </CardShell>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <CompactMetricCard
                label="Komoditas Agro"
                value={isPertanianLoading ? "Memuat..." : formatNumber(displayKomoditasAgro)}
                description="Jumlah komoditas dari data pertanian Jatikerto."
                icon={Sprout}
                tone="teal"
                className="bg-teal-50/45"
              />
              <CompactMetricCard
                label="Populasi Ternak"
                value={isPeternakanLoading ? "Memuat..." : formatNumber(displayPopulasiTernak)}
                description={dataStatusText(isPeternakanLoading, peternakanError)}
                icon={Boxes}
                tone="teal"
                className="bg-teal-50/45"
              />
              <CompactMetricCard
                label={displayKonservasi !== null ? "Populasi Konservasi" : "Mahasiswa Riset"}
                value={
                  isKonservasiLoading || isAkademikLoading
                    ? "Memuat..."
                    : formatNumber(conservationOrResearchMetric)
                }
                description={
                  displayKonservasi !== null
                    ? dataStatusText(isKonservasiLoading, konservasiError)
                    : dataStatusText(isAkademikLoading, akademikError)
                }
                icon={displayKonservasi !== null ? Leaf : GraduationCap}
                tone="teal"
                className="bg-teal-50/45"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
