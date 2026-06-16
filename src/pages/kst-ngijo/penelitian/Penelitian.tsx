import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Activity,
  BarChart3,
  Shield,
  Users,
  Microscope,
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
import { useApiData, usePageData } from "@/api/hooks";
import { API_ENDPOINTS } from "@/api/endpoints";
import { colValue, fieldNumber, fieldValue, getContractColumnIndex, getContractColumnVariants, isRecord, ngijoNumber, textOrFallback } from "../adapters";

interface SummaryCardData {
  icon: React.ElementType;
  title: string;
  value: number | null;
  trend: number | null;
  trendLabel: string | null;
  description: string;
}

interface InovasiRow {
  id?: string;
  no: number;
  namaProyek: string;
  kepalaRiset: string;
  domain: string;
  trlLevel: number | null;
  trlLabel: string;
}

// Maps the upstream "agriculture/energy/technology/..." variant tokens to the
// display labels used in the dashboard. Falls back to a Title-Cased token when
// an unknown variant arrives so new categories still render as readable text.
const DOMAIN_LABELS: Record<string, string> = {
  technology: "Technology",
  agriculture: "Agritech",
  energy: "Energy",
  sustainability: "Sustainability",
  other: "Other",
};

function domainLabel(variant: string): string {
  const key = variant.toLowerCase().trim();
  if (DOMAIN_LABELS[key]) return DOMAIN_LABELS[key];
  return key ? key.charAt(0).toUpperCase() + key.slice(1) : "";
}

const TRL_STATUS: Record<number, string> = {
  1: "Basic Research",
  2: "Concept Formulation",
  3: "Proof of Concept",
  4: "Lab Validation",
  5: "Technology Validation",
  6: "Prototype Testing",
  7: "Demonstration Stage",
  8: "System Complete",
  9: "Market Ready",
};

function trlStatusLabel(level: number | null): string | null {
  if (level === null) return null;
  return TRL_STATUS[level] ?? null;
}

// Fill color for an achieved TRL box, based on which band the box sits in
// (1-3 red, 4-6 orange, 7-9 green). Unreached boxes render light gray.
function trlBoxColor(boxIndex: number): string {
  if (boxIndex <= 3) return "#E5484D";
  if (boxIndex <= 6) return "#F76808";
  return "#46A758";
}

function TrlIndicator({ level }: { level: number | null }) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: 9 }, (_, i) => {
        const boxNumber = i + 1;
        const reached = level !== null && boxNumber <= level;
        return (
          <span
            key={boxNumber}
            className="h-2.5 w-2.5 rounded-[3px]"
            style={{ backgroundColor: reached ? trlBoxColor(boxNumber) : "#E5E7EB" }}
          />
        );
      })}
    </div>
  );
}

const summaryCards: SummaryCardData[] = [
  {
    icon: Activity,
    title: "Total Penelitian & Inovasi Aktif",
    value: null,
    trend: null,
    trendLabel: null,
    description: "Jumlah penelitian & inovasi yang aktif pada bulan ini.",
  },
  {
    icon: BarChart3,
    title: "Rata-rata Skor TRL",
    value: null,
    trend: null,
    trendLabel: null,
    description: "Rata-rata Skor TRL pada penelitian & inovasi yang aktif.",
  },
  {
    icon: Shield,
    title: "Paten Tertunda",
    value: null,
    trend: null,
    trendLabel: null,
    description: "Jumlah paten tertunda yang dikirim API Ngijo.",
  },
  {
    icon: Users,
    title: "Kolaborasi",
    value: null,
    trend: null,
    trendLabel: null,
    description: "Total kolaborasi yang dikirim API Ngijo.",
  },
];

