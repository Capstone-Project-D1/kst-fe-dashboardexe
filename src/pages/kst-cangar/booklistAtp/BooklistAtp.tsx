import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CalendarCheck,
  Wallet,
  ChevronDown,
} from "lucide-react";
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

interface BookingRow {
  no: number;
  nama: string;
  checkIn: string;
  checkOut: string;
  tipe: string;
  noUnit: string;
  harga: string;
  status: "Lunas" | "Belum Lunas";
  keterangan: string;
}

const bookingData: BookingRow[] = [
  {
    no: 1,
    nama: "Ahmad Rizki Alsena Airlangga",
    checkIn: "1/5/2026",
    checkOut: "3/5/2026",
    tipe: "Glamping Deluxe",
    noUnit: "Deluxe 3",
    harga: "Rp 1.500.000",
    status: "Lunas",
    keterangan: "Transfer Bank",
  },
  {
    no: 2,
    nama: "Siti Nurhaliza",
    checkIn: "2/5/2026",
    checkOut: "6/5/2026",
    tipe: "Villa Family",
    noUnit: "Villa 5",
    harga: "Rp 2.800.000",
    status: "Lunas",
    keterangan: "Kartu Kredit",
  },
  {
    no: 3,
    nama: "Budi Santoso",
    checkIn: "3/5/2026",
    checkOut: "4/5/2026",
    tipe: "Camping Ground",
    noUnit: "Tenda Standard",
    harga: "Rp 500.000",
    status: "Belum Lunas",
    keterangan: "Cash",
  },
  {
    no: 4,
    nama: "Dewi Lestari",
    checkIn: "4/5/2026",
    checkOut: "7/5/2026",
    tipe: "Glamping Deluxe",
    noUnit: "Deluxe 1",
    harga: "Rp 1.700.000",
    status: "Lunas",
    keterangan: "Transfer Bank",
  },
  {
    no: 5,
    nama: "Rian Aditya",
    checkIn: "2/5/2026",
    checkOut: "5/5/2026",
    tipe: "Villa Family",
    noUnit: "Villa 3",
    harga: "Rp 2.600.000",
    status: "Belum Lunas",
    keterangan: "Kartu Kredit",
  },
  {
    no: 6,
    nama: "Maya Sari",
    checkIn: "5/5/2026",
    checkOut: "9/5/2026",
    tipe: "Camping Ground",
    noUnit: "Tenda Premium",
    harga: "Rp 850.000",
    status: "Lunas",
    keterangan: "Cash",
  },
  {
    no: 7,
    nama: "Agus Wijaya",
    checkIn: "1/5/2026",
    checkOut: "3/5/2026",
    tipe: "Glamping Deluxe",
    noUnit: "Deluxe 2",
    harga: "Rp 1.550.000",
    status: "Lunas",
    keterangan: "Transfer Bank",
  },
  {
    no: 8,
    nama: "Lila Pratiwi",
    checkIn: "6/5/2026",
    checkOut: "10/5/2026",
    tipe: "Villa Family",
    noUnit: "Villa 4",
    harga: "Rp 2.900.000",
    status: "Belum Lunas",
    keterangan: "Kartu Kredit",
  },
  {
    no: 9,
    nama: "Andi Setiawan",
    checkIn: "3/5/2026",
    checkOut: "5/5/2026",
    tipe: "Camping Ground",
    noUnit: "Tenda Standard",
    harga: "Rp 450.000",
    status: "Lunas",
    keterangan: "Cash",
  },
  {
    no: 10,
    nama: "Nina Kartika",
    checkIn: "4/5/2026",
    checkOut: "8/5/2026",
    tipe: "Glamping Deluxe",
    noUnit: "Deluxe 3",
    harga: "Rp 1.600.000",
    status: "Belum Lunas",
    keterangan: "Transfer Bank",
  },
];

const months = ["Semua Bulan", "Januari", "Februari", "Maret", "April"];

function MonthTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-150 whitespace-nowrap",
        active
          ? "bg-gray-900 text-white shadow-sm"
          : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
      )}
    >
      {label}
    </button>
  );
}

