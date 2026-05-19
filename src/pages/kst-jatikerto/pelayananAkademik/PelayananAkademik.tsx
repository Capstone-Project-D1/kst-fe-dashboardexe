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

// ─── TYPES & DATA ────────────────────────────────────────────────────────────

interface MahasiswaRow {
  no: number;
  namaMahasiswa: string;
  dosenPembimbing: string;
  programStudi: string;
  mulai: string;
  selesai: string;
  luasan: string;
  judulPenelitian: string;
}

const tableData: MahasiswaRow[] = [
  {
    no: 1,
    namaMahasiswa: "Mahasiswa 1 dengan Nama yang Cukup Panjang",
    dosenPembimbing: "Dr. Dosen Pembimbing dengan Nama Panjang",
    programStudi: "Teknik Informatika",
    mulai: "Desember",
    selesai: "Januari",
    luasan: "150 m²",
    judulPenelitian: "Judul dari Sebuah Penelitian yang Cukup Panjang dan Perlu Turun Baris",
  },
  {
    no: 2,
    namaMahasiswa: "Mahasiswa 2",
    dosenPembimbing: "Dosen Pembimbing 2",
    programStudi: "Prodi 2",
    mulai: "Januari",
    selesai: "Februari",
    luasan: "200 m²",
    judulPenelitian: "Analisis Efektivitas Metode Baru",
  },
  {
    no: 3,
    namaMahasiswa: "Mahasiswa 3",
    dosenPembimbing: "Dosen Pembimbing 3",
    programStudi: "Prodi 3",
    mulai: "Februari",
    selesai: "Maret",
    luasan: "180 m²",
    judulPenelitian: "Studi Komparatif Teknologi AI",
  },
  {
    no: 4,
    namaMahasiswa: "Mahasiswa 4",
    dosenPembimbing: "Dosen Pembimbing 4",
    programStudi: "Prodi 4",
    mulai: "Maret",
    selesai: "April",
    luasan: "220 m²",
    judulPenelitian: "Pengembangan Aplikasi Mobile Interaktif",
  },
  {
    no: 5,
    namaMahasiswa: "Mahasiswa 5",
    dosenPembimbing: "Dosen Pembimbing 5",
    programStudi: "Prodi 5",
    mulai: "April",
    selesai: "Mei",
    luasan: "250 m²",
    judulPenelitian: "Optimalisasi Sistem Informasi Perusahaan",
  },
  {
    no: 6,
    namaMahasiswa: "Mahasiswa 6",
    dosenPembimbing: "Dosen Pembimbing 6",
    programStudi: "Prodi 6",
    mulai: "Mei",
    selesai: "Juni",
    luasan: "170 m²",
    judulPenelitian: "Pemodelan Data untuk Prediksi Cuaca",
  },
  {
    no: 7,
    namaMahasiswa: "Mahasiswa 7",
    dosenPembimbing: "Dosen Pembimbing 7",
    programStudi: "Prodi 7",
    mulai: "Juni",
    selesai: "Juli",
    luasan: "300 m²",
    judulPenelitian: "Rancang Bangun Robotika Otomatis",
  },
  {
    no: 8,
    namaMahasiswa: "Mahasiswa 3 namanya pinga sanggupkah memulai kembali",
    dosenPembimbing: "Dosen Pembimbing 8",
    programStudi: "Prodi 8",
    mulai: "Juli",
    selesai: "Agustus",
    luasan: "210 m²",
    judulPenelitian: "Kajian Dampak Sosial Media",
  },
  {
    no: 9,
    namaMahasiswa: "Mahasiswa 9",
    dosenPembimbing: "Dosen Pembimbing 9",
    programStudi: "Prodi 9",
    mulai: "Agustus",
    selesai: "September",
    luasan: "190 m²",
    judulPenelitian: "Analisis Keamanan Jaringan Komputer",
  },
  {
    no: 10,
    namaMahasiswa: "Mahasiswa 10",
    dosenPembimbing: "Dosen Pembimbing 10",
    programStudi: "Prodi 10",
    mulai: "September",
    selesai: "Oktober",
    luasan: "160 m²",
    judulPenelitian: "Pengembangan Model Pembelajaran Mesin",
  },
];

const months = ["Semua Bulan", "Januari", "Februari", "Maret", "April"];

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function PelayananAkademik() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("Semua Bulan");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");

  const totalPages = 7;

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 bg-gray-50/50 min-h-screen">
      {/* ── Filters ───────────────────────────────────────────────── */}
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

      {/* ── Data Table ────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[1450px]">
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="font-bold text-gray-500 text-[12px] w-[50px] pl-5">
                  No.
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[220px]">
                  Nama Mahasiswa
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[240px]">
                  Dosen Pembimbing
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[180px]">
                  Program Studi
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[120px]">
                  Mulai
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[120px]">
                  Selesai
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[120px]">
                  Luasan
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[300px]">
                  Judul Penelitian
                </TableHead>

                <TableHead className="w-[48px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.no} className="hover:bg-gray-50/50 group">
                  <TableCell className="text-[13px] text-gray-500 font-medium pl-5">
                    {row.no}.
                  </TableCell>

                  <TableCell className="text-[13px] font-medium text-gray-900 max-w-[220px] whitespace-normal break-words leading-relaxed">
                    {row.namaMahasiswa}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 max-w-[240px] whitespace-normal break-words leading-relaxed">
                    {row.dosenPembimbing}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 max-w-[180px] whitespace-normal break-words leading-relaxed">
                    {row.programStudi}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 min-w-[120px] whitespace-nowrap">
                    {row.mulai}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 min-w-[120px] whitespace-nowrap">
                    {row.selesai}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 min-w-[120px] whitespace-nowrap tabular-nums">
                    {row.luasan}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 max-w-[300px] whitespace-normal break-words leading-relaxed">
                    {row.judulPenelitian}
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