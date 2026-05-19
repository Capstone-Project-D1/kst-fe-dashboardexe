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

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface SummaryCardData {
  icon: React.ElementType;
  iconBg: string;
  title: string;
  value: string;
  trend: number; // positive = up, negative = down
  trendLabel: string;
  description: string;
}

interface InovasiRow {
  no: number;
  namaProyek: string;
  idProyek: string;
  kepalaRiset: string;
  domain: string;
  trlLevel: number;
  trlLabel: string;
}

// ─── DUMMY DATA ──────────────────────────────────────────────────────────────

const summaryCards: SummaryCardData[] = [
  {
    icon: Activity,
    iconBg: "bg-emerald-50 text-emerald-600",
    title: "Total Penelitian & Inovasi Aktif",
    value: "42",
    trend: 12.5,
    trendLabel: "Penigkatan 12.5% dari bulan lalu",
    description: "Jumlah penelitian & inovasi yang aktif pada bulan ini.",
  },
  {
    icon: BarChart3,
    iconBg: "bg-blue-50 text-blue-600",
    title: "Rata-rata Skor TRL",
    value: "5.4",
    trend: -20,
    trendLabel: "Penurunan 20% dari bulan lalu",
    description: "Rata-rata Skor TRL pada penelitian & inovasi yang aktif.",
  },
  {
    icon: Shield,
    iconBg: "bg-amber-50 text-amber-600",
    title: "Paten Tertunda",
    value: "8",
    trend: 12.5,
    trendLabel: "Penigkatan 12.5% dari bulan lalu",
    description:
      "Paten yang tertunda pada bulan ini meningkat sebesar 12.5%.",
  },
  {
    icon: Users,
    iconBg: "bg-rose-50 text-rose-600",
    title: "Kolaborasi",
    value: "156",
    trend: 12.5,
    trendLabel: "Penigkatan 12.5% dari bulan lalu",
    description:
      "Kolaborasi pada bulan ini meningkat sebesar 12.5%.",
  },
];

const months = [
  "Semua Bulan",
  "Januari",
  "Februari",
  "Maret",
  "April",
];

const tableData: InovasiRow[] = [
  { no: 1, namaProyek: "Biomass Circular Recovery", idProyek: "KST-2024-001", kepalaRiset: "Dr. Aris Sudarsono", domain: "Waste Management", trlLevel: 7, trlLabel: "Demonstration Stage" },
  { no: 2, namaProyek: "Solar-Powered Water Purification", idProyek: "KST-2024-002", kepalaRiset: "Eng. Maya Santoso", domain: "Clean Water Technology", trlLevel: 5, trlLabel: "Prototype Development" },
  { no: 3, namaProyek: "AI-Driven Crop Monitoring", idProyek: "KST-2024-003", kepalaRiset: "Dr. Raden Wijaya", domain: "Agricultural Tech", trlLevel: 6, trlLabel: "Pilot Testing" },
  { no: 4, namaProyek: "Bio-Plastic from Algae", idProyek: "KST-2024-004", kepalaRiset: "Prof. Siti Nurhaliza", domain: "Sustainable Materials", trlLevel: 4, trlLabel: "Lab Validation" },
  { no: 5, namaProyek: "Smart Grid Energy Storage", idProyek: "KST-2024-005", kepalaRiset: "Dr. Budi Hartono", domain: "Renewable Energy", trlLevel: 7, trlLabel: "Demonstration Stage" },
  { no: 6, namaProyek: "Waste-to-Energy Conversion", idProyek: "KST-2024-006", kepalaRiset: "Ir. Dewi Lestari", domain: "Circular Economy", trlLevel: 6, trlLabel: "Pilot Testing" },
  { no: 7, namaProyek: "Urban Vertical Farming System", idProyek: "KST-2024-007", kepalaRiset: "Dr. Agus Pratama", domain: "Food Tech", trlLevel: 5, trlLabel: "Prototype Development" },
  { no: 8, namaProyek: "Electric Vehicle Fast Charging", idProyek: "KST-2024-008", kepalaRiset: "Eng. Nina Kartika", domain: "Transportation", trlLevel: 7, trlLabel: "Demonstration Stage" },
  { no: 9, namaProyek: "Nano-Coating for Solar Panels", idProyek: "KST-2024-009", kepalaRiset: "Prof. Hendro Santoso", domain: "Energy Efficiency", trlLevel: 5, trlLabel: "Lab Validation" },
  { no: 10, namaProyek: "Smart Waste Sorting Robot", idProyek: "KST-2024-010", kepalaRiset: "Dr. Rina Wulandari", domain: "Automation", trlLevel: 6, trlLabel: "Pilot Testing" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getTrlColor(level: number): string {
  if (level >= 7) return "text-emerald-600";
  if (level === 6) return "text-amber-600";
  if (level === 5) return "text-orange-500";
  if (level === 4) return "text-yellow-600";
  return "text-gray-500";
}

// ─── SUB COMPONENTS ──────────────────────────────────────────────────────────

function SummaryCard({ data }: { data: SummaryCardData }) {
  const Icon = data.icon;
  const isPositive = data.trend >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header: Icon + Title */}
      <div className="flex items-center gap-2.5">
        <div className={cn("p-1.5 rounded-lg", data.iconBg)}>
          <Icon className="size-4" />
        </div>
        <span className="text-[12px] font-semibold text-gray-600 leading-tight">
          {data.title}
        </span>
      </div>

      {/* Value + Trend */}
      <div className="flex items-center justify-between">
        <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {data.value}
        </span>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold",
            isPositive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500"
          )}
        >
          {isPositive ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {isPositive ? "+" : ""}
          {data.trend}%
        </div>
      </div>

      {/* Description */}
      <div className="space-y-0.5">
        <p className="text-[13px] font-bold text-gray-800">
          {data.trendLabel}
        </p>
        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
          {data.description}
        </p>
      </div>
    </div>
  );
}

function MonthTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-150 whitespace-nowrap",
        active
          ? "bg-gray-900 text-white shadow-sm"
          : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
      )}
    >
      {label}
    </button>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function TrackerInovasi() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("Semua Bulan");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const totalPages = 7;

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 bg-gray-50/50 min-h-screen">
      {/* ── SECTION 1: Summary Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} data={card} />
        ))}
      </div>

      {/* ── SECTION 2: Filters ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        {/* Year Selector */}
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

        {/* Month Tabs — horizontally scrollable on small screens */}
        <div className="w-full sm:w-auto overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm w-max">
            {months.map((month) => (
              <MonthTab
                key={month}
                label={month}
                active={selectedMonth === month}
                onClick={() => setSelectedMonth(month)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: Data Table ─────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="font-bold text-gray-500 text-[12px] w-[60px] pl-5">
                  No.
                </TableHead>
                <TableHead className="font-bold text-gray-500 text-[12px]">
                  Nama Projek
                </TableHead>
                <TableHead className="font-bold text-gray-500 text-[12px]">
                  ID Projek
                </TableHead>
                <TableHead className="font-bold text-gray-500 text-[12px]">
                  Kepala Riset
                </TableHead>
                <TableHead className="font-bold text-gray-500 text-[12px]">
                  Domain
                </TableHead>
                <TableHead className="font-bold text-gray-500 text-[12px]">
                  TRL Status
                </TableHead>
                <TableHead className="w-[48px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow
                  key={row.idProyek}
                  className="hover:bg-gray-50/50 group"
                >
                  <TableCell className="text-[13px] text-gray-500 font-medium pl-5">
                    {row.no}.
                  </TableCell>
                  <TableCell className="text-[13px] font-medium text-gray-900">
                    {row.namaProyek}
                  </TableCell>
                  <TableCell className="text-[13px] text-gray-500 font-medium">
                    {row.idProyek}
                  </TableCell>
                  <TableCell className="text-[13px] text-gray-600">
                    {row.kepalaRiset}
                  </TableCell>
                  <TableCell className="text-[13px] text-gray-600">
                    {row.domain}
                  </TableCell>
                  <TableCell>
                    <span className="text-[13px] font-medium">
                      <span className={cn("font-bold", getTrlColor(row.trlLevel))}>
                        TRL {row.trlLevel}
                      </span>
                      <span className="text-gray-500">
                        {" "}- {row.trlLabel}
                      </span>
                    </span>
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

        {/* ── Pagination Footer ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-gray-100">
          {/* Rows Per Page */}
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
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Page Info + Nav */}
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-gray-500 font-medium whitespace-nowrap">
              Page {currentPage} dari {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft className="size-4" />
              </button>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}