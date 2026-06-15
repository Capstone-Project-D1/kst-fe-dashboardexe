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
import { usePageData } from "@/api/hooks";
import { API_ENDPOINTS } from "@/api/endpoints";
import { getJatikertoDataMessage } from "../dataState";
import { fieldAliases, getDateValue, getTextValue, rowIdentity, type JatikertoApiRow } from "../rowMappers";
import { JatikertoTableLayout, rowMatchesSearch } from "../JatikertoTableLayout";

interface MitraRow extends JatikertoApiRow {
  id?: string;
  no?: number;
  mitra: string;
  bidangKerjasama: string;
  jangkaWaktuKontrak: string;
  keterangan: string;
}

function getRowKey(row: MitraRow, index: number) {
  return rowIdentity(row) ?? `${row.mitra}-${row.jangkaWaktuKontrak}-${index}`;
}

function mapMitraRow(row: MitraRow): MitraRow {
  const mulai = getDateValue(row, 2, ["mulai", "tanggalMulai", "tanggal_mulai", "startDate", "start_date"]);
  const selesai = getDateValue(row, 3, ["selesai", "tanggalSelesai", "tanggal_selesai", "endDate", "end_date"]);

  return {
    ...row,
    id: row.rowId ?? row.id,
    mitra: getTextValue(row, 0, ["mitra", "partner", ...fieldAliases.nama], row.mitra),
    bidangKerjasama: getTextValue(row, 1, ["bidangKerjasama", "bidang_kerjasama", "kerjasama", ...fieldAliases.status], row.bidangKerjasama),
    jangkaWaktuKontrak:
      getTextValue(row, -1, ["jangkaWaktuKontrak", "jangka_waktu_kontrak", "kontrak"], "") ||
      [mulai, selesai].filter(Boolean).join(" - ") ||
      row.jangkaWaktuKontrak,
    keterangan: getTextValue(row, 4, ["keterangan", "description", "catatan"], row.keterangan ?? "-"),
  };
}

export default function Kemitraan() {
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
  } = usePageData<MitraRow>(API_ENDPOINTS.kst.jatikerto.kemitraanItems, {
    year: selectedYear,
    month: selectedMonth,
    limit: 50,
  });

  const displayData = tableData.map(mapMitraRow).filter((row) => rowMatchesSearch(row, searchQuery));
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
      categoryName="Kemitraan"
      subtitle="Kegiatan Kerjasama KST Jatikerto dengan Berbagai Mitra"
      searchValue={searchQuery}
      onSearchChange={(value) => {
        setSearchQuery(value);
        setCurrentPage(1);
      }}
    >
      <>
        <div className="overflow-x-auto">
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="font-bold text-gray-500 text-[12px] w-[50px] pl-5">
                  No.
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[260px]">
                  Mitra
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[220px]">
                  Bidang Kerjasama
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[260px]">
                  Jangka Waktu Kontrak
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[180px]">
                  Keterangan
                </TableHead>

              </TableRow>
            </TableHeader>

            <TableBody>
              {tableMessage ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
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

                  <TableCell className="text-[13px] font-medium text-gray-900 max-w-[260px] whitespace-normal break-words leading-relaxed">
                    {row.mitra}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 max-w-[220px] whitespace-normal break-words leading-relaxed">
                    {row.bidangKerjasama}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 min-w-[260px] whitespace-nowrap">
                    {row.jangkaWaktuKontrak}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 max-w-[180px] whitespace-normal break-words leading-relaxed">
                    {row.keterangan}
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
                  action: () =>
                    setCurrentPage(Math.max(1, currentPage - 1)),
                  disabled: currentPage === 1,
                },
                {
                  icon: ChevronRight,
                  action: () =>
                    setCurrentPage(
                      Math.min(totalPages, currentPage + 1)
                    ),
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
