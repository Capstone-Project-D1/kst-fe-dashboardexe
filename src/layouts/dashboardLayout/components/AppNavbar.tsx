import { Search, ChevronRight } from "lucide-react"
import { useLocation } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { ROUTES } from "@/routes/routes"

export function AppNavbar() {
  const location = useLocation()

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
        {/* Search Input Mockup */}
        <div className="relative w-[205px] group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
          <Input
            placeholder="Type to search..."
            className="pl-8 h-8 bg-gray-50 border-gray-100 text-[12px] rounded-lg focus-visible:ring-[#27A376] focus-visible:bg-white transition-all"
          />
        </div>
      </div>
    </header>
  )
}
