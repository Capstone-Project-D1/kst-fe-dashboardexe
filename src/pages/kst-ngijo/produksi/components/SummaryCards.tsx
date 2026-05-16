import { Calendar, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LargeCardProps {
  title: string;
  value: string;
  trend: string;
  trendType: "up" | "down";
  description: string;
  subDescription: string;
  icon: React.ReactNode;
}

const LargeCard = ({ title, value, trend, trendType, description, subDescription, icon }: LargeCardProps) => {
  const isUp = trendType === "up";
  return (
    <Card className="shadow-sm border-gray-100 rounded-2xl h-full">
      <CardHeader className="flex flex-row items-center gap-3 p-4 pb-2 space-y-0">
        <div className="text-[#737373]">{icon}</div>
        <CardTitle className="text-xs font-semibold text-[#737373]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="flex items-center justify-between gap-2.5">
          <p className="text-2xl font-bold text-black tracking-tight">
            {value}
          </p>
          <div className={`flex h-6 py-0.5 px-2 justify-center items-center gap-1 rounded-md border ${isUp ? "border-[#B2DDB5] bg-[#F5FBF5]" : "border-[#F8D7DA] bg-[#FFF5F5]"
            }`}>
            {isUp ? (
              <TrendingUp className="size-4 text-[#46A758]" />
            ) : (
              <TrendingDown className="size-4 text-[#E5484D]" />
            )}
            <p className={`text-xs font-bold ${isUp ? "text-[#46A758]" : "text-[#E5484D]"}`}>
              {trend}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[13px] font-bold text-[#1F2937]">
            {description}
          </p>
          <p className="text-[12px] text-[#9CA3AF] font-normal leading-tight">
            {subDescription}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const SmallCard = ({ title, value }: { title: string; value: string }) => (
  <Card className="shadow-sm border-gray-100 rounded-2xl">
    <CardContent className="p-4 flex flex-col justify-center h-full">
      <p className="text-xs font-semibold text-[#737373] mb-1">{title}</p>
      <p className="text-xl font-bold text-black">{value}</p>
    </CardContent>
  </Card>
);

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-5">
        <LargeCard
          title="Total Booking"
          value="1"
          trend="+12.5%"
          trendType="up"
          icon={<Calendar className="size-5" />}
          description="Peningkatan 12.5% dari bulan lalu"
          subDescription="Booking pada bulan ini meningkat sebesar 12.5%."
        />
      </div>
      <div className="lg:col-span-4">
        <LargeCard
          title="Total Pendapatan"
          value="Rp 1.800.000"
          trend="-20%"
          trendType="down"
          icon={<DollarSign className="size-5" />}
          description="Penurunan 20% dari bulan lalu"
          subDescription="Pendapatan yang masuk bulan ini menurun sebesar 20%."
        />
      </div>
      <div className="lg:col-span-3 flex flex-col gap-4">
        <SmallCard title="Lunas" value="1" />
        <SmallCard title="Belum Lunas / DP" value="1" />
      </div>
    </div>
  );
}
