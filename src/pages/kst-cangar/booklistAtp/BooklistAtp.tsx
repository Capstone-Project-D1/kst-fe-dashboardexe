import { useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, Clock3, RotateCcw, Search } from "lucide-react";
import { useApiData } from "@/api/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { adaptBookingRows, adaptBookingSummary } from "../adapters";

const BOOKING_TABS = ["Daftar Booking", "Jadwal & Ketersediaan"];

type BookingFilters = {
  status: string;
  layanan: string;
  tanggal: string;
};

const initialFilters: BookingFilters = {
  status: "all",
  layanan: "all",
  tanggal: "",
};

function bookingStatusMatches(rowStatus: string, selectedStatus: string) {
  if (selectedStatus === "all") return true;

  const normalizedStatus = rowStatus.toLowerCase();
  if (selectedStatus === "cancelled") {
    return ["cancelled", "canceled", "dibatalkan", "batal"].includes(normalizedStatus);
  }

  return normalizedStatus === selectedStatus.toLowerCase();
}

const SERVICE_CAPACITY: Record<string, { label: string; capacity: number }> = {
  glamping: { label: "🏕️ Glamping", capacity: 10 },
  cafe: { label: "☕ Café Eduwisata", capacity: 50 },
  camping: { label: "⛺ Camping", capacity: 20 },
};

function serviceInfo(layanan: string) {
  const key = layanan.toLowerCase();
  return SERVICE_CAPACITY[key] ?? { label: layanan === "-" ? "-" : layanan, capacity: 0 };
}

