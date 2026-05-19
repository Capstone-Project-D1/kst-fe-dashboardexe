import { useState } from "react";
import {
  ChevronDown,
  LayoutGrid,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const dummyData = [
  { id: 1, name: "Kentang Granola", initialStock: 500, daily: [50, 60, 70, 50, 60, 30, 30], total: 500 },
  { id: 2, name: "Singkong", initialStock: 450, daily: [45, 55, 65, 40, 50, 25, 35], total: 450 },
  { id: 3, name: "Stroberi", initialStock: 600, daily: [60, 70, 80, 55, 65, 35, 40], total: 600 },
  { id: 4, name: "Apel Batu", initialStock: 550, daily: [53, 63, 73, 48, 58, 28, 33], total: 550 },
  { id: 5, name: "Kopi", initialStock: 470, daily: [47, 57, 67, 43, 53, 27, 32], total: 470 },
  { id: 6, name: "Jeruk", initialStock: 530, daily: [52, 62, 72, 49, 59, 29, 34], total: 530 },
  { id: 7, name: "Tomat", initialStock: 490, daily: [48, 58, 68, 44, 54, 26, 31], total: 490 },
  { id: 8, name: "Mentimun", initialStock: 520, daily: [50, 60, 70, 47, 57, 28, 33], total: 520 },
  { id: 9, name: "Tomat", initialStock: 580, daily: [58, 68, 78, 53, 63, 32, 37], total: 580 },
  { id: 10, name: "Alpukat", initialStock: 610, daily: [61, 71, 81, 56, 66, 34, 39], total: 610 },
];

const months = ["Semua Bulan", "Januari", "Februari", "Maret", "April"];

export default function DataTable() {
  const [activeMonth, setActiveMonth] = useState("Semua Bulan");

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Select defaultValue="2026">
            <SelectTrigger className="w-[100px] h-10 border-gray-200 rounded-lg">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
            {months.map((month) => (
              <Button
                key={month}
                variant={activeMonth === month ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveMonth(month)}
                className={`h-8 px-4 text-xs font-semibold rounded-md ${activeMonth === month
                  ? "bg-[#F3F4F6] text-black"
                  : "text-gray-500 hover:text-black"
                  }`}
              >
                {month}
              </Button>
            ))}
          </div>
        </div>

        <Select defaultValue="masuk">
          <SelectTrigger className="w-[180px] h-10 border-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
              <LayoutGrid className="size-4" />
              <SelectValue placeholder="Tipe" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masuk">Barang Masuk</SelectItem>
            <SelectItem value="keluar">Barang Keluar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[#F9FAFB]">
            <TableRow className="hover:bg-transparent border-gray-200">
              <TableHead className="w-[60px] font-bold text-gray-700">No.</TableHead>
              <TableHead className="font-bold text-gray-700">Nama Barang</TableHead>
              <TableHead className="text-right font-bold text-gray-700">Stok Awal</TableHead>
              <TableHead className="text-center p-0" colSpan={7}>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-700 py-2">Barang Masuk</span>
                  <div className="grid grid-cols-7">
                    {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, idx) => (
                      <span key={idx} className="py-2 text-[10px] font-bold text-gray-400">{day}</span>
                    ))}
                  </div>
                </div>
              </TableHead>
              <TableHead className="text-right font-bold text-gray-700">Total Masuk</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyData.map((item, index) => (
              <TableRow key={item.id} className="border-gray-100 hover:bg-gray-50/50">
                <TableCell className="font-medium text-gray-600">{index + 1}.</TableCell>
                <TableCell className="font-semibold text-gray-900">{item.name}</TableCell>
                <TableCell className="text-right font-medium text-gray-500">{item.initialStock}</TableCell>
                {item.daily.map((val, idx) => (
                  <TableCell key={idx} className="text-center text-xs font-medium text-gray-500 p-2 border-l border-gray-50 first:border-l-0">
                    {val}
                  </TableCell>
                ))}
                <TableCell className="text-right font-bold text-[#27A376]">
                  {item.total}
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" className="size-8 text-gray-400">
                    <MoreVertical className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-t border-gray-100 bg-[#F9FAFB]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Baris per Page</span>
            <Select defaultValue="10">
              <SelectTrigger className="w-[70px] h-9 border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-gray-600">Page 1 dari 7</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="size-8 rounded-md border-gray-200">
                <ChevronsLeft className="size-4 text-gray-400" />
              </Button>
              <Button variant="outline" size="icon" className="size-8 rounded-md border-gray-200">
                <ChevronLeft className="size-4 text-gray-400" />
              </Button>
              <Button variant="outline" size="icon" className="size-8 rounded-md border-gray-200">
                <ChevronRight className="size-4 text-gray-400" />
              </Button>
              <Button variant="outline" size="icon" className="size-8 rounded-md border-gray-200">
                <ChevronsRight className="size-4 text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
