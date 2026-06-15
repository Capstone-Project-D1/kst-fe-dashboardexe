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
import { fieldAliases, getNumberValue, getTextValue, rowIdentity, type JatikertoApiRow } from "../rowMappers";
import { JatikertoTableLayout, rowMatchesSearch } from "../JatikertoTableLayout";

interface KomoditasRow extends JatikertoApiRow {
  id?: string;
  no?: number;
  nama: string;
  proyeksiPanen: number;
  satuan: string;
  luasUsaha: string;
  masaTanamBulan: number;
  masaTanamTahun: string;
  keterangan: string;
}

function getRowKey(row: KomoditasRow, index: number) {
  return rowIdentity(row) ?? `${row.nama}-${index}`;
}

function mapKomoditasRow(row: KomoditasRow): KomoditasRow {
  const luasUsaha = getNumberValue(row, 1, ["luasUsaha", "luas_usaha", "luas", "area"], Number.NaN);
  const masaTanamTahun = getNumberValue(row, 3, ["masaTanamTahun", "masa_tanam_tahun", "perTahun", "per_tahun"], Number.NaN);

  return {
    ...row,
    id: row.rowId ?? row.id,
    nama: getTextValue(row, 0, fieldAliases.nama, row.nama),
    luasUsaha: Number.isFinite(luasUsaha) ? `${luasUsaha.toLocaleString("id-ID")} m2` : row.luasUsaha,
    masaTanamBulan: getNumberValue(row, 2, ["masaTanamBulan", "masa_tanam_bulan", "bulan"], row.masaTanamBulan),
    masaTanamTahun: Number.isFinite(masaTanamTahun) ? `${masaTanamTahun} Kali` : row.masaTanamTahun,
    proyeksiPanen: getNumberValue(row, 4, ["proyeksiPanen", "proyeksi_panen", "panen", ...fieldAliases.jumlah], row.proyeksiPanen),
    satuan: getTextValue(row, 5, ["satuan", "unit"], row.satuan),
    keterangan: getTextValue(row, 6, ["keterangan", "description", "catatan"], row.keterangan ?? "-"),
  };
}

export default function Pertanian() {
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
  } = usePageData<KomoditasRow>(API_ENDPOINTS.kst.jatikerto.pertanianItems, {
    year: selectedYear,
    month: selectedMonth,
    limit: 50,
  });

  const displayData = tableData.map(mapKomoditasRow).filter((row) => rowMatchesSearch(row, searchQuery));
  const rowsPerPageNumber = Number(rowsPerPage);
  const totalPages = Math.max(
    1,
    Math.ceil(displayData.length / rowsPerPageNumber)
  );

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
      categoryName="Pertanian"
      subtitle="Proyeksi Panen Komoditas Pertanian"
      searchValue={searchQuery}
      onSearchChange={(value) => {
        setSearchQuery(value);
        setCurrentPage(1);
      }}
    >
      <>
        <div className="overflow-x-auto">
          <Table className="min-w-[1050px]">
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead
                  className="font-bold text-gray-500 text-[12px] w-[50px] text-center px-0"
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
                  className="font-bold text-gray-500 text-[12px] min-w-[130px] text-center px-0"
                  rowSpan={2}
                >
                  Proyeksi Panen
                </TableHead>

                <TableHead
                  className="font-bold text-gray-500 text-[12px] min-w-[90px] text-center px-0"
                  rowSpan={2}
                >
                  Satuan
                </TableHead>

                <TableHead
                  className="font-bold text-gray-500 text-[12px] min-w-[120px] text-center px-0"
                  rowSpan={2}
                >
                  Luas Usaha
                </TableHead>

                <TableHead
                  className="font-bold text-gray-500 text-[12px] text-center border-b-0 min-w-[220px] px-0"
                  colSpan={2}
                >
                  <div className="w-full text-center">Masa Tanam</div>

                  <div className="grid grid-cols-2 mt-1 w-full">
                    <span className="text-center text-[10px] font-semibold text-gray-400">
                      Satuan Bulan
                    </span>
                    <span className="text-center text-[10px] font-semibold text-gray-400">
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
                  <TableCell className="text-[13px] text-gray-500 font-medium text-center px-0">
                    {(currentPage - 1) * rowsPerPageNumber + index + 1}.
                  </TableCell>

                  <TableCell className="text-[13px] font-medium text-gray-900 max-w-[200px] whitespace-normal break-words leading-relaxed">
                    {row.nama}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 font-medium text-center whitespace-nowrap tabular-nums px-0">
                    {row.proyeksiPanen}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-500 text-center whitespace-nowrap px-0">
                    {row.satuan}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 text-center whitespace-nowrap tabular-nums px-0">
                    {row.luasUsaha}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 text-center whitespace-nowrap tabular-nums w-[110px] px-0">
                    {row.masaTanamBulan}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 text-center whitespace-nowrap w-[110px] px-0">
                    {row.masaTanamTahun}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 max-w-[220px] whitespace-normal break-words leading-relaxed">
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