export default function BooklistAtp() {
  const [draftFilters, setDraftFilters] = useState<BookingFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<BookingFilters>(initialFilters);

  const {
    data: bookingPayload,
    isLoading,
    error: bookingError,
  } = useApiData<unknown>("/api/kst/cangar/data/booking", { limit: 100 });
  const { data: summaryPayload, error: summaryError } = useApiData<unknown>(
    "/api/kst/cangar/data/summary",
  );

  const rows = useMemo(() => adaptBookingRows(bookingPayload), [bookingPayload]);
  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const statusMatches = bookingStatusMatches(row.status, appliedFilters.status);
        const layananMatches =
          appliedFilters.layanan === "all" ||
          row.layanan.toLowerCase() === appliedFilters.layanan.toLowerCase();
        const tanggalMatches =
          !appliedFilters.tanggal || row.tanggalRaw === appliedFilters.tanggal;

        return statusMatches && layananMatches && tanggalMatches;
      }),
    [rows, appliedFilters],
  );
  const summary = useMemo(() => adaptBookingSummary(summaryPayload, rows), [summaryPayload, rows]);
  const scheduleRows = useMemo(() => {
    const grouped = new Map<
      string,
      {
        key: string;
        tanggal: string;
        tanggalRaw: string;
        layanan: string;
        totalBooking: number;
        confirmedQty: number;
        pending: number;
        capacity: number;
      }
    >();

    rows.forEach((row) => {
      const info = serviceInfo(row.layanan);
      const key = `${row.tanggalRaw}-${row.layanan.toLowerCase()}`;
      const existing = grouped.get(key) ?? {
        key,
        tanggal: row.tanggal,
        tanggalRaw: row.tanggalRaw,
        layanan: info.label,
        totalBooking: 0,
        confirmedQty: 0,
        pending: 0,
        capacity: info.capacity,
      };

      existing.totalBooking += 1;
      if (row.status === "Confirmed") existing.confirmedQty += row.jumlah;
      if (row.status === "Pending") existing.pending += 1;
      grouped.set(key, existing);
    });

    return Array.from(grouped.values()).sort((left, right) =>
      `${left.tanggalRaw}-${left.layanan}`.localeCompare(`${right.tanggalRaw}-${right.layanan}`),
    );
  }, [rows]);
  const layananOptions = useMemo(() => {
    const options = Array.from(new Set(rows.map((row) => row.layanan).filter((value) => value !== "-")));
    return options.length > 0 ? options : ["Glamping", "Camping", "Villa"];
  }, [rows]);

  const handleReset = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  return (
    <div className="flex min-h-screen flex-col gap-5 bg-gray-50/50 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-gray-900">Manajemen Booking</h1>
        <p className="text-sm font-medium text-gray-500">KST Cangar</p>
      </div>

      {bookingError || summaryError ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Sebagian data booking Cangar belum bisa dimuat. Nilai kosong memakai fallback.
        </div>
      ) : null}

      <Tabs defaultValue="Daftar Booking" className="gap-4">
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-10 w-max bg-white shadow-sm">
            {BOOKING_TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="px-4 text-[13px]">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="Daftar Booking" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Menunggu Konfirmasi</CardTitle>
                <Clock3 className="size-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{summary.pending}</div>
              </CardContent>
            </Card>

            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Confirmed Bulan Ini</CardTitle>
                <CheckCircle2 className="size-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{summary.confirmedMonth}</div>
              </CardContent>
            </Card>

            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Booking Hari Ini</CardTitle>
                <CalendarCheck className="size-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{summary.today}</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm xl:flex-row xl:items-end xl:justify-between">
            <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-gray-600">Status</span>
                <Select
                  value={draftFilters.status}
                  onValueChange={(status) => setDraftFilters((current) => ({ ...current, status }))}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className="space-y-1.5">
                <span className="text-xs font-semibold text-gray-600">Layanan</span>
                <Select
                  value={draftFilters.layanan}
                  onValueChange={(layanan) => setDraftFilters((current) => ({ ...current, layanan }))}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Layanan</SelectItem>
                    {layananOptions.map((layanan) => (
                      <SelectItem key={layanan} value={layanan}>
                        {layanan}
                      </SelectItem>
                    ))}
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
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="min-w-[80px] font-bold text-gray-600">ID</TableHead>
                    <TableHead className="min-w-[200px] font-bold text-gray-600">Nama Customer</TableHead>
                    <TableHead className="min-w-[150px] font-bold text-gray-600">No. HP</TableHead>
                    <TableHead className="min-w-[150px] font-bold text-gray-600">Layanan</TableHead>
                    <TableHead className="min-w-[150px] font-bold text-gray-600">Tanggal</TableHead>
                    <TableHead className="min-w-[90px] text-right font-bold text-gray-600">Jumlah</TableHead>
                    <TableHead className="min-w-[130px] font-bold text-gray-600">Status</TableHead>
                    <TableHead className="min-w-[180px] font-bold text-gray-600">Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-28 text-center text-sm font-medium text-gray-500">
                        {isLoading ? "Memuat data booking Cangar..." : "Tidak ada data booking sesuai filter."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50/60">
                        <TableCell className="font-semibold text-gray-900">#{row.id}</TableCell>
                        <TableCell className="font-medium text-gray-900">{row.namaCustomer}</TableCell>
                        <TableCell className="text-gray-600">{row.noHp}</TableCell>
                        <TableCell className="text-gray-600">{row.layanan}</TableCell>
                        <TableCell className="text-gray-600">{row.tanggal}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.jumlah}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-md",
                              row.status === "Confirmed"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : row.status === "Dibatalkan"
                                  ? "border-red-200 bg-red-50 text-red-700"
                                  : "border-amber-200 bg-amber-50 text-amber-700",
                            )}
                          >
                            {row.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[220px] whitespace-normal break-words text-gray-600">
                          {row.catatan}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Jadwal & Ketersediaan" className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-gray-700">Kapasitas per Hari</p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm font-medium text-gray-600">
              <Badge variant="outline" className="rounded-md border-gray-200 bg-gray-50 text-gray-700">
                🏕️ Glamping: 10 orang
              </Badge>
              <Badge variant="outline" className="rounded-md border-gray-200 bg-gray-50 text-gray-700">
                ☕ Café: 50 orang
              </Badge>
              <Badge variant="outline" className="rounded-md border-gray-200 bg-gray-50 text-gray-700">
                ⛺ Camping: 20 orang
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Total Jadwal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{scheduleRows.length}</div>
              </CardContent>
            </Card>
            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Qty Confirmed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-700">
                  {scheduleRows.reduce((total, row) => total + row.confirmedQty, 0)}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Sisa Kapasitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700">
                  {scheduleRows.reduce((total, row) => total + Math.max(0, row.capacity - row.confirmedQty), 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[920px]">
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="min-w-[150px] font-bold text-gray-600">Tanggal</TableHead>
                    <TableHead className="min-w-[170px] font-bold text-gray-600">Layanan</TableHead>
                    <TableHead className="min-w-[130px] text-right font-bold text-gray-600">Total Booking</TableHead>
                    <TableHead className="min-w-[140px] text-right font-bold text-gray-600">Qty Confirmed</TableHead>
                    <TableHead className="min-w-[110px] text-right font-bold text-gray-600">Pending</TableHead>
                    <TableHead className="min-w-[140px] font-bold text-gray-600">Ketersediaan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-28 text-center text-sm font-medium text-gray-500">
                        {isLoading ? "Memuat jadwal booking Cangar..." : "Belum ada jadwal booking Cangar."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    scheduleRows.map((row) => (
                      <TableRow key={row.key} className="hover:bg-gray-50/60">
                        <TableCell className="text-gray-600">{row.tanggal}</TableCell>
                        <TableCell className="font-medium text-gray-900">{row.layanan}</TableCell>
                        <TableCell className="text-right tabular-nums">{row.totalBooking}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {row.confirmedQty} / {row.capacity}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{row.pending}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-md border-emerald-200 bg-emerald-50 text-emerald-700">
                            Sisa {Math.max(0, row.capacity - row.confirmedQty)}
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
      </Tabs>
    </div>
  );
}
