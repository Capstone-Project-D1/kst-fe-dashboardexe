import { useState } from "react";
import {
  LayoutGrid,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { usePageData } from "@/api/hooks";

type DisplayType = "jumlah-stok" | "barang-masuk" | "barang-keluar";

interface StockRow {
  id: number | string;
  name: string;
  satuan: string;
  stockAwal: number;
  retur: number;
  keteranganRetur: string;
  stockAkhir: number;
  stockFisik: number;
  selisih: number;
  keteranganSelisih: string;
  barangMasuk: number[];
  barangKeluar: number[];
  totalMasuk: number;
  totalKeluar: number;
  total: number;
}

export const dummyData: StockRow[] = [
  {
    id: 1,
    name: "Kentang Granola",
    satuan: "Kg",
    stockAwal: 500,
    retur: 10,
    keteranganRetur: "Kualitas tidak sesuai",
    stockAkhir: 650,
    stockFisik: 635,
    selisih: -5,
    keteranganSelisih: "Selisih perhitungan",
    barangMasuk: [50, 60, 70, 50, 60, 30, 30],
    barangKeluar: [50, 60, 70, 50, 60, 30, 30],
    totalMasuk: 500,
    totalKeluar: 200,
    total: 500,
  },
  {
    id: 2,
    name: "Singkong",
    satuan: "Kg",
    stockAwal: 450,
    retur: 5,
    keteranganRetur: "Kemasan rusak",
    stockAkhir: 560,
    stockFisik: 550,
    selisih: -10,
    keteranganSelisih: "Selisih gudang",
    barangMasuk: [45, 55, 65, 40, 50, 25, 35],
    barangKeluar: [30, 45, 40, 35, 50, 20, 25],
    totalMasuk: 450,
    totalKeluar: 245,
    total: 450,
  },
  {
    id: 3,
    name: "Stroberi",
    satuan: "Kg",
    stockAwal: 600,
    retur: 12,
    keteranganRetur: "Sebagian busuk",
    stockAkhir: 720,
    stockFisik: 710,
    selisih: -10,
    keteranganSelisih: "Selisih timbang",
    barangMasuk: [60, 70, 80, 55, 65, 35, 40],
    barangKeluar: [40, 50, 60, 45, 55, 30, 35],
    totalMasuk: 600,
    totalKeluar: 315,
    total: 600,
  },
  {
    id: 4,
    name: "Apel Batu",
    satuan: "Kg",
    stockAwal: 550,
    retur: 8,
    keteranganRetur: "Retur supplier",
    stockAkhir: 680,
    stockFisik: 675,
    selisih: -5,
    keteranganSelisih: "Selisih kecil",
    barangMasuk: [53, 63, 73, 48, 58, 28, 33],
    barangKeluar: [35, 45, 55, 40, 50, 25, 30],
    totalMasuk: 550,
    totalKeluar: 280,
    total: 550,
  },
  {
    id: 5,
    name: "Kopi",
    satuan: "Kg",
    stockAwal: 470,
    retur: 4,
    keteranganRetur: "Kemasan bocor",
    stockAkhir: 590,
    stockFisik: 585,
    selisih: -5,
    keteranganSelisih: "Selisih input",
    barangMasuk: [47, 57, 67, 43, 53, 27, 32],
    barangKeluar: [30, 40, 45, 35, 42, 22, 28],
    totalMasuk: 470,
    totalKeluar: 242,
    total: 470,
  },
  {
    id: 6,
    name: "Jeruk",
    satuan: "Kg",
    stockAwal: 530,
    retur: 6,
    keteranganRetur: "Kualitas turun",
    stockAkhir: 640,
    stockFisik: 638,
    selisih: -2,
    keteranganSelisih: "Selisih minor",
    barangMasuk: [52, 62, 72, 49, 59, 29, 34],
    barangKeluar: [35, 42, 50, 39, 47, 25, 30],
    totalMasuk: 530,
    totalKeluar: 268,
    total: 530,
  },
  {
    id: 7,
    name: "Tomat",
    satuan: "Kg",
    stockAwal: 490,
    retur: 7,
    keteranganRetur: "Barang rusak",
    stockAkhir: 600,
    stockFisik: 592,
    selisih: -8,
    keteranganSelisih: "Selisih opname",
    barangMasuk: [48, 58, 68, 44, 54, 26, 31],
    barangKeluar: [33, 43, 53, 37, 47, 21, 29],
    totalMasuk: 490,
    totalKeluar: 263,
    total: 490,
  },
  {
    id: 8,
    name: "Mentimun",
    satuan: "Kg",
    stockAwal: 520,
    retur: 3,
    keteranganRetur: "Tidak sesuai standar",
    stockAkhir: 630,
    stockFisik: 625,
    selisih: -5,
    keteranganSelisih: "Selisih perhitungan",
    barangMasuk: [50, 60, 70, 47, 57, 28, 33],
    barangKeluar: [35, 45, 52, 40, 46, 24, 30],
    totalMasuk: 520,
    totalKeluar: 272,
    total: 520,
  },
  {
    id: 9,
    name: "Tomat Cherry Premium Super Panjang",
    satuan: "Kg",
    stockAwal: 580,
    retur: 9,
    keteranganRetur: "Retur karena kualitas tidak sesuai standar pengiriman",
    stockAkhir: 700,
    stockFisik: 690,
    selisih: -10,
    keteranganSelisih: "Selisih antara catatan sistem dan stok fisik gudang",
    barangMasuk: [58, 68, 78, 53, 63, 32, 37],
    barangKeluar: [45, 55, 62, 48, 52, 28, 33],
    totalMasuk: 580,
    totalKeluar: 323,
    total: 580,
  },
  {
    id: 10,
    name: "Alpukat",
    satuan: "Kg",
    stockAwal: 610,
    retur: 2,
    keteranganRetur: "Baik",
    stockAkhir: 750,
    stockFisik: 750,
    selisih: 0,
    keteranganSelisih: "Sesuai",
    barangMasuk: [61, 71, 81, 56, 66, 34, 39],
    barangKeluar: [50, 60, 70, 48, 58, 30, 35],
    totalMasuk: 610,
    totalKeluar: 351,
    total: 610,
  },
];

const months = ["Semua Bulan", "Januari", "Februari", "Maret", "April"];
const days = ["S", "S", "R", "K", "J", "S", "M"];

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

export default function DataTable() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("Semua Bulan");
  const [displayType, setDisplayType] = useState<DisplayType>("barang-masuk");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const { items: stockRows } = usePageData<StockRow>("/kst/cangar/stok-opname", {
    year: selectedYear,
    month: selectedMonth,
    limit: 50,
  });
  const dummyData = stockRows;

  const isJumlahStok = displayType === "jumlah-stok";
  const isBarangMasuk = displayType === "barang-masuk";

  const activityLabel = isBarangMasuk ? "Barang Masuk" : "Barang Keluar";
  const totalLabel = isBarangMasuk ? "Total Masuk" : "Total Keluar";

  const rowsPerPageNumber = Number(rowsPerPage);
  const totalPages = Math.max(
    1,
    Math.ceil(dummyData.length / rowsPerPageNumber)
  );

  const paginatedData = dummyData.slice(
    (currentPage - 1) * rowsPerPageNumber,
    currentPage * rowsPerPageNumber
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px] h-10 border-gray-200 rounded-lg bg-white">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
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

        <Select
          value={displayType}
          onValueChange={(value) => {
            setDisplayType(value as DisplayType);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[190px] h-10 border-gray-200 rounded-lg bg-white">
            <div className="flex items-center gap-2">
              <LayoutGrid className="size-4" />
              <SelectValue placeholder="Data yang Ditampilkan" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="jumlah-stok">Jumlah Stok</SelectItem>
            <SelectItem value="barang-masuk">Barang Masuk</SelectItem>
            <SelectItem value="barang-keluar">Barang Keluar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {isJumlahStok ? (
            <Table className="min-w-[1250px]">
              <TableHeader className="bg-[#F9FAFB]">
                <TableRow className="hover:bg-transparent border-gray-200">
                  <TableHead className="w-[60px] font-bold text-gray-700 text-center">
                    No.
                  </TableHead>

                  <TableHead className="font-bold text-gray-700 min-w-[220px]">
                    Nama Barang
                  </TableHead>

                  <TableHead className="font-bold text-gray-700 min-w-[90px] text-center">
                    Satuan
                  </TableHead>

                  <TableHead className="font-bold text-gray-700 min-w-[110px] text-center">
                    Stok Awal
                  </TableHead>

                  <TableHead className="font-bold text-gray-700 min-w-[90px] text-center">
                    Retur
                  </TableHead>

                  <TableHead className="font-bold text-gray-700 min-w-[220px] text-center">
                    Keterangan Retur
                  </TableHead>

                  <TableHead className="font-bold text-gray-700 min-w-[110px] text-center">
                    Stok Akhir
                  </TableHead>

                  <TableHead className="font-bold text-gray-700 min-w-[110px] text-center">
                    Stok Fisik
                  </TableHead>

                  <TableHead className="font-bold text-gray-700 min-w-[90px] text-center">
                    Selisih
                  </TableHead>

                  <TableHead className="font-bold text-gray-700 min-w-[220px] text-center">
                    Keterangan Selisih
                  </TableHead>

                  <TableHead className="font-bold text-gray-700 min-w-[110px] text-center">
                    Total
                  </TableHead>

                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className="border-gray-100 hover:bg-gray-50/50 group"
                  >
                    <TableCell className="font-medium text-gray-600 text-center">
                      {(currentPage - 1) * rowsPerPageNumber + index + 1}.
                    </TableCell>

                    <TableCell className="font-semibold text-gray-900 max-w-[220px] whitespace-normal break-words leading-relaxed">
                      {item.name}
                    </TableCell>

                    <TableCell className="text-gray-500 text-center whitespace-nowrap">
                      {item.satuan}
                    </TableCell>

                    <TableCell className="text-center font-medium text-gray-500 whitespace-nowrap tabular-nums">
                      {item.stockAwal}
                    </TableCell>

                    <TableCell
                      className={cn(
                        "text-center font-medium whitespace-nowrap tabular-nums",
                        item.retur > 0 ? "text-red-500" : "text-gray-500"
                      )}
                    >
                      {item.retur}
                    </TableCell>

                    <TableCell className="text-gray-500 text-center max-w-[220px] whitespace-normal break-words leading-relaxed">
                      {item.keteranganRetur}
                    </TableCell>

                    <TableCell className="text-center text-gray-500 whitespace-nowrap tabular-nums">
                      {item.stockAkhir}
                    </TableCell>

                    <TableCell className="text-center text-gray-500 whitespace-nowrap tabular-nums">
                      {item.stockFisik}
                    </TableCell>

                    <TableCell
                      className={cn(
                        "text-center font-medium whitespace-nowrap tabular-nums",
                        item.selisih < 0
                          ? "text-red-500"
                          : item.selisih > 0
                          ? "text-emerald-600"
                          : "text-gray-500"
                      )}
                    >
                      {item.selisih > 0 ? `+${item.selisih}` : item.selisih}
                    </TableCell>

                    <TableCell className="text-gray-500 text-center max-w-[220px] whitespace-normal break-words leading-relaxed">
                      {item.keteranganSelisih}
                    </TableCell>

                    <TableCell className="text-center font-bold text-gray-900 whitespace-nowrap tabular-nums">
                      {item.total}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table className="min-w-[1100px]">
              <TableHeader className="bg-[#F9FAFB]">
                <TableRow className="hover:bg-transparent border-gray-200">
                  <TableHead className="w-[60px] font-bold text-gray-700 text-center">
                    No.
                  </TableHead>

                  <TableHead className="font-bold text-gray-700 min-w-[220px]">
                    Nama Barang
                  </TableHead>

                  <TableHead className="text-center font-bold text-gray-700 min-w-[120px]">
                    Stok Awal
                  </TableHead>

                  <TableHead
                    className="text-center p-0 min-w-[420px]"
                    colSpan={7}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-700 py-2">
                        {activityLabel}
                      </span>

                      <div className="grid grid-cols-7 border-t border-gray-100">
                        {days.map((day, index) => (
                          <span
                            key={index}
                            className="py-2 text-[10px] font-bold text-gray-400"
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TableHead>

                  <TableHead className="text-center font-bold text-gray-700 min-w-[130px]">
                    {totalLabel}
                  </TableHead>

                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedData.map((item, index) => {
                  const dailyValues = isBarangMasuk
                    ? item.barangMasuk
                    : item.barangKeluar;

                  const totalValue = isBarangMasuk
                    ? item.totalMasuk
                    : item.totalKeluar;

                  return (
                    <TableRow
                      key={item.id}
                      className="border-gray-100 hover:bg-gray-50/50 group"
                    >
                      <TableCell className="font-medium text-gray-600 text-center">
                        {(currentPage - 1) * rowsPerPageNumber + index + 1}.
                      </TableCell>

                      <TableCell className="font-semibold text-gray-900 max-w-[220px] whitespace-normal break-words leading-relaxed">
                        {item.name}
                      </TableCell>

                      <TableCell className="text-center font-medium text-gray-500 whitespace-nowrap tabular-nums">
                        {item.stockAwal}
                      </TableCell>

                      {dailyValues.map((value, index) => (
                        <TableCell
                          key={index}
                          className="text-center text-xs font-medium text-gray-500 p-2 border-l border-gray-50 first:border-l-0 whitespace-nowrap tabular-nums"
                        >
                          {value}
                        </TableCell>
                      ))}

                      <TableCell
                        className={cn(
                          "text-center font-bold whitespace-nowrap tabular-nums",
                          isBarangMasuk ? "text-[#27A376]" : "text-red-500"
                        )}
                      >
                        {totalValue}
                      </TableCell>

                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 bg-[#F9FAFB]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Baris per Page
            </span>

            <Select
              value={rowsPerPage}
              onValueChange={(value) => {
                setRowsPerPage(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[70px] h-9 border-gray-200">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-600">
              Page {currentPage} dari {totalPages}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="size-8 rounded-md border-gray-200 disabled:opacity-30"
              >
                <ChevronsLeft className="size-4 text-gray-400" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className="size-8 rounded-md border-gray-200 disabled:opacity-30"
              >
                <ChevronLeft className="size-4 text-gray-400" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                className="size-8 rounded-md border-gray-200 disabled:opacity-30"
              >
                <ChevronRight className="size-4 text-gray-400" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="size-8 rounded-md border-gray-200 disabled:opacity-30"
              >
                <ChevronsRight className="size-4 text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
