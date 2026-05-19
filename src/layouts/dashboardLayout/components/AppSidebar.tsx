import * as React from "react"
import { useLocation, Link } from "react-router-dom"
import {
  Home,
  ChevronDown,
  Download,
  Activity,
  Package,
  ClipboardList,
  Book,
  Sprout,
  Leaf,
  GraduationCap,
  Handshake,
  LogOut,
  LayoutDashboard,
  PawPrint,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/routes/routes"
import { useAuth } from "@/hooks/useAuth"

// Static data structure mapped to ROUTES
const NAV_ITEMS = [
  {
    title: "Home",
    items: [
      {
        title: "Beranda",
        url: ROUTES.DASHBOARD,
        icon: Home,
      },
    ],
  },
  {
    title: "KST Ngijo",
    items: [
      {
        title: "Tracker Inovasi",
        url: ROUTES.TRACKER_INOVASI,
        icon: Activity,
      },
      {
        title: "Keberlanjutan",
        url: ROUTES.KEBERLANJUTAN,
        icon: Leaf,
      },
    ],
  },
  {
    title: "KST Cangar",
    items: [
      {
        title: "Stok Opname",
        url: ROUTES.STOK_OPNAME,
        icon: ClipboardList,
      },
      {
        title: "Booklist ATP",
        url: ROUTES.BOOKLIST_ATP,
        icon: Book,
      },
    ],
  },
  {
    title: "KST Jatikerto",
    items: [
      {
        title: "Pertanian",
        url: ROUTES.PERTANIAN,
        icon: Sprout,
      },
      {
        title: "Peternakan",
        url: ROUTES.PETERNAKAN,
        icon: PawPrint,
      },
      {
        title: "Konservasi",
        url: ROUTES.KONSERVASI,
        icon: Leaf,
      },
      {
        title: "Pelayanan Akademik",
        url: ROUTES.PELAYANAN_AKADEMIK,
        icon: GraduationCap,
      },
      {
        title: "Kemitraan",
        url: ROUTES.KEMITRAAN,
        icon: Handshake,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const { logout } = useAuth()

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    "Home": true,
    "KST Ngijo": true,
    "KST Cangar": true,
    "KST Jatikerto": true,
  })

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-gray-200"
      {...props}
    >
      <SidebarHeader className="p-[9.25px] border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white">
            <LayoutDashboard className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-[12px] text-[#151515]">Executive Dashboard</span>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">KST UB</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-1 py-3 gap-3">
        <div className="px-1 group-data-[collapsible=icon]:hidden">
          <Button className="w-full justify-start gap-2 bg-[#27A376] hover:bg-[#1f8a63] text-white font-semibold rounded-lg h-9 shadow-sm text-[12px]">
            <Download className="size-3" />
            <span>Unduh Laporan</span>
          </Button>
        </div>

        {NAV_ITEMS.map((group) => {
          const isOpen = openGroups[group.title]
          return (
            <SidebarGroup key={group.title} className="p-0">
              <SidebarGroupLabel
                className={cn(
                  "px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-between group-data-[collapsible=icon]:hidden cursor-pointer hover:text-gray-600 transition-colors",
                  !isOpen && "mb-0"
                )}
                onClick={() => toggleGroup(group.title)}
              >
                {group.title}
                <ChevronDown className={cn("size-3 transition-transform duration-200", isOpen ? "rotate-180" : "rotate-0")} />
              </SidebarGroupLabel>

              <div className={cn(
                "grid transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden",
                isOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0 overflow-hidden"
              )}>
                <SidebarGroupContent className="overflow-hidden">
                  <SidebarMenu className="gap-0.5">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.url
                      const Icon = item.icon

                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className={cn(
                              "w-full justify-start px-3 py-1.5 rounded-lg transition-colors h-8 text-[12px]",
                              isActive
                                ? "!bg-[#E6F6EB] !text-[#30A46C] font-semibold hover:bg-[#E9F7F2]"
                                : "text-gray-600 hover:bg-gray-50 font-medium"
                            )}
                          >
                            <Link to={item.url} className="flex items-center gap-2.5 w-full">
                              <Icon className="size-3" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </div>
            </SidebarGroup>
          )
        })}
      </SidebarContent>

      <SidebarFooter className="p-3 mt-auto border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2.5 mb-3 group-data-[collapsible=icon]:justify-center">
          <div className="size-8 rounded-full bg-gray-200 overflow-hidden ring-2 ring-gray-100 shrink-0">
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white font-bold text-[10px]">
              AP
            </div>
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-[12px] text-[#151515]">Admin Pusat</span>
            <span className="text-[10px] text-gray-500 font-medium">Administrator</span>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={logout}
          className="w-full justify-between gap-2 border-gray-200 text-gray-700 font-semibold hover:bg-red-500 hover:text-white rounded-lg h-8 text-[12px] group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
        >
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          <LogOut className="size-3" />
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
