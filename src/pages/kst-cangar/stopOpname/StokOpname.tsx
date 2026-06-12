import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ClipboardList, Package, RotateCcw, TrendingDown, TrendingUp } from "lucide-react";
import { useApiData, parsePageContainer } from "@/api/hooks";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { adaptStockRows, adaptStockSummary, type StockItemRow } from "../adapters";

const STOK_TABS = [
  "Data Barang",
  "Stok Harian",
  "Master Barang",
  "Laporan Mingguan",
];

function signedValue(value: number, prefix: "+" | "-") {
  return `${prefix}${Math.abs(value).toLocaleString("id-ID")}`;
}

export default function StokOpname() {
  const [activeTab, setActiveTab] = useState("Data Barang");
  const {
    data: stokPayload,
    isLoading: isStokLoading,
    error: stokError,
  } = useApiData<unknown>("/api/kst/cangar/data/stok", { limit: 100 });
  const {
    data: itemsPayload,
    isLoading: isItemsLoading,
    error: itemsError,
  } = useApiData<unknown>(
    "/api/kst/cangar/data/stok/items",
    { limit: 100 },
  );
  const { data: summaryPayload, error: summaryError } = useApiData<unknown>(
    "/api/kst/cangar/data/summary",
  );

  const isLoading = isStokLoading || isItemsLoading;

  // Debug: log raw payloads so the user can inspect DevTools → Console
  useMemo(() => {
    if (!isStokLoading && stokPayload !== null) {
      console.log("[StokOpname] Raw stokPayload:", JSON.parse(JSON.stringify(stokPayload)));
    }
    if (!isItemsLoading && itemsPayload !== null) {
      console.log("[StokOpname] Raw itemsPayload:", JSON.parse(JSON.stringify(itemsPayload)));
    }
  }, [stokPayload, itemsPayload, isStokLoading, isItemsLoading]);

  const rows = useMemo(() => {
    // --- Strategy 1: parse stokPayload through adapter ---
    const stokRows = adaptStockRows(stokPayload);

    // --- Strategy 2: parse stokPayload as PageContainer (standard pagination format) ---
    let pageRows: StockItemRow[] = [];
    if (stokRows.length === 0 && stokPayload !== null) {
      const page = parsePageContainer<unknown>(
        stokPayload as { data?: { offset: number; limit: number; hasNext: boolean; items: unknown[] } },
      );
      if (page?.items && page.items.length > 0) {
        pageRows = adaptStockRows(page.items);
        if (pageRows.length > 0) {
          console.log("[StokOpname] stokPayload parsed via PageContainer:", pageRows.length, "rows");
        }
      }
    }

    // --- Strategy 3: parse itemsPayload (master items endpoint) ---
    const itemRows = adaptStockRows(itemsPayload);

    // Pick the best stok source
    const primaryRows = stokRows.length > 0 ? stokRows : pageRows;

    if (primaryRows.length > 0 && itemRows.length > 0) {
      // Merge: primary has movement data, items may have extra items not in primary
      const byName = new Map(primaryRows.map((row) => [row.namaBarang.toLowerCase(), row]));
      for (const item of itemRows) {
        if (!byName.has(item.namaBarang.toLowerCase())) {
          byName.set(item.namaBarang.toLowerCase(), item);
        }
      }
      return Array.from(byName.values());
    }

    if (primaryRows.length > 0) return primaryRows;
    if (itemRows.length > 0) return itemRows;

    if (!isLoading) {
      console.warn(
        "[StokOpname] Data Barang kosong — stokPayload:",
        stokPayload,
        "| itemsPayload:",
        itemsPayload,
      );
    }

    return [];
  }, [stokPayload, itemsPayload, isLoading, isStokLoading, isItemsLoading]);

  const masterRows = useMemo(() => {
    const itemRows = adaptStockRows(itemsPayload);
    return itemRows.length > 0 ? itemRows : rows;
  }, [itemsPayload, rows]);

  const summary = useMemo(() => {
    const stockSummary = adaptStockSummary(summaryPayload, rows);
    return {
      ...stockSummary,
      totalBarang: stockSummary.totalBarang || masterRows.length,
    };
  }, [summaryPayload, rows, masterRows.length]);
  const hasError = Boolean(stokError || itemsError || summaryError);

  return (
    <div className="flex min-h-screen flex-col gap-5 bg-gray-50/50 p-4 md:p-6">
      {hasError ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Sebagian data stok Cangar belum bisa dimuat. Nilai kosong memakai fallback.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2.5">
            <Package className="size-5 text-gray-500" />
            <span className="text-[12px] font-semibold text-gray-600 leading-tight">Total Barang</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{summary.totalBarang}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="size-5 text-gray-500" />
            <span className="text-[12px] font-semibold text-gray-600 leading-tight">Total Masuk</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">
              {signedValue(summary.totalMasuk, "+")}
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2.5">
            <TrendingDown className="size-5 text-gray-500" />
            <span className="text-[12px] font-semibold text-gray-600 leading-tight">Total Keluar</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-red-700 tracking-tight">
              {signedValue(summary.totalKeluar, "-")}
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="size-5 text-gray-500" />
            <span className="text-[12px] font-semibold text-gray-600 leading-tight">Total Retur</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{summary.totalRetur}</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
        <div className="w-full sm:w-auto overflow-x-auto scrollbar-none pb-1">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm w-max">
            {STOK_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-150 whitespace-nowrap",
                  activeTab === tab
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <TabsContent value="Data Barang">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[1180px]">
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="min-w-[220px] font-bold text-gray-600">Nama Barang</TableHead>
                    <TableHead className="min-w-[90px] font-bold text-gray-600">Satuan</TableHead>
                    <TableHead className="min-w-[120px] text-right font-bold text-gray-600">Total Masuk</TableHead>
                    <TableHead className="min-w-[120px] text-right font-bold text-gray-600">Total Keluar</TableHead>
                    <TableHead className="min-w-[110px] text-right font-bold text-gray-600">Total Retur</TableHead>
                    <TableHead className="min-w-[130px] font-bold text-gray-600">Stok Sistem</TableHead>
                    <TableHead className="min-w-[160px] font-bold text-gray-600">Stok Fisik Terakhir</TableHead>
                    <TableHead className="min-w-[140px] font-bold text-gray-600">Selisih Terakhir</TableHead>
                    <TableHead className="min-w-[170px] font-bold text-gray-600">Status Opname</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-28 text-center text-sm font-medium text-gray-500">
                        {isLoading ? "Memuat data barang Cangar..." : "Belum ada data barang Cangar."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50/60">
                        <TableCell className="font-semibold text-gray-900">{row.namaBarang}</TableCell>
                        <TableCell className="text-gray-600">{row.satuan}</TableCell>
                        <TableCell className="text-right font-semibold text-emerald-700 tabular-nums">
                          {signedValue(row.totalMasuk, "+")}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-red-700 tabular-nums">
                          {signedValue(row.totalKeluar, "-")}
                        </TableCell>
                        <TableCell className="text-right text-gray-700 tabular-nums">{row.totalRetur}</TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {row.stokSistem.toLocaleString("id-ID")} {row.satuan}
                        </TableCell>
                        <TableCell className="text-gray-600">{row.stokFisikTerakhir}</TableCell>
                        <TableCell className="text-gray-600">{row.selisihTerakhir}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-md border-gray-200 bg-gray-50 text-gray-700">
                            <ClipboardList className="size-3" />
                            {row.statusOpname}
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

        <TabsContent value="Stok Harian">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">Total Masuk Hari Ini</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">
                  {signedValue(summary.totalMasuk, "+")}
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <TrendingDown className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">Total Keluar Hari Ini</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-red-700 tracking-tight">
                  {signedValue(summary.totalKeluar, "-")}
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <RotateCcw className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">Total Retur Hari Ini</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {summary.totalRetur.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Master Barang">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="min-w-[100px] font-bold text-gray-600">ID</TableHead>
                    <TableHead className="min-w-[260px] font-bold text-gray-600">Nama Barang</TableHead>
                    <TableHead className="min-w-[120px] font-bold text-gray-600">Satuan</TableHead>
                    <TableHead className="min-w-[160px] font-bold text-gray-600">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masterRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-28 text-center text-sm font-medium text-gray-500">
                        {isLoading ? "Memuat master barang Cangar..." : "Belum ada master barang Cangar."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    masterRows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50/60">
                        <TableCell className="font-semibold text-gray-900">#{row.id}</TableCell>
                        <TableCell className="font-medium text-gray-900">{row.namaBarang}</TableCell>
                        <TableCell className="text-gray-600">{row.satuan}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-md border-emerald-200 bg-emerald-50 text-emerald-700">
                            Aktif
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

        <TabsContent value="Laporan Mingguan">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">Total Masuk Mingguan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-emerald-700 tracking-tight">
                  {signedValue(summary.totalMasuk, "+")}
                </span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <TrendingDown className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">Total Keluar Mingguan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-red-700 tracking-tight">
                  {signedValue(summary.totalKeluar, "-")}
                </span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2.5">
                <RotateCcw className="size-5 text-gray-500" />
                <span className="text-[12px] font-semibold text-gray-600 leading-tight">Total Retur Mingguan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {summary.totalRetur.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <Table className="min-w-[860px]">
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="min-w-[220px] font-bold text-gray-600">Nama Barang</TableHead>
                    <TableHead className="min-w-[110px] font-bold text-gray-600">Satuan</TableHead>
                    <TableHead className="min-w-[130px] text-right font-bold text-gray-600">Masuk</TableHead>
                    <TableHead className="min-w-[130px] text-right font-bold text-gray-600">Keluar</TableHead>
                    <TableHead className="min-w-[130px] text-right font-bold text-gray-600">Retur</TableHead>
                    <TableHead className="min-w-[140px] font-bold text-gray-600">Stok Sistem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-28 text-center text-sm font-medium text-gray-500">
                        {isLoading ? "Memuat laporan mingguan Cangar..." : "Belum ada laporan mingguan Cangar."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50/60">
                        <TableCell className="font-semibold text-gray-900">{row.namaBarang}</TableCell>
                        <TableCell className="text-gray-600">{row.satuan}</TableCell>
                        <TableCell className="text-right font-semibold text-emerald-700 tabular-nums">
                          {signedValue(row.totalMasuk, "+")}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-red-700 tabular-nums">
                          {signedValue(row.totalKeluar, "-")}
                        </TableCell>
                        <TableCell className="text-right text-gray-700 tabular-nums">{row.totalRetur}</TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {row.stokSistem.toLocaleString("id-ID")} {row.satuan}
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