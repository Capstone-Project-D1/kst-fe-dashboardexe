import { Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"

export function AppNavbar() {
  return (
    <header className="flex h-[51px] shrink-0 items-center gap-2 border-b border-gray-100 bg-white px-4 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">

        {/* Breadcrumbs Mockup */}
        <nav className="flex items-center text-[12px] font-medium">
          <ol className="flex items-center gap-2">
            <li className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Executive Dashboard</span>
              <ChevronRight className="size-3 text-gray-300" />
            </li>
            <li className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Home</span>
              <ChevronRight className="size-3 text-gray-300" />
            </li>
            <li>
              <span className="text-gray-900 font-bold">Beranda</span>
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