export default function BooklistAtp() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("Semua Bulan");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");

  const totalPages = 7;
  const lunasCount = bookingData.filter((row) => row.status === "Lunas").length;
  const belumLunasCount = bookingData.filter(
    (row) => row.status === "Belum Lunas"
  ).length;

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 bg-gray-50/50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CalendarCheck className="size-4" />
            </div>
            <span className="text-[12px] font-semibold text-gray-600">
              Total Booking
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
              1
            </span>
            <div className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-600">
              <TrendingUp className="size-3" />
              +12.5%
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="text-[13px] font-bold text-gray-800">
              Peningkatan 12.5% dari bulan lalu
            </p>
            <p className="text-[11px] text-gray-400 font-medium">
              Booking pada bulan ini meningkat sebesar 12.5%.
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Wallet className="size-4" />
            </div>
            <span className="text-[12px] font-semibold text-gray-600">
              Total Pendapatan
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Rp 1.800.000
            </span>
            <div className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold bg-red-50 text-red-500">
              <TrendingDown className="size-3" />
              -20%
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="text-[13px] font-bold text-gray-800">
              Penurunan 20% dari bulan lalu
            </p>
            <p className="text-[11px] text-gray-400 font-medium">
              Pendapatan yang masuk bulan ini menurun sebesar 20%.
            </p>
          </div>
        </div>

        <div className="flex flex-row lg:flex-col gap-3 min-w-[140px]">
          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-start gap-1">
            <span className="text-[11px] font-semibold text-gray-500">
              Lunas
            </span>
            <span className="text-2xl font-extrabold text-gray-900">
              {lunasCount}
            </span>
          </div>

          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-start gap-1">
            <span className="text-[11px] font-semibold text-gray-500">
              Belum Lunas / DP
            </span>
            <span className="text-2xl font-extrabold text-gray-900">
              {belumLunasCount}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="h-9 border-gray-200 bg-white text-[13px] font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>

          <div className="w-full sm:w-auto overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm w-max">
              {months.map((month) => (
                <MonthTab
                  key={month}
                  label={month}
                  active={selectedMonth === month}
                  onClick={() => setSelectedMonth(month)}
                />
              ))}
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
          Data Reservasi
          <ChevronDown className="size-4 text-gray-400" />
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[1350px]">
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="font-bold text-gray-500 text-[12px] w-[50px] pl-5">
                  No.
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[240px]">
                  Nama Pelanggan
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[120px]">
                  Check In
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[120px]">
                  Check Out
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[180px]">
                  Tipe
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[140px]">
                  No Unit
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[150px]">
                  Harga
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[130px]">
                  Status
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[220px]">
                  Keterangan Status
                </TableHead>

                <TableHead className="w-[48px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {bookingData.map((row) => (
                <TableRow key={row.no} className="hover:bg-gray-50/50 group">
                  <TableCell className="text-[13px] text-gray-500 font-medium pl-5">
                    {row.no}.
                  </TableCell>

                  <TableCell className="text-[13px] font-medium text-gray-900 max-w-[240px] whitespace-normal break-words leading-relaxed">
                    {row.nama}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-500 min-w-[120px] whitespace-nowrap tabular-nums">
                    {row.checkIn}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-500 min-w-[120px] whitespace-nowrap tabular-nums">
                    {row.checkOut}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 max-w-[180px] whitespace-normal break-words leading-relaxed">
                    {row.tipe}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 max-w-[140px] whitespace-normal break-words leading-relaxed">
                    {row.noUnit}
                  </TableCell>

                  <TableCell className="text-[13px] font-semibold text-gray-900 min-w-[150px] whitespace-nowrap tabular-nums">
                    {row.harga}
                  </TableCell>

                  <TableCell className="min-w-[130px] whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-[12px] font-semibold",
                        row.status === "Lunas"
                          ? "text-emerald-600"
                          : "text-red-500"
                      )}
                    >
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          row.status === "Lunas"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        )}
                      />
                      {row.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 max-w-[220px] whitespace-normal break-words leading-relaxed">
                    {row.keterangan}
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
            <span className="whitespace-nowrap">Baris per Page</span>

            <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
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
              ].map((button, index) => (
                <button
                  key={index}
                  onClick={button.action}
                  disabled={button.disabled}
                  className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <button.icon className="size-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}