function SummaryCard({ data }: { data: SummaryCardData }) {
  const Icon = data.icon;
  const isPositive = (data.trend ?? 0) >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2.5">
        <Icon className="size-5 text-gray-500" />

        <span className="text-[12px] font-semibold text-gray-600 leading-tight">
          {data.title}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {data.value === null ? "Belum tersedia" : data.value.toLocaleString("id-ID")}
        </span>

        {data.trend === null ? null : (
          <div
            className={cn(
              "flex h-6 py-0.5 px-2 justify-center items-center gap-1 rounded-md border text-[11px] font-bold",
              isPositive
                ? "border-[#B2DDB5] bg-[#F5FBF5] text-[#46A758]"
                : "border-[#F8D7DA] bg-[#FFF5F5] text-[#E5484D]"
            )}
          >
            {isPositive ? (
              <TrendingUp className="size-4 text-[#46A758]" />
            ) : (
              <TrendingDown className="size-4 text-[#E5484D]" />
            )}
            {isPositive ? "+" : ""}
            {data.trend}%
          </div>
        )}
      </div>

      <div className="space-y-0.5">
        <p className="text-[13px] font-bold text-gray-800">
          {data.trendLabel ?? "Tren belum tersedia"}
        </p>
        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
          {data.description}
        </p>
      </div>
    </div>
  );
}

function resolveDomain(domainRaw: unknown, variants: Map<number, string>): string {
  if (domainRaw === undefined || domainRaw === null || domainRaw === "") return "";

  const variantIndex = fieldNumber({ value: domainRaw }, ["value"]);
  if (variantIndex !== null && variants.has(variantIndex)) {
    return domainLabel(variants.get(variantIndex)!);
  }
  // Fall back to the raw value (string label, or the bare number) rather than
  // hiding a value that the API actually sent.
  if (typeof domainRaw === "string") return domainLabel(domainRaw);
  return String(domainRaw);
}

function normalizeInovasiRows(rows: unknown[], contractPayload: unknown) {
  const nameIdx = getContractColumnIndex(contractPayload, ["nama proyek", "judul", "project", "proyek"]) ?? 0;
  const leadIdx = getContractColumnIndex(contractPayload, ["kepala riset", "peneliti utama", "peneliti", "researcher"]) ?? 1;
  const domainIdx = getContractColumnIndex(contractPayload, ["domain", "kategori", "field", "bidang", "category"]) ?? 2;
  const trlIdx = getContractColumnIndex(contractPayload, ["trl level", "trl", "trl status", "status trl"]) ?? 3;
  const domainVariants = getContractColumnVariants(contractPayload, ["domain", "kategori", "category"]);

  return rows.map((row, index): InovasiRow => {
    const record = isRecord(row) ? row : {};
    const trlRaw = fieldValue(record, ["trlLevel", "trl_level", "trl", "trlLevelValue", "trlStatus", "trl_status"]) ?? colValue(record, trlIdx);
    const trlLevel = fieldNumber({ value: trlRaw }, ["value"]);

    const domainRaw = fieldValue(record, ["domain", "category", "kategori", "bidang"]) ?? colValue(record, domainIdx);
    const domainText = resolveDomain(domainRaw, domainVariants);

    return {
      id: textOrFallback(record.id ?? record.rowId ?? record.row_id, ""),
      no: index + 1,
      namaProyek: textOrFallback(
        fieldValue(record, ["namaProyek", "nama_proyek", "projectName", "project_name", "judul", "name"]) ?? colValue(record, nameIdx),
      ),
      kepalaRiset: textOrFallback(
        fieldValue(record, ["kepalaRiset", "kepala_riset", "leadResearcher", "lead_researcher", "peneliti"]) ?? colValue(record, leadIdx),
      ),
      domain: domainText || "Belum tersedia",
      trlLevel,
      trlLabel: textOrFallback(
        trlStatusLabel(trlLevel) ?? fieldValue(record, ["trlLabel", "trl_label", "trlStatus", "trl_status", "status"]),
        trlLevel === null ? "Belum tersedia" : "Status belum tersedia",
      ),
    };
  });
}

