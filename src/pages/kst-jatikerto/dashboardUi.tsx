import type { ComponentType, ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateOnly, parseCalendarDate } from "@/lib/date";

type IconComponent = ComponentType<{ className?: string }>;

export type SummaryCardItem = {
  label: string;
  value: ReactNode;
  icon: IconComponent;
  hint?: string;
};

export function JatikertoHero({
  title,
  description,
  badges,
}: {
  title: string;
  description: string;
  badges: string[];
  lastUpdated?: string;
  updateLabel?: string;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
      <div className="relative px-5 py-6 md:px-7">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-emerald-50 to-transparent md:block" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                KST Jatikerto
              </Badge>
              {badges.map((badge) => (
                <Badge
                  key={badge}
                  className="border-lime-200 bg-lime-50 text-lime-700"
                >
                  {badge}
                </Badge>
              ))}
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function JatikertoSummaryCards({ items }: { items: SummaryCardItem[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-500">
                {item.label}
              </p>
              <p className="mt-2 break-words text-2xl font-bold leading-tight text-gray-950">
                {item.value ?? "-"}
              </p>
              {item.hint ? (
                <p className="mt-1 text-xs font-medium text-gray-500">
                  {item.hint}
                </p>
              ) : null}
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-2 text-emerald-700">
              <item.icon className="size-5" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export function JatikertoTableSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <div className="space-y-3 px-5 py-5">
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <div
              key={columnIndex}
              className="h-4 animate-pulse rounded-full bg-gray-100"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function JatikertoPagination({
  currentPage,
  totalPages,
  rowsPerPage,
  onRowsPerPageChange,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  rowsPerPage: string;
  onRowsPerPageChange: (value: string) => void;
  onPageChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 sm:flex-row sm:px-5">
      <div className="flex items-center gap-2 text-[13px] font-medium text-gray-500">
        <span className="whitespace-nowrap">Baris per halaman</span>
        <Select value={rowsPerPage} onValueChange={onRowsPerPageChange}>
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
        <span className="whitespace-nowrap text-[13px] font-medium text-gray-500">
          Halaman {currentPage} dari {totalPages}
        </span>
        <div className="flex items-center gap-1">
          {[
            { icon: ChevronsLeft, action: () => onPageChange(1), disabled: currentPage === 1 },
            { icon: ChevronLeft, action: () => onPageChange(Math.max(1, currentPage - 1)), disabled: currentPage === 1 },
            { icon: ChevronRight, action: () => onPageChange(Math.min(totalPages, currentPage + 1)), disabled: currentPage === totalPages },
            { icon: ChevronsRight, action: () => onPageChange(totalPages), disabled: currentPage === totalPages },
          ].map((btn, index) => (
            <button
              key={index}
              onClick={btn.action}
              disabled={btn.disabled}
              className="rounded-md border border-gray-200 p-1.5 text-gray-400 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <btn.icon className="size-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function formatNumber(value: number | string | undefined | null) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number.toLocaleString("id-ID") : "-";
}

export function getNumericValue(value: number | string | undefined | null) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const normalized = String(value).replace(/[^\d,.-]/g, "").replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

export function formatArea(value: number | string | undefined | null) {
  const number = getNumericValue(value);
  return number ? `${formatNumber(number)} m²` : "-";
}

export function formatQuantity(
  value: number | string | undefined | null,
  unit?: string,
) {
  const formatted = formatNumber(value);
  return formatted === "-" ? "-" : [formatted, unit].filter(Boolean).join(" ");
}

export function getFrequencyValue(value: number | string | undefined | null) {
  return getNumericValue(value);
}

export function formatFrequency(value: number | string | undefined | null) {
  const number = getFrequencyValue(value);
  return number ? `${formatNumber(number)} Kali/Tahun` : "-";
}

export function parseDate(value?: unknown) {
  return parseCalendarDate(value);
}

export function formatIndonesianDate(value?: unknown) {
  return formatDateOnly(value);
}

export function getLastUpdated<T extends Record<string, unknown>>(rows: T[]) {
  const latest = rows
    .map((row) =>
      parseDate(
        String(
          row.updatedAt ??
            row.updated_at ??
            row.modifiedAt ??
            row.modified_at ??
            row.createdAt ??
            row.created_at ??
            "",
        ),
      ),
    )
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return latest ? formatIndonesianDate(latest) : undefined;
}

export function matchesFields(fields: Array<unknown>, searchQuery: string) {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  if (!normalizedQuery) return true;

  return fields.some((value) =>
    String(value ?? "").toLowerCase().includes(normalizedQuery),
  );
}

export function statusBadgeClass(status: string) {
  if (status === "Aktif") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "Akan Berakhir" || status === "Akan Dimulai") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-gray-200 bg-gray-100 text-gray-600";
}

export const tableHeaderClass = "border-emerald-100 bg-emerald-50/80 hover:bg-emerald-50/80";
export const tableHeadClass = "font-bold text-emerald-900 text-[12px]";
export const tableRowClass = "group border-gray-100 transition-colors hover:bg-emerald-50/40";
export const badgeSoftGreenClass = "h-auto rounded-full border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700";
export const mutedBadgeClass = "h-auto rounded-full border-gray-200 bg-gray-50 px-2.5 py-1 text-gray-600";
