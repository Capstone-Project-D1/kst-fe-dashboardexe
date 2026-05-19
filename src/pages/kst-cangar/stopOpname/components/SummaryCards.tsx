import {
  Package,
  TrendingUp,
  TrendingDown,
  PackagePlus,
  PackageX,
  PackageSearch,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string;
  trend: string;
  trendType: "up" | "down";
  description: string;
  subDescription: string;
  iconType?: "package" | "package-plus" | "package-x" | "package-search";
}

const SummaryCard = ({
  title,
  value,
  trend,
  trendType,
  description,
  subDescription,
  iconType,
}: SummaryCardProps) => {
  const isUp = trendType === "up";

  return (
    <Card className="shadow-sm border-gray-100 rounded-xl">
      <CardHeader className="flex flex-row items-center gap-3 pb-2 space-y-0">
        {iconType === "package" ? (
          <Package className="size-5 text-gray-500" />
        ) : iconType === "package-plus" ? (
          <PackagePlus className="size-5 text-gray-500" />
        ) : iconType === "package-x" ? (
          <PackageX className="size-5 text-gray-500" />
        ) : iconType === "package-search" ? (
          <PackageSearch className="size-5 text-gray-500" />
        ) : null}
        <CardTitle className="text-sm font-semibold text-[#737373]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2.5 mb-2">
          <p className="text-2xl font-bold text-black">{value}</p>
          <div
            className={`flex h-6 py-0.5 px-2 justify-center items-center gap-1 rounded-md border ${
              isUp
                ? "border-[#B2DDB5] bg-[#F5FBF5]"
                : "border-[#F8D7DA] bg-[#FFF5F5]"
            }`}
          >
            {isUp ? (
              <TrendingUp className="size-4 text-[#46A758]" />
            ) : (
              <TrendingDown className="size-4 text-[#E5484D]" />
            )}
            <p
              className={`text-xs font-bold ${isUp ? "text-[#46A758]" : "text-[#E5484D]"}`}
            >
              {trend}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[14px] font-bold text-[#1F2937]">{description}</p>
          <p className="text-[12px] text-[#9CA3AF] font-normal leading-tight">
            {subDescription}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function SummaryCards() {
  const data: SummaryCardProps[] = [
    {
      iconType: "package",
      title: "Total Barang",
      value: "500",
      trend: "+12.5%",
      trendType: "up",
      description: "Peningkatan 12.5% dari bulan lalu",
      subDescription: "Total barang pada bulan ini meningkat sebesar 12.5%.",
    },
    {
      iconType: "package-plus",
      title: "Total Barang Masuk",
      value: "350",
      trend: "-20%",
      trendType: "down",
      description: "Penurunan 20% dari bulan lalu",
      subDescription: "Total barang masuk bulan ini menurun.",
    },
    {
      iconType: "package-x",
      title: "Total Barang Keluar",
      value: "350",
      trend: "+12.5%",
      trendType: "up",
      description: "Peningkatan 12.5% dari bulan lalu",
      subDescription: "Total barang keluar bulan ini meningkat sebesar 12.5%.",
    },
    {
      iconType: "package-search",
      title: "Total Retur",
      value: "10",
      trend: "+12.5%",
      trendType: "up",
      description: "Peningkatan 12.5% dari bulan lalu",
      subDescription: "Barang yang dikembalikan dikarenakan alasan tertentu.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </div>
  );
}