export default function Penelitian() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const { data: activeProjectsPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.ngijo.activeProjects,
  );
  const { data: averageTrlPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.ngijo.averageTrl,
  );
  const { data: pendingPatentsPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.ngijo.pendingPatents,
  );
  const { data: collaborationPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.ngijo.collaboration,
  );
  const { data: contractPayload } = useApiData<unknown>(
    API_ENDPOINTS.kst.ngijo.contract,
  );
  const { items: backendRows, isLoading: isTableLoading, error: tableError } = usePageData<unknown>(
    API_ENDPOINTS.kst.ngijo.activeResearch,
    { offset: 0, limit: 50 },
  );
  const activeProjects = ngijoNumber(activeProjectsPayload);
  const averageTrl = ngijoNumber(averageTrlPayload);
  const pendingPatents = ngijoNumber(pendingPatentsPayload);
  const collaboration = ngijoNumber(collaborationPayload);
  const tableData = normalizeInovasiRows(backendRows, contractPayload);
  const liveSummaryCards = summaryCards.map((card, index) => {
    const values = [activeProjects, averageTrl, pendingPatents, collaboration];
    return {
      ...card,
      value: values[index] ?? null,
      trend: null,
    };
  });

  const rowsPerPageNumber = Number(rowsPerPage);
  const totalPages = Math.max(
    1,
    Math.ceil(tableData.length / rowsPerPageNumber)
  );

  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPageNumber,
    currentPage * rowsPerPageNumber
  );

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col gap-1 rounded-xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-emerald-700">
          <Microscope className="size-4" />
          KST Ngijo
        </div>
        <h1 className="text-xl font-extrabold text-gray-950">Penelitian</h1>
        <p className="text-sm font-medium text-gray-500">
          Ringkasan penelitian, inovasi, dan status TRL dari gateway Ngijo.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {liveSummaryCards.map((card) => (
          <SummaryCard key={card.title} data={card} />
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[960px]">
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="font-bold text-gray-500 text-[12px] w-[60px] pl-5">
                  No.
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[260px]">
                  Nama Proyek
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[220px]">
                  Kepala Riset
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[200px]">
                  Domain
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[260px]">
                  TRL Status
                </TableHead>

                <TableHead className="w-[48px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {isTableLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-sm font-medium text-gray-500">
                    Memuat data penelitian...
                  </TableCell>
                </TableRow>
              ) : tableError ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-sm font-medium text-red-500">
                    {tableError}
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-sm font-medium text-gray-500">
                    Data penelitian belum tersedia.
                  </TableCell>
                </TableRow>
              ) : paginatedData.map((row, index) => (
                <TableRow
                  key={row.id || `${row.namaProyek}-${index}`}
                  className="hover:bg-gray-50/50 group"
                >
                  <TableCell className="text-[13px] text-gray-500 font-medium pl-5">
                    {(currentPage - 1) * rowsPerPageNumber + index + 1}.
                  </TableCell>

                  <TableCell className="text-[13px] font-medium text-gray-900 max-w-[260px] whitespace-normal break-words leading-relaxed">
                    {row.namaProyek}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 max-w-[220px] whitespace-normal break-words leading-relaxed">
                    {row.kepalaRiset}
                  </TableCell>

                  <TableCell className="text-[13px] text-gray-600 max-w-[200px] whitespace-normal break-words leading-relaxed">
                    {row.domain}
                  </TableCell>

                  <TableCell className="min-w-[240px]">
                    {row.trlLevel === null ? (
                      <span className="text-[12px] font-semibold text-gray-400">TRL belum tersedia</span>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[13px] font-bold text-gray-900">TRL {row.trlLevel}</span>
                          <span className="text-[12px] font-medium text-gray-500">{row.trlLabel}</span>
                        </div>
                        <TrlIndicator level={row.trlLevel} />
                      </div>
                    )}
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
                <SelectItem value="50">50</SelectItem>
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
              ].map((button, index) => (
                <button
                  key={index}
                  onClick={button.action}
                  disabled={button.disabled}
                  className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <button.icon className="size-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
