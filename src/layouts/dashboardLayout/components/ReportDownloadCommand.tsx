import * as React from "react";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Leaf,
  Activity,
  ClipboardList,
  Book,
  Sprout,
  PawPrint,
  GraduationCap,
  Handshake,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface ReportDownloadCommandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type ReportFormat = "csv" | "xlsx" | "pdf";

interface ReportItem {
  title: string;
  kst: string;
  format: ReportFormat;
  icon: React.ElementType;
}

const reports: ReportItem[] = [
  {
    title: "Tracker Inovasi",
    kst: "KST Ngijo",
    format: "csv",
    icon: Activity,
  },
  {
    title: "Keberlanjutan",
    kst: "KST Ngijo",
    format: "csv",
    icon: Leaf,
  },
  {
    title: "Stok Opname",
    kst: "KST Cangar",
    format: "csv",
    icon: ClipboardList,
  },
  {
    title: "Booklist ATP",
    kst: "KST Cangar",
    format: "csv",
    icon: Book,
  },
  {
    title: "Pertanian",
    kst: "KST Jatikerto",
    format: "csv",
    icon: Sprout,
  },
  {
    title: "Peternakan",
    kst: "KST Jatikerto",
    format: "csv",
    icon: PawPrint,
  },
  {
    title: "Konservasi",
    kst: "KST Jatikerto",
    format: "csv",
    icon: Leaf,
  },
  {
    title: "Pelayanan Akademik",
    kst: "KST Jatikerto",
    format: "csv",
    icon: GraduationCap,
  },
  {
    title: "Kemitraan",
    kst: "KST Jatikerto",
    format: "csv",
    icon: Handshake,
  },
];

function downloadDummyCsv(report: ReportItem) {
  const fileName = `laporan-${report.title
    .toLowerCase()
    .replaceAll(" ", "-")}.csv`;

  const headers = ["No", "KST", "Laporan", "Format", "Keterangan"];

  const rows = [
    [
      "1",
      report.kst,
      report.title,
      report.format.toUpperCase(),
      "Data dummy dari frontend",
    ],
    [
      "2",
      report.kst,
      report.title,
      report.format.toUpperCase(),
      "Nanti disambungkan ke backend",
    ],
  ];

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

function ReportFormatIcon({ format }: { format: ReportFormat }) {
  if (format === "pdf") {
    return <FileText className="ml-auto size-4 text-red-500" />;
  }

  if (format === "xlsx") {
    return <FileSpreadsheet className="ml-auto size-4 text-emerald-600" />;
  }

  return <Download className="ml-auto size-4 text-gray-400" />;
}

export function ReportDownloadCommand({
  open,
  setOpen,
}: ReportDownloadCommandProps) {
  const runDownload = React.useCallback(
    (report: ReportItem) => {
      setOpen(false);
      downloadDummyCsv(report);
    },
    [setOpen]
  );

  const ngijoReports = reports.filter((report) => report.kst === "KST Ngijo");
  const cangarReports = reports.filter((report) => report.kst === "KST Cangar");
  const jatikertoReports = reports.filter(
    (report) => report.kst === "KST Jatikerto"
  );

  const renderReportItem = (report: ReportItem) => {
    const Icon = report.icon;

    return (
      <CommandItem
        key={`${report.kst}-${report.title}`}
        onSelect={() => runDownload(report)}
        className="flex items-center gap-3 py-3 cursor-pointer"
      >
        <Icon className="size-4 text-gray-700" />

        <div className="flex flex-col">
          <span className="text-[14px] font-medium text-gray-900">
            {report.title}
          </span>
          <span className="text-[11px] text-gray-400">
            {report.kst} • {report.format.toUpperCase()}
          </span>
        </div>

        <ReportFormatIcon format={report.format} />
      </CommandItem>
    );
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Cari laporan yang ingin diunduh..." />

      <CommandList>
        <CommandEmpty>Laporan tidak ditemukan.</CommandEmpty>

        <CommandGroup heading="KST Ngijo">
          {ngijoReports.map(renderReportItem)}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="KST Cangar">
          {cangarReports.map(renderReportItem)}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="KST Jatikerto">
          {jatikertoReports.map(renderReportItem)}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}