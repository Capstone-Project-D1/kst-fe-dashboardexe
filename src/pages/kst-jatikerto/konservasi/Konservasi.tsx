import { useState } from "react";
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
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
import { usePageData } from "@/api/hooks";
import { API_ENDPOINTS } from "@/api/endpoints";
import { getJatikertoDataMessage } from "../dataState";
import { fieldAliases, getNumberValue, getTextValue, rowIdentity, type JatikertoApiRow } from "../rowMappers";

interface KonservasiRow extends JatikertoApiRow {
  id?: string;
  no?: number;
  namaKomoditas: string;
  foto: string;
  jumlah: number;
  satuan: string;
  keterangan: string;
}

type KonservasiCategory = "konservasi-hewan" | "konservasi-tumbuhan";

const months = ["Semua Bulan", "Januari", "Februari", "Maret", "April"];

function getRowKey(row: KonservasiRow, category: KonservasiCategory, index: number) {
  return rowIdentity(row) ?? `${category}-${row.namaKomoditas}-${index}`;
}

function mapKonservasiRow(row: KonservasiRow, category: KonservasiCategory): KonservasiRow {
  if (category === "konservasi-hewan") {
    return {
      ...row,
      id: row.rowId ?? row.id,
      namaKomoditas: getTextValue(row, 0, fieldAliases.nama, row.namaKomoditas),
      foto: getTextValue(row, 1, ["foto", "image", "gambar", "photo", "url"], row.foto ?? ""),
      jumlah: getNumberValue(row, 2, fieldAliases.jumlah, row.jumlah),
      satuan: getTextValue(row, 3, ["satuan", "unit"], row.satuan),
      keterangan: getTextValue(row, 4, ["keterangan", "description", "catatan"], row.keterangan ?? "-"),
    };
  }

  return {
    ...row,
    id: row.rowId ?? row.id,
    namaKomoditas: getTextValue(row, 0, fieldAliases.nama, row.namaKomoditas),
    foto: getTextValue(row, 1, ["foto", "image", "gambar", "photo", "url"], row.foto ?? ""),
    jumlah: getNumberValue(row, 4, fieldAliases.jumlah, row.jumlah),
    satuan: getTextValue(row, 5, ["satuan", "unit"], row.satuan),
    keterangan: getTextValue(row, 6, ["keterangan", "description", "catatan"], row.keterangan ?? "-"),
  };
}

export default function Konservasi() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("Semua Bulan");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("5");
  const [selectedCategory, setSelectedCategory] =
    useState<KonservasiCategory>("konservasi-hewan");
  const konservasiEndpoint =
    selectedCategory === "konservasi-hewan"
      ? API_ENDPOINTS.kst.jatikerto.konservasiHewan
      : API_ENDPOINTS.kst.jatikerto.konservasiTanaman;
  const {
    items: activeData,
    isLoading,
    error,
    errorStatus,
  } = usePageData<KonservasiRow>(konservasiEndpoint, {
    year: selectedYear,
    month: selectedMonth,
    limit: 50,
  });

  const rowsPerPageNumber = Number(rowsPerPage);

  const totalPages = Math.max(
    1,
    Math.ceil(activeData.length / rowsPerPageNumber)
  );

  const paginatedData = activeData.slice(
    (currentPage - 1) * rowsPerPageNumber,
    currentPage * rowsPerPageNumber
  ).map((row) => mapKonservasiRow(row, selectedCategory));
  const tableMessage = getJatikertoDataMessage({
    isLoading,
    error,
    errorStatus,
    hasItems: activeData.length > 0,
  });

  const handleChangeCategory = (value: KonservasiCategory) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
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

        <Select
          value={selectedCategory}
          onValueChange={(value) =>
            handleChangeCategory(value as KonservasiCategory)
          }
        >
          <SelectTrigger className="h-9 w-[220px] border-gray-200 bg-white text-[13px] font-medium">
            <div className="flex items-center gap-2">
              <LayoutGrid className="size-4 text-gray-700" />
              <SelectValue />
            </div>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="konservasi-hewan">
              Konservasi Hewan
            </SelectItem>

            <SelectItem value="konservasi-tumbuhan">
              Konservasi Tumbuhan
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="font-bold text-gray-500 text-[12px] w-[50px] pl-5">
                  No.
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[240px]">
                  Nama Komoditas
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] text-center min-w-[180px]">
                  Foto
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] text-center min-w-[100px]">
                  Jumlah
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] text-center min-w-[120px]">
                  Satuan
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[260px]">
                  Keterangan
                </TableHead>

                <TableHead className="w-[48px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {tableMessage ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-[13px] text-gray-400 font-medium"
                  >
                    {tableMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                <TableRow
                  key={getRowKey(row, selectedCategory, index)}
                  className="hover:bg-gray-50/50 group"
                >
                  <TableCell className="text-[13px] text-gray-500 font-medium pl-5">
                    {(currentPage - 1) * rowsPerPageNumber + index + 1}.
                  </TableCell>

                  <TableCell className="text-[13px] font-medium text-gray-900 max-w-[240px] whitespace-normal break-words leading-relaxed">
                    {row.namaKomoditas}
                  </TableCell>

                  <TableCell className="min-w-[180px]">
                    <div className="flex justify-center">
                      {row.foto ? (
                        <img
                          src={row.foto}
                          alt={row.namaKomoditas}
                          className="h-[70px] w-[150px] rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-[70px] w-[150px] items-center justify-center rounded-xl bg-gray-100 text-xs font-medium text-gray-400">
                          Belum tersedia
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 font-medium text-center min-w-[100px] whitespace-nowrap tabular-nums">
                    {row.jumlah}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-500 text-center min-w-[120px] whitespace-nowrap">
                    {row.satuan}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 max-w-[260px] whitespace-normal break-words leading-relaxed">
                    {row.keterangan}
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
