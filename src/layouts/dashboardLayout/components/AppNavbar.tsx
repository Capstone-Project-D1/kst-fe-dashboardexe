import * as React from "react"
import { Search, ChevronRight } from "lucide-react"
import { useLocation } from "react-router-dom"
import { ROUTES } from "@/routes/routes"
import { SearchCommand } from "./SearchCommand"

export function AppNavbar() {
  const location = useLocation()
  const [open, setOpen] = React.useState(false)

  // Mapping paths to readable titles
  const getBreadcrumbTitle = (path: string) => {
    switch (path) {
      case ROUTES.DASHBOARD: return "Beranda"
      case ROUTES.TRACKER_INOVASI: return "Tracker Inovasi"
      case ROUTES.PRODUKSI: return "Produksi"
      case ROUTES.STOK_OPNAME: return "Stok Opname"
      case ROUTES.BOOKLIST_ATP: return "Booklist ATP"
      case ROUTES.PERTANIAN: return "Pertanian"
      case ROUTES.PETERNAKAN: return "Peternakan"
      case ROUTES.KONSERVASI: return "Konservasi"
      case ROUTES.PELAYANAN_AKADEMIK: return "Pelayanan Akademik"
      case ROUTES.KEMITRAAN: return "Kemitraan"
      case ROUTES.PROFILE: return "Profil"
      case ROUTES.CHANGE_PASSWORD: return "Ganti Password"
      default: return "Dashboard"
    }
  }

  const currentTitle = getBreadcrumbTitle(location.pathname)

  return (
    <header className="flex h-[51px] shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-4 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">

        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center text-[12px] font-medium">
          <ol className="flex items-center gap-2">
            <li className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Executive Dashboard</span>
              <ChevronRight className="size-3 text-gray-300" />
            </li>
            <li>
              <span className="text-gray-900 font-bold">{currentTitle}</span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Trigger */}
        <button
          onClick={() => setOpen(true)}
          className="relative w-[220px] group flex items-center h-8 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-lg px-3 transition-all cursor-text"
        >
          <Search className="size-3 text-gray-400 group-hover:text-gray-600 transition-colors mr-2" />
          <span className="text-[12px] text-gray-400 flex-1 text-left">Cari Konten...</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-gray-200 bg-white px-1.5 font-mono text-[10px] font-medium text-gray-400 opacity-100 sm:flex">
            <span className="text-xs">Shift + </span>
            <span className="text-xs">K</span>
          </kbd>
        </button>
      </div>

      <SearchCommand open={open} setOpen={setOpen} />
    </header>
  )
}
