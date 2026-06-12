import { useCallback, useMemo, useState } from "react";
import { Banknote, RotateCcw, Search, TrendingDown, TrendingUp } from "lucide-react";
import { useApiData } from "@/api/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { adaptFinanceRows, adaptFinanceSummary, formatRupiah } from "../adapters";

const FINANCE_TABS = ["Input Transaksi", "Rekap Harian", "Rekap Mingguan", "Rekap Bulanan"];

type FinanceFilters = {
  jenis: string;
  tanggal: string;
};

const initialFilters: FinanceFilters = {
  jenis: "all",
  tanggal: "",
};

function todayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function currentMonthString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function currentWeekString() {
  // Return current ISO week string in YYYY-Www format for week picker
  const d = new Date();
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

/** Parse YYYY-Www to get start (Mon) and end (Sun) dates */
function parseWeekRange(weekStr: string): { start: string; end: string } | null {
  const match = weekStr.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const week = Number(match[2]);

  // ISO week: Jan 4 is always in week 1
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const fmt = (d: Date) => {
    const yy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
  };

  return { start: fmt(monday), end: fmt(sunday) };
}

function financeStatusClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "tervalidasi" || normalized === "validated") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (normalized === "draft") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (normalized === "rejected" || normalized === "ditolak") {
    return "border-red-200 bg-red-50 text-red-700";
  }
  return "border-gray-200 bg-gray-50 text-gray-700";
}

