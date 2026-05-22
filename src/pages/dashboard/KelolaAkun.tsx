import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Trash2,
  UserRound,
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

interface UserRow {
  no: number;
  name: string;
  email: string;
  role: "Anda" | "Administrator" | "Manajer" | "Staff";
  tanggalDaftar: string;
  hakAkses: "Administrator" | "Editor" | "Viewer";
  status: "Aktif" | "Nonaktif";
}

const userData: UserRow[] = [
  {
    no: 1,
    name: "Admin Pusat",
    email: "admin@admin.com",
    role: "Anda",
    tanggalDaftar: "3/5/2026",
    hakAkses: "Administrator",
    status: "Aktif",
  },
  {
    no: 2,
    name: "Manajer Proyek",
    email: "budi.santoso@perusahaan.com",
    role: "Administrator",
    tanggalDaftar: "15/8/2025",
    hakAkses: "Administrator",
    status: "Aktif",
  },
  {
    no: 3,
    name: "Tim Keuangan",
    email: "sari.dewi@perusahaan.com",
    role: "Administrator",
    tanggalDaftar: "1/12/2024",
    hakAkses: "Administrator",
    status: "Aktif",
  },
  {
    no: 4,
    name: "Tim Pengembangan",
    email: "rizky.pratama@perusahaan.com",
    role: "Administrator",
    tanggalDaftar: "22/3/2026",
    hakAkses: "Administrator",
    status: "Aktif",
  },
  {
    no: 5,
    name: "Support Pelanggan",
    email: "dewi.lestari@perusahaan.com",
    role: "Administrator",
    tanggalDaftar: "10/1/2027",
    hakAkses: "Administrator",
    status: "Aktif",
  },
  {
    no: 6,
    name: "Operator KST Ngijo",
    email: "operator.ngijo@perusahaan.com",
    role: "Staff",
    tanggalDaftar: "12/2/2026",
    hakAkses: "Editor",
    status: "Aktif",
  },
  {
    no: 7,
    name: "Operator KST Cangar",
    email: "operator.cangar@perusahaan.com",
    role: "Staff",
    tanggalDaftar: "19/2/2026",
    hakAkses: "Editor",
    status: "Aktif",
  },
  {
    no: 8,
    name: "Operator KST Jatikerto",
    email: "operator.jatikerto@perusahaan.com",
    role: "Staff",
    tanggalDaftar: "25/2/2026",
    hakAkses: "Viewer",
    status: "Nonaktif",
  },
];

function getRoleBadgeClass(role: UserRow["role"]) {
  if (role === "Anda") {
    return "bg-white text-gray-700 border-gray-200";
  }

  if (role === "Administrator") {
    return "bg-[#E6F6EB] text-[#30A46C] border-[#CDEFD8]";
  }

  if (role === "Manajer") {
    return "bg-blue-50 text-blue-600 border-blue-100";
  }

  return "bg-gray-50 text-gray-600 border-gray-200";
}

export default function KelolaAkun() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState("5");
  const [users, setUsers] = useState<UserRow[]>(userData);

  const filteredData = useMemo(() => {
    return users.filter((user) => {
      const keyword = searchQuery.toLowerCase();

      const matchSearch =
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword);

      const matchStatus =
        selectedStatus === "semua" ||
        user.status.toLowerCase() === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [searchQuery, selectedStatus, users]);

  const rowsPerPageNumber = Number(rowsPerPage);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / rowsPerPageNumber)
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPageNumber,
    currentPage * rowsPerPageNumber
  );

  const handleChangeAccess = (userNo: number, value: UserRow["hakAkses"]) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.no === userNo ? { ...user, hakAkses: value } : user
      )
    );
  };

  const handleDeleteUser = (userNo: number) => {
    setUsers((prev) => prev.filter((user) => user.no !== userNo));
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-5 p-4 md:p-6 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button className="h-9 px-4 rounded-lg border border-gray-200 bg-white text-[13px] font-semibold text-gray-700 shadow-sm">
          List Pengguna
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />

            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari nama atau email..."
              className="h-9 w-[260px] rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-[13px] font-medium outline-none placeholder:text-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <Select
            value={selectedStatus}
            onValueChange={(value) => {
              setSelectedStatus(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[150px] border-gray-200 bg-white text-[13px] font-medium">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="semua">Semua Status</SelectItem>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="nonaktif">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[1050px]">
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                <TableHead className="font-bold text-gray-500 text-[12px] w-[55px] text-center">
                  No.
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[260px]">
                  Nama Pengguna
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[140px] text-center">
                  Role
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[150px] text-center">
                  Tanggal daftar
                </TableHead>

                <TableHead className="font-bold text-gray-500 text-[12px] min-w-[180px] text-center">
                  Hak akses
                </TableHead>

                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((user, index) => (
                  <TableRow key={user.no} className="hover:bg-gray-50/50 group">
                    <TableCell className="text-[13px] text-gray-500 font-medium text-center">
                      {(currentPage - 1) * rowsPerPageNumber + index + 1}.
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-gray-100 border border-gray-200 ring-2 ring-gray-50 shrink-0 flex items-center justify-center">
                          <UserRound className="size-5 text-gray-400" />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-gray-900 leading-tight">
                            {user.name}
                          </span>
                          <span className="text-[11px] text-gray-400 font-medium">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={cn(
                          "inline-flex items-center justify-center rounded-md border px-2.5 py-1 text-[11px] font-bold",
                          getRoleBadgeClass(user.role)
                        )}
                      >
                        {user.role}
                      </span>
                    </TableCell>

                    <TableCell className="text-[13px] text-gray-600 font-medium text-center whitespace-nowrap">
                      {user.tanggalDaftar}
                    </TableCell>

                    <TableCell className="text-center">
                      <Select
                        value={user.hakAkses}
                        onValueChange={(value) =>
                          handleChangeAccess(
                            user.no,
                            value as UserRow["hakAkses"]
                          )
                        }
                      >
                        <SelectTrigger className="h-8 w-[130px] mx-auto border-gray-200 bg-white text-[12px] font-semibold">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="Administrator">
                            Administrator
                          </SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className="text-center">
                      <button
                        onClick={() => handleDeleteUser(user.no)}
                        className="p-1.5 rounded-md text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-[13px] text-gray-400 font-medium"
                  >
                    Data pengguna tidak ditemukan.
                  </TableCell>
                </TableRow>
              )}
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
                  action: () =>
                    setCurrentPage(Math.max(1, currentPage - 1)),
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