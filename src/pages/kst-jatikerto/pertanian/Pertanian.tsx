import { useState } from "react";
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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

interface KomoditasRow {
  no: number;
  nama: string;
  proyeksiPanen: number;
  satuan: string;
  luasUsaha: string;
  masaTanamBulan: number;
  masaTanamTahun: string;
  keterangan: string;
}

const tableData: KomoditasRow[] = [
  {
    no: 1,
    nama: "Melon – Golden Aroma yang dipetik khusus",
    proyeksiPanen: 1500,
    satuan: "Kg",
    luasUsaha: "500 m²",
    masaTanamBulan: 3,
    masaTanamTahun: "4 Kali",
    keterangan: "Keterangan",
  },
  {
    no: 2,
    nama: "Apple – Fuji",
    proyeksiPanen: 1200,
    satuan: "Kg",
    luasUsaha: "600 m²",
    masaTanamBulan: 5,
    masaTanamTahun: "3 Kali",
    keterangan: "Segar dan renyah",
  },
  {
    no: 3,
    nama: "Banana – Cavendish",
    proyeksiPanen: 1800,
    satuan: "Kg",
    luasUsaha: "700 m²",
    masaTanamBulan: 4,
    masaTanamTahun: "5 Kali",
    keterangan: "Manis dan lembut",
  },
  {
    no: 4,
    nama: "Orange – Valencia",
    proyeksiPanen: 1400,
    satuan: "Kg",
    luasUsaha: "550 m²",
    masaTanamBulan: 3,
    masaTanamTahun: "4 Kali",
    keterangan: "Asam segar",
  },
  {
    no: 5,
    nama: "Grapes – Red Globe",
    proyeksiPanen: 1000,
    satuan: "Kg",
    luasUsaha: "450 m²",
    masaTanamBulan: 6,
    masaTanamTahun: "3 Kali",
    keterangan: "Manis berair",
  },
  {
    no: 6,
    nama: "Papaya – Sunrise",
    proyeksiPanen: 1300,
    satuan: "Kg",
    luasUsaha: "480 m²",
    masaTanamBulan: 4,
    masaTanamTahun: "4 Kali",
    keterangan: "Warna cerah",
  },
  {
    no: 7,
    nama: "Pineapple – Queen",
    proyeksiPanen: 1600,
    satuan: "Kg",
    luasUsaha: "650 m²",
    masaTanamBulan: 5,
    masaTanamTahun: "5 Kali",
    keterangan: "Aroma tajam",
  },
  {
    no: 8,
    nama: "Strawberry – Albion",
    proyeksiPanen: 900,
    satuan: "Kg",
    luasUsaha: "300 m²",
    masaTanamBulan: 7,
    masaTanamTahun: "6 Kali",
    keterangan: "Manis pekat",
  },
  {
    no: 9,
    nama: "Watermelon – Crimson Sweet",
    proyeksiPanen: 2000,
    satuan: "Kg",
    luasUsaha: "800 m²",
    masaTanamBulan: 3,
    masaTanamTahun: "4 Kali",
    keterangan: "Daging merah segar",
  },
  {
    no: 10,
    nama: "Mango – Alphonso",
    proyeksiPanen: 1100,
    satuan: "Kg",
    luasUsaha: "520 m²",
    masaTanamBulan: 4,
    masaTanamTahun: "3 Kali",
    keterangan: "Manis harum",
  },
];

const months = ["Semua Bulan", "Januari", "Februari", "Maret", "April"];

export default function Pertanian() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("Semua Bulan");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");

  const totalPages = 7;

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
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
              <button
                key={month}
                onClick={() => setSelectedMonth(month)}
                className={cn(
                  "px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-150 whitespace-nowrap",
                  selectedMonth === month
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                )}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[1050px]">
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead
                  className="font-bold text-gray-500 text-[12px] w-[50px] pl-5"
                  rowSpan={2}
                >
                  No.
                </TableHead>

                <TableHead
                  className="font-bold text-gray-500 text-[12px] min-w-[200px]"
                  rowSpan={2}
                >
                  Nama Komoditas
                </TableHead>

                <TableHead
                  className="font-bold text-gray-500 text-[12px] min-w-[130px]"
                  rowSpan={2}
                >
                  Proyeksi Panen
                </TableHead>

                <TableHead
                  className="font-bold text-gray-500 text-[12px] min-w-[90px]"
                  rowSpan={2}
                >
                  Satuan
                </TableHead>

                <TableHead
                  className="font-bold text-gray-500 text-[12px] min-w-[120px]"
                  rowSpan={2}
                >
                  Luas Usaha
                </TableHead>

                <TableHead
                  className="font-bold text-gray-500 text-[12px] text-center border-b-0 min-w-[220px]"
                  colSpan={2}
                >
                  <div>Masa Tanam</div>
                  <div className="flex mt-1">
                    <span className="flex-1 text-[10px] font-semibold text-gray-400">
                      Satuan Bulan
                    </span>
                    <span className="flex-1 text-[10px] font-semibold text-gray-400">
                      Per-Tahun
                    </span>
                  </div>
                </TableHead>

                <TableHead
                  className="font-bold text-gray-500 text-[12px] min-w-[220px]"
                  rowSpan={2}
                >
                  Keterangan
                </TableHead>

                <TableHead className="w-[48px]" rowSpan={2} />
              </TableRow>
            </TableHeader>

            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.no} className="hover:bg-gray-50/50 group">
                  <TableCell className="text-[13px] text-gray-500 font-medium pl-5">
                    {row.no}.
                  </TableCell>

                  <TableCell className="text-[13px] font-medium text-gray-900 max-w-[200px] whitespace-normal break-words leading-relaxed">
                    {row.nama}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 font-medium whitespace-nowrap tabular-nums">
                    {row.proyeksiPanen}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-500 whitespace-nowrap">
                    {row.satuan}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 whitespace-nowrap tabular-nums">
                    {row.luasUsaha}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 text-center whitespace-nowrap tabular-nums">
                    {row.masaTanamBulan}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 text-center whitespace-nowrap">
                    {row.masaTanamTahun}
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
              ].map((btn, i) => (
                <button
                  key={i}
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