export default function KeuanganCangar() {
  const [activeTab, setActiveTab] = useState("Input Transaksi");
  // --- Input Transaksi tab state ---
  const [draftFilters, setDraftFilters] = useState<FinanceFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<FinanceFilters>(initialFilters);

  // --- Rekap Harian state ---
  const [rekapHarianDate, setRekapHarianDate] = useState(todayString());
  const [appliedHarianDate, setAppliedHarianDate] = useState(todayString());

  // --- Rekap Mingguan state ---
  const [rekapMingguanWeek, setRekapMingguanWeek] = useState(currentWeekString());
  const [appliedMingguanWeek, setAppliedMingguanWeek] = useState(currentWeekString());

  // --- Rekap Bulanan state ---
  const [rekapBulananMonth, setRekapBulananMonth] = useState(currentMonthString());
  const [appliedBulananMonth, setAppliedBulananMonth] = useState(currentMonthString());

  // --- Main finance data (for Input Transaksi tab) ---
  const {
    data: keuanganPayload,
    isLoading,
    error: keuanganError,
  } = useApiData<unknown>("/api/kst/cangar/data/keuangan", { limit: 100 });

  // --- Rekap endpoint (for Input Transaksi summary cards) ---
  const { data: rekapPayload, error: rekapError } = useApiData<unknown>(
    "/api/kst/cangar/data/keuangan/rekap",
    appliedFilters.tanggal ? { tanggal: appliedFilters.tanggal } : undefined,
  );

  // --- Rekap Harian data ---
  const {
    data: rekapHarianPayload,
    isLoading: isLoadingHarian,
    error: harianError,
  } = useApiData<unknown>("/api/kst/cangar/data/keuangan", { tanggal: appliedHarianDate });

  // --- Rekap Mingguan data ---
  const mingguanRange = useMemo(() => parseWeekRange(appliedMingguanWeek), [appliedMingguanWeek]);
  const {
    data: rekapMingguanPayload,
    isLoading: isLoadingMingguan,
    error: mingguanError,
  } = useApiData<unknown>(
    "/api/kst/cangar/data/keuangan",
    mingguanRange
      ? { start_date: mingguanRange.start, end_date: mingguanRange.end }
      : { week: appliedMingguanWeek },
  );

  // --- Rekap Bulanan data ---
  const {
    data: rekapBulananPayload,
    isLoading: isLoadingBulanan,
    error: bulananError,
  } = useApiData<unknown>("/api/kst/cangar/data/keuangan", { month: appliedBulananMonth });

  // --- Input Transaksi rows ---
  const rows = useMemo(() => adaptFinanceRows(keuanganPayload), [keuanganPayload]);
  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const jenisMatches =
          appliedFilters.jenis === "all" ||
          row.jenis.toLowerCase() === appliedFilters.jenis.toLowerCase();
        const tanggalMatches =
          !appliedFilters.tanggal || row.tanggalRaw === appliedFilters.tanggal;

        return jenisMatches && tanggalMatches;
      }),
    [rows, appliedFilters],
  );
  const summary = useMemo(() => adaptFinanceSummary(rekapPayload, filteredRows), [rekapPayload, filteredRows]);

  // --- Rekap Harian rows & summary ---
  const harianRows = useMemo(() => adaptFinanceRows(rekapHarianPayload), [rekapHarianPayload]);
  const harianFilteredRows = useMemo(
    () => (appliedHarianDate ? harianRows.filter((r) => r.tanggalRaw === appliedHarianDate) : harianRows),
    [harianRows, appliedHarianDate],
  );
  // Fallback: if backend returned no data for the date filter, try filtering from all rows
  const harianDisplayRows = useMemo(
    () => (harianFilteredRows.length > 0 ? harianFilteredRows : rows.filter((r) => r.tanggalRaw === appliedHarianDate)),
    [harianFilteredRows, rows, appliedHarianDate],
  );
  const harianSummary = useMemo(() => {
    const pemasukan = harianDisplayRows
      .filter((r) => r.jenis === "Pemasukan")
      .reduce((sum, r) => sum + r.nominal, 0);
    const pengeluaran = harianDisplayRows
      .filter((r) => r.jenis === "Pengeluaran")
      .reduce((sum, r) => sum + r.nominal, 0);
    return { pemasukan, pengeluaran, saldo: pemasukan - pengeluaran };
  }, [harianDisplayRows]);

  // --- Rekap Mingguan rows & summary ---
  const mingguanRows = useMemo(() => adaptFinanceRows(rekapMingguanPayload), [rekapMingguanPayload]);
  const mingguanFilteredRows = useMemo(() => {
    if (!mingguanRange) return mingguanRows;
    return mingguanRows.length > 0
      ? mingguanRows
      : rows.filter((r) => r.tanggalRaw >= mingguanRange.start && r.tanggalRaw <= mingguanRange.end);
  }, [mingguanRows, rows, mingguanRange]);
  const mingguanSummary = useMemo(() => {
    const pemasukan = mingguanFilteredRows
      .filter((r) => r.jenis === "Pemasukan")
      .reduce((sum, r) => sum + r.nominal, 0);
    const pengeluaran = mingguanFilteredRows
      .filter((r) => r.jenis === "Pengeluaran")
      .reduce((sum, r) => sum + r.nominal, 0);
    return { pemasukan, pengeluaran, saldo: pemasukan - pengeluaran };
  }, [mingguanFilteredRows]);

  // --- Rekap Bulanan rows & summary ---
  const bulananRows = useMemo(() => adaptFinanceRows(rekapBulananPayload), [rekapBulananPayload]);
  const bulananFilteredRows = useMemo(() => {
    if (!appliedBulananMonth) return bulananRows;
    return bulananRows.length > 0
      ? bulananRows
      : rows.filter((r) => r.tanggalRaw.startsWith(appliedBulananMonth));
  }, [bulananRows, rows, appliedBulananMonth]);
  const bulananSummary = useMemo(() => {
    const pemasukan = bulananFilteredRows
      .filter((r) => r.jenis === "Pemasukan")
      .reduce((sum, r) => sum + r.nominal, 0);
    const pengeluaran = bulananFilteredRows
      .filter((r) => r.jenis === "Pengeluaran")
      .reduce((sum, r) => sum + r.nominal, 0);
    return { pemasukan, pengeluaran, saldo: pemasukan - pengeluaran };
  }, [bulananFilteredRows]);

  const handleReset = useCallback(() => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }, []);

  const hasAnyError = keuanganError || rekapError || harianError || mingguanError || bulananError;

  return (
    <div className="flex min-h-screen flex-col gap-5 bg-gray-50/50 p-4 md:p-6">
      {hasAnyError ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Sebagian data keuangan Cangar belum bisa dimuat. Nilai kosong memakai fallback.
        </div>
      ) : null}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
        <div className="w-full sm:w-auto overflow-x-auto scrollbar-none pb-1">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm w-max">
            {FINANCE_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-150 whitespace-nowrap",
                  activeTab === tab
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== INPUT TRANSAKSI ==================== */}
        <TabsContent value="Input Transaksi" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">
                  Pemasukan Hari Ini
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">
                  {formatRupiah(summary.pemasukanHariIni)}
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <TrendingDown className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">
                  Pengeluaran Hari Ini
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-red-700 tracking-tight">
                  {formatRupiah(summary.pengeluaranHariIni)}
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <Banknote className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">
                  Saldo Hari Ini
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {formatRupiah(summary.saldoHariIni)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm xl:flex-row xl:items-end xl:justify-between">
            <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-gray-600">Jenis</span>
                <Select
                  value={draftFilters.jenis}
                  onValueChange={(jenis) => setDraftFilters((current) => ({ ...current, jenis }))}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="pemasukan">Pemasukan</SelectItem>
                    <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-gray-600">Tanggal</span>
                <Input
                  type="date"
                  value={draftFilters.tanggal}
                  onChange={(event) =>
                    setDraftFilters((current) => ({ ...current, tanggal: event.target.value }))
                  }
                  className="bg-white"
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                className="gap-2 bg-[#27A376] text-white hover:bg-[#1f8a63]"
                onClick={() => setAppliedFilters(draftFilters)}
              >
                <Search className="size-4" />
                Filter
              </Button>
              <Button type="button" variant="outline" className="gap-2" onClick={handleReset}>
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[980px]">
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="min-w-[80px] font-bold text-gray-600">ID</TableHead>
                    <TableHead className="min-w-[150px] font-bold text-gray-600">Tanggal</TableHead>
                    <TableHead className="min-w-[130px] font-bold text-gray-600">Jenis</TableHead>
                    <TableHead className="min-w-[160px] font-bold text-gray-600">Kategori</TableHead>
                    <TableHead className="min-w-[150px] text-right font-bold text-gray-600">Nominal</TableHead>
                    <TableHead className="min-w-[240px] font-bold text-gray-600">Keterangan</TableHead>
                    <TableHead className="min-w-[130px] font-bold text-gray-600">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-28 text-center text-sm font-medium text-gray-500">
                        {isLoading ? "Memuat data keuangan Cangar..." : "Tidak ada data keuangan sesuai filter."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50/60">
                        <TableCell className="font-semibold text-gray-900">#{row.id}</TableCell>
                        <TableCell className="text-gray-600">{row.tanggal}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-md",
                              row.jenis === "Pemasukan"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : row.jenis === "Pengeluaran"
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-gray-200 bg-gray-50 text-gray-700",
                            )}
                          >
                            {row.jenis}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{row.kategori}</TableCell>
                        <TableCell className="text-right font-semibold text-gray-900 tabular-nums">
                          {formatRupiah(row.nominal)}
                        </TableCell>
                        <TableCell className="max-w-[260px] whitespace-normal break-words text-gray-600">
                          {row.keterangan}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("rounded-md", financeStatusClass(row.status))}>
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* ==================== REKAP HARIAN ==================== */}
        <TabsContent value="Rekap Harian" className="space-y-4">
          {/* Date picker */}
          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-gray-700">Tanggal:</span>
              <Input
                type="date"
                value={rekapHarianDate}
                onChange={(e) => setRekapHarianDate(e.target.value)}
                className="w-full bg-white sm:w-56"
              />
            </label>
            <Button
              type="button"
              className="gap-2 bg-[#27A376] text-white hover:bg-[#1f8a63]"
              onClick={() => setAppliedHarianDate(rekapHarianDate)}
            >
              <Search className="size-4" />
              Tampilkan
            </Button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">
                  Total Pemasukan
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">{formatRupiah(harianSummary.pemasukan)}</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <TrendingDown className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">
                  Total Pengeluaran
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-red-700 tracking-tight">{formatRupiah(harianSummary.pengeluaran)}</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <Banknote className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">
                  Saldo Bersih
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{formatRupiah(harianSummary.saldo)}</span>
              </div>
            </div>
          </div>

          {/* Transaction detail table */}
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[980px]">
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="min-w-[80px] font-bold text-gray-600">ID</TableHead>
                    <TableHead className="min-w-[150px] font-bold text-gray-600">Tanggal</TableHead>
                    <TableHead className="min-w-[130px] font-bold text-gray-600">Jenis</TableHead>
                    <TableHead className="min-w-[160px] font-bold text-gray-600">Kategori</TableHead>
                    <TableHead className="min-w-[150px] text-right font-bold text-gray-600">Nominal</TableHead>
                    <TableHead className="min-w-[240px] font-bold text-gray-600">Keterangan</TableHead>
                    <TableHead className="min-w-[130px] font-bold text-gray-600">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {harianDisplayRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-28 text-center text-sm font-medium text-gray-500">
                        {isLoadingHarian ? "Memuat rekap harian Cangar..." : "Tidak ada data untuk tanggal ini."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    harianDisplayRows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50/60">
                        <TableCell className="font-semibold text-gray-900">#{row.id}</TableCell>
                        <TableCell className="text-gray-600">{row.tanggal}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-md",
                              row.jenis === "Pemasukan"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : row.jenis === "Pengeluaran"
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-gray-200 bg-gray-50 text-gray-700",
                            )}
                          >
                            {row.jenis}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{row.kategori}</TableCell>
                        <TableCell className="text-right font-semibold text-gray-900 tabular-nums">
                          {formatRupiah(row.nominal)}
                        </TableCell>
                        <TableCell className="max-w-[260px] whitespace-normal break-words text-gray-600">
                          {row.keterangan}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("rounded-md", financeStatusClass(row.status))}>
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* ==================== REKAP MINGGUAN ==================== */}
        <TabsContent value="Rekap Mingguan" className="space-y-4">
          {/* Week picker */}
          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-gray-700">Minggu:</span>
              <Input
                type="week"
                value={rekapMingguanWeek}
                onChange={(e) => setRekapMingguanWeek(e.target.value)}
                className="w-full bg-white sm:w-56"
              />
            </label>
            <Button
              type="button"
              className="gap-2 bg-[#27A376] text-white hover:bg-[#1f8a63]"
              onClick={() => setAppliedMingguanWeek(rekapMingguanWeek)}
            >
              <Search className="size-4" />
              Tampilkan
            </Button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">
                  Total Pemasukan Minggu Ini
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">{formatRupiah(mingguanSummary.pemasukan)}</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <TrendingDown className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">
                  Total Pengeluaran Minggu Ini
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-red-700 tracking-tight">{formatRupiah(mingguanSummary.pengeluaran)}</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <Banknote className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">
                  Saldo Bersih
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{formatRupiah(mingguanSummary.saldo)}</span>
              </div>
            </div>
          </div>

          {/* Weekly data or empty state */}
          {isLoadingMingguan ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm font-medium text-gray-500 shadow-sm">
              Memuat rekap mingguan Cangar...
            </div>
          ) : mingguanFilteredRows.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm font-medium text-gray-500 shadow-sm">
              Tidak ada data untuk minggu ini.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <Table className="min-w-[980px]">
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="min-w-[80px] font-bold text-gray-600">ID</TableHead>
                      <TableHead className="min-w-[150px] font-bold text-gray-600">Tanggal</TableHead>
                      <TableHead className="min-w-[130px] font-bold text-gray-600">Jenis</TableHead>
                      <TableHead className="min-w-[160px] font-bold text-gray-600">Kategori</TableHead>
                      <TableHead className="min-w-[150px] text-right font-bold text-gray-600">Nominal</TableHead>
                      <TableHead className="min-w-[240px] font-bold text-gray-600">Keterangan</TableHead>
                      <TableHead className="min-w-[130px] font-bold text-gray-600">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mingguanFilteredRows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50/60">
                        <TableCell className="font-semibold text-gray-900">#{row.id}</TableCell>
                        <TableCell className="text-gray-600">{row.tanggal}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-md",
                              row.jenis === "Pemasukan"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : row.jenis === "Pengeluaran"
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-gray-200 bg-gray-50 text-gray-700",
                            )}
                          >
                            {row.jenis}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{row.kategori}</TableCell>
                        <TableCell className="text-right font-semibold text-gray-900 tabular-nums">
                          {formatRupiah(row.nominal)}
                        </TableCell>
                        <TableCell className="max-w-[260px] whitespace-normal break-words text-gray-600">
                          {row.keterangan}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("rounded-md", financeStatusClass(row.status))}>
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ==================== REKAP BULANAN ==================== */}
        <TabsContent value="Rekap Bulanan" className="space-y-4">
          {/* Month picker */}
          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
            <label className="space-y-1.5">
              <span className="text-sm font-semibold text-gray-700">Bulan:</span>
              <Input
                type="month"
                value={rekapBulananMonth}
                onChange={(e) => setRekapBulananMonth(e.target.value)}
                className="w-full bg-white sm:w-56"
              />
            </label>
            <Button
              type="button"
              className="gap-2 bg-[#27A376] text-white hover:bg-[#1f8a63]"
              onClick={() => setAppliedBulananMonth(rekapBulananMonth)}
            >
              <Search className="size-4" />
              Tampilkan
            </Button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">
                  Total Pemasukan Bulan Ini
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">{formatRupiah(bulananSummary.pemasukan)}</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <TrendingDown className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">
                  Total Pengeluaran Bulan Ini
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-red-700 tracking-tight">{formatRupiah(bulananSummary.pengeluaran)}</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <Banknote className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">
                  Saldo Bersih Bulan Ini
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{formatRupiah(bulananSummary.saldo)}</span>
              </div>
            </div>
          </div>

          {/* Monthly data or empty state */}
          {isLoadingBulanan ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm font-medium text-gray-500 shadow-sm">
              Memuat rekap bulanan Cangar...
            </div>
          ) : bulananFilteredRows.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm font-medium text-gray-500 shadow-sm">
              Tidak ada data untuk bulan ini.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <Table className="min-w-[980px]">
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="min-w-[80px] font-bold text-gray-600">ID</TableHead>
                      <TableHead className="min-w-[150px] font-bold text-gray-600">Tanggal</TableHead>
                      <TableHead className="min-w-[130px] font-bold text-gray-600">Jenis</TableHead>
                      <TableHead className="min-w-[160px] font-bold text-gray-600">Kategori</TableHead>
                      <TableHead className="min-w-[150px] text-right font-bold text-gray-600">Nominal</TableHead>
                      <TableHead className="min-w-[240px] font-bold text-gray-600">Keterangan</TableHead>
                      <TableHead className="min-w-[130px] font-bold text-gray-600">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bulananFilteredRows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50/60">
                        <TableCell className="font-semibold text-gray-900">#{row.id}</TableCell>
                        <TableCell className="text-gray-600">{row.tanggal}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-md",
                              row.jenis === "Pemasukan"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : row.jenis === "Pengeluaran"
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-gray-200 bg-gray-50 text-gray-700",
                            )}
                          >
                            {row.jenis}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">{row.kategori}</TableCell>
                        <TableCell className="text-right font-semibold text-gray-900 tabular-nums">
                          {formatRupiah(row.nominal)}
                        </TableCell>
                        <TableCell className="max-w-[260px] whitespace-normal break-words text-gray-600">
                          {row.keterangan}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("rounded-md", financeStatusClass(row.status))}>
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}