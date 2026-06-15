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
import { Badge } from "@/components/ui/badge";
import { usePageData } from "@/api/hooks";
import { API_ENDPOINTS } from "@/api/endpoints";
import { getJatikertoDataMessage } from "../dataState";
import { fieldAliases, getDateValue, getNumberValue, getTextValue, rowIdentity, type JatikertoApiRow } from "../rowMappers";

interface MahasiswaRow extends JatikertoApiRow {
  id?: string;
  no?: number;
  namaMahasiswa: string;
  dosenPembimbing: string;
  programStudi:
    | "Teknik Informatika"
    | "Sistem Informasi"
    | "Teknik Komputer"
    | "Pendidikan Teknologi Informasi"
    | "Teknologi Informasi";
  mulai: string;
  selesai: string;
  luasan: string;
  judulPenelitian: string;
}

const programStudiStyles = {
  "Teknik Informatika": "bg-sky-400 border-sky-500 text-white",
  "Teknik Komputer": "bg-amber-400 border-amber-500 text-white",
  "Teknologi Informasi": "bg-emerald-400 border-emerald-500 text-white",
  "Sistem Informasi": "bg-orange-400 border-orange-500 text-white",
  "Pendidikan Teknologi Informasi": "bg-rose-400 border-rose-500 text-white",
};

const months = ["Semua Bulan", "Januari", "Februari", "Maret", "April"];

function getRowKey(row: MahasiswaRow, index: number) {
  return rowIdentity(row) ?? `${row.namaMahasiswa}-${row.judulPenelitian}-${index}`;
}

function mapMahasiswaRow(row: MahasiswaRow): MahasiswaRow {
  const luasan = getNumberValue(row, 5, ["luasan", "luas", "area"], Number.NaN);

  return {
    ...row,
    id: row.rowId ?? row.id,
    namaMahasiswa: getTextValue(row, 0, ["namaMahasiswa", "nama_mahasiswa", "mahasiswa", ...fieldAliases.nama], row.namaMahasiswa),
    dosenPembimbing: getTextValue(row, 1, ["dosenPembimbing", "dosen_pembimbing", "dosen", "pembimbing"], row.dosenPembimbing),
    programStudi: getTextValue(row, 2, ["programStudi", "program_studi", "prodi"], row.programStudi) as MahasiswaRow["programStudi"],
    mulai: getDateValue(row, 3, ["mulai", "tanggalMulai", "tanggal_mulai", "startDate", "start_date"], row.mulai),
    selesai: getDateValue(row, 4, ["selesai", "tanggalSelesai", "tanggal_selesai", "endDate", "end_date"], row.selesai),
    luasan: Number.isFinite(luasan) ? `${luasan.toLocaleString("id-ID")} m2` : row.luasan,
    judulPenelitian: getTextValue(row, 6, ["judulPenelitian", "judul_penelitian", "penelitian", ...fieldAliases.nama], row.judulPenelitian),
  };
}

export default function PelayananAkademik() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("Semua Bulan");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const {
    items: tableData,
    isLoading,
    error,
    errorStatus,
  } = usePageData<MahasiswaRow>(
    API_ENDPOINTS.kst.jatikerto.akademikItems,
    { year: selectedYear, month: selectedMonth, limit: 50 },
  );

  const rowsPerPageNumber = Number(rowsPerPage);
  const totalPages = Math.max(1, Math.ceil(tableData.length / rowsPerPageNumber));

  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPageNumber,
    currentPage * rowsPerPageNumber
  ).map(mapMahasiswaRow);
  const tableMessage = getJatikertoDataMessage({
    isLoading,
    error,
    errorStatus,
    hasItems: tableData.length > 0,
  });


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
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100",
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
              {tableMessage ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-32 text-center text-[13px] text-gray-400 font-medium"
                  >
                    {tableMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                <TableRow key={getRowKey(row, index)} className="hover:bg-gray-50/50 group">
                  <TableCell className="text-[13px] text-gray-500 font-medium pl-5">
                    {(currentPage - 1) * rowsPerPageNumber + index + 1}.
                  </TableCell>

                  <TableCell className="text-[13px] font-medium text-gray-900 max-w-[220px] whitespace-normal break-words leading-relaxed">
                    {row.namaMahasiswa}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 max-w-[240px] whitespace-normal break-words leading-relaxed">
                    {row.dosenPembimbing}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 whitespace-normal break-words leading-relaxed">
                    {programStudiStyles[row.programStudi] ? (
                      <Badge
                        className={`${programStudiStyles[row.programStudi]} border`}
                      >
                        {row.programStudi}
                      </Badge>
                    ) : null}
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
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
                  action: () => setCurrentPage(Math.max(1, currentPage - 1)),
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
