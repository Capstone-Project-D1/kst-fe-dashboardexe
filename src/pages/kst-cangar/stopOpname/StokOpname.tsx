import { useMemo } from "react";
import { ClipboardList, Package, RotateCcw, TrendingDown, TrendingUp } from "lucide-react";
import { useApiData, parsePageContainer } from "@/api/hooks";
import { API_ENDPOINTS } from "@/api/endpoints";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "tervalidasi") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (normalized === "ditolak") return "border-red-200 bg-red-50 text-red-700";
  if (normalized === "draft") return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-gray-200 bg-gray-50 text-gray-700";
}

export default function StokOpname() {
  const {
    data: stokPayload,
    isLoading: isStokLoading,
    error: stokError,
  } = useApiData<unknown>(API_ENDPOINTS.kst.cangar.stock, { limit: 100 });
  const {
    data: itemsPayload,
    isLoading: isItemsLoading,
    error: itemsError,
  } = useApiData<unknown>(
    API_ENDPOINTS.kst.cangar.stockItems,
    { limit: 100 },
  );
  const { data: summaryPayload, error: summaryError } = useApiData<unknown>(
    API_ENDPOINTS.kst.cangar.summary,
  );

  const isLoading = isStokLoading || isItemsLoading;


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


    return [];
  }, [stokPayload, itemsPayload]);

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
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-gray-900">Stok Opname</h1>
        <p className="text-sm font-medium text-gray-500">KST Cangar</p>
      </div>

      {hasError ? (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Sebagian data stok Cangar belum bisa dimuat. Nilai kosong memakai fallback.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-lg border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">Total Barang</CardTitle>
            <Package className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{summary.totalBarang}</div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">Total Masuk</CardTitle>
            <TrendingUp className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {signedValue(summary.totalMasuk, "+")}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">Total Keluar</CardTitle>
            <TrendingDown className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">
              {signedValue(summary.totalKeluar, "-")}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-600">Total Retur</CardTitle>
            <RotateCcw className="size-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{summary.totalRetur}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="Data Barang" className="gap-4">
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-10 w-max bg-white shadow-sm">
            {STOK_TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="px-4 text-[13px]">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
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
                    rows.map((row, idx) => (
                      <TableRow key={`${row.id}-${idx}`} className="hover:bg-gray-50/60">
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
                          <div className="flex flex-col items-start gap-1">
                            <Badge variant="outline" className={`rounded-md ${statusBadgeClass(row.statusOpname)}`}>
                              <ClipboardList className="size-3" />
                              {row.statusOpname}
                            </Badge>
                            {row.periode ? (
                              <span className="text-xs font-medium text-gray-500">{row.periode}</span>
                            ) : null}
                          </div>
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
            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Total Masuk Hari Ini</CardTitle>
                <TrendingUp className="size-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700">
                  {signedValue(summary.totalMasuk, "+")}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Total Keluar Hari Ini</CardTitle>
                <TrendingDown className="size-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">
                  {signedValue(summary.totalKeluar, "-")}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Total Retur Hari Ini</CardTitle>
                <RotateCcw className="size-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {summary.totalRetur.toLocaleString("id-ID")}
                </div>
              </CardContent>
            </Card>
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
                    masterRows.map((row, idx) => (
                      <TableRow key={`${row.id}-${idx}`} className="hover:bg-gray-50/60">
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
            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Total Masuk Mingguan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700">{signedValue(summary.totalMasuk, "+")}</div>
              </CardContent>
            </Card>
            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Total Keluar Mingguan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">{signedValue(summary.totalKeluar, "-")}</div>
              </CardContent>
            </Card>
            <Card className="rounded-lg border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-600">Total Retur Mingguan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{summary.totalRetur.toLocaleString("id-ID")}</div>
              </CardContent>
            </Card>
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
                    rows.map((row, idx) => (
                      <TableRow key={`${row.id}-${idx}`} className="hover:bg-gray-50/60">
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
