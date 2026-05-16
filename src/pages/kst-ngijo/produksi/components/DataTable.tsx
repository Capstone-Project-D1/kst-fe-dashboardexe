import { useState } from "react";
import {
  ChevronDown,
  LayoutGrid,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  Clock,
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
import { Badge } from "@/components/ui/badge";

const dummyData = [
  { id: 1, customer: "Ahmad Rizki", checkIn: "1/5/2026", checkOut: "3/5/2026", type: "Glamping Deluxe", unit: "Deluxe 3", price: "Rp 1.500.000", status: "Lunas", note: "Transfer Bank" },
  { id: 2, customer: "Siti Nurhaliza", checkIn: "2/5/2026", checkOut: "6/5/2026", type: "Villa Family", unit: "Villa 5", price: "Rp 2.800.000", status: "Lunas", note: "Kartu Kredit" },
  { id: 3, customer: "Budi Santoso", checkIn: "3/5/2026", checkOut: "4/5/2026", type: "Camping Ground", unit: "Tenda Standard", price: "Rp 500.000", status: "Belum Lunas", note: "Cash" },
  { id: 4, customer: "Dewi Lestari", checkIn: "4/5/2026", checkOut: "7/5/2026", type: "Glamping Deluxe", unit: "Deluxe 1", price: "Rp 1.700.000", status: "Lunas", note: "Transfer Bank" },
  { id: 5, customer: "Rian Aditya", checkIn: "2/5/2026", checkOut: "5/5/2026", type: "Villa Family", unit: "Villa 3", price: "Rp 2.600.000", status: "Belum Lunas", note: "Kartu Kredit" },
  { id: 6, customer: "Maya Sari", checkIn: "5/5/2026", checkOut: "9/5/2026", type: "Camping Ground", unit: "Tenda Premium", price: "Rp 850.000", status: "Lunas", note: "Cash" },
  { id: 7, customer: "Agus Wijaya", checkIn: "1/5/2026", checkOut: "3/5/2026", type: "Glamping Deluxe", unit: "Deluxe 2", price: "Rp 1.550.000", status: "Lunas", note: "Transfer Bank" },
  { id: 8, customer: "Lila Pratiwi", checkIn: "6/5/2026", checkOut: "10/5/2026", type: "Villa Family", unit: "Villa 4", price: "Rp 2.900.000", status: "Belum Lunas", note: "Kartu Kredit" },
  { id: 9, customer: "Andi Setiawan", checkIn: "3/5/2026", checkOut: "5/5/2026", type: "Camping Ground", unit: "Tenda Standard", price: "Rp 450.000", status: "Lunas", note: "Cash" },
  { id: 10, customer: "Nina Kartika", checkIn: "4/5/2026", checkOut: "8/5/2026", type: "Glamping Deluxe", unit: "Deluxe 3", price: "Rp 1.600.000", status: "Belum Lunas", note: "Transfer Bank" },
];

const months = ["Semua Bulan", "Januari", "Februari", "Maret", "April"];

export default function DataTable() {
  const [activeMonth, setActiveMonth] = useState("Semua Bulan");

  return (
    <div className="space-y-4">
      {/* Filters Row */}
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
                className={`h-8 px-4 text-xs font-semibold rounded-md ${
                  activeMonth === month 
                    ? "bg-[#F3F4F6] text-black" 
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {month}
              </Button>
            ))}
          </div>
        </div>

        <Select defaultValue="reservasi">
          <SelectTrigger className="w-[180px] h-10 border-gray-200 rounded-lg">
            <div className="flex items-center gap-2">
              <LayoutGrid className="size-4" />
              <SelectValue placeholder="Tipe" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reservasi">Data Reservasi</SelectItem>
            <SelectItem value="produksi">Data Produksi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[#F9FAFB]">
            <TableRow className="hover:bg-transparent border-gray-200">
              <TableHead className="w-[50px] font-bold text-gray-700">No.</TableHead>
              <TableHead className="font-bold text-gray-700">Nama Pelanggan</TableHead>
              <TableHead className="font-bold text-gray-700">Check In</TableHead>
              <TableHead className="font-bold text-gray-700">Check Out</TableHead>
              <TableHead className="font-bold text-gray-700">Tipe</TableHead>
              <TableHead className="font-bold text-gray-700">No Unit</TableHead>
              <TableHead className="font-bold text-gray-700">Harga</TableHead>
              <TableHead className="font-bold text-gray-700">Status</TableHead>
              <TableHead className="font-bold text-gray-700">Keterangan Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyData.map((item, index) => (
              <TableRow key={item.id} className="border-gray-100 hover:bg-gray-50/50">
                <TableCell className="font-medium text-gray-600">{index + 1}.</TableCell>
                <TableCell className="font-semibold text-gray-900">{item.customer}</TableCell>
                <TableCell className="text-gray-500">{item.checkIn}</TableCell>
                <TableCell className="text-gray-500">{item.checkOut}</TableCell>
                <TableCell className="text-gray-500">{item.type}</TableCell>
                <TableCell className="text-gray-500">{item.unit}</TableCell>
                <TableCell className="font-bold text-gray-900">{item.price}</TableCell>
                <TableCell>
                  {item.status === "Lunas" ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0FDF4] text-[#16A34A] w-fit border border-[#BBF7D0]">
                      <CheckCircle2 className="size-3.5" />
                      <span className="text-xs font-bold uppercase tracking-wide">Lunas</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF2F2] text-[#DC2626] w-fit border border-[#FECACA]">
                      <Clock className="size-3.5" />
                      <span className="text-xs font-bold uppercase tracking-wide">Belum Lunas</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-gray-500">{item.note}</TableCell>
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
