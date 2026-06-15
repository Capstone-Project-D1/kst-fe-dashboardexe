import { useState } from "react";
import {
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
import { Badge } from "@/components/ui/badge";
import { usePageData } from "@/api/hooks";
import { API_ENDPOINTS } from "@/api/endpoints";
import { getJatikertoDataMessage } from "../dataState";
import { fieldAliases, getDateValue, getNumberValue, getTextValue, rowIdentity, type JatikertoApiRow } from "../rowMappers";
import { JatikertoTableLayout, rowMatchesSearch } from "../JatikertoTableLayout";

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
  const [selectedYear] = useState("2026");
  const [selectedMonth] = useState("Semua Bulan");
  const [searchQuery, setSearchQuery] = useState("");
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

  const displayData = tableData.map(mapMahasiswaRow).filter((row) => rowMatchesSearch(row, searchQuery));
  const rowsPerPageNumber = Number(rowsPerPage);
  const totalPages = Math.max(1, Math.ceil(displayData.length / rowsPerPageNumber));

  const paginatedData = displayData.slice(
    (currentPage - 1) * rowsPerPageNumber,
    currentPage * rowsPerPageNumber
  );
  const tableMessage = getJatikertoDataMessage({
    isLoading,
    error,
    errorStatus,
    hasItems: displayData.length > 0,
  });


  return (
    <JatikertoTableLayout
      categoryName="Pelayanan Akademik"
      subtitle="Kegiatan Riset Mahasiswa Universitas Brawijaya di KST Jatikerto"
      searchValue={searchQuery}
      onSearchChange={(value) => {
        setSearchQuery(value);
        setCurrentPage(1);
      }}
    >
      <>
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

              </TableRow>
            </TableHeader>

            <TableBody>
              {tableMessage ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
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
      </>
    </JatikertoTableLayout>
  );
}
