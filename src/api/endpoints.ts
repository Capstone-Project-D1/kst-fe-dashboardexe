export const API_ENDPOINTS = {
  dashboard: {
    summary: "/dashboard/summary",
    collaboration: "/dashboard/collaboration",
    researchProjects: "/dashboard/research-projects",
  },
  kst: {
    cangar: {
      summary: "/api/kst/cangar/data/summary",
      booking: "/api/kst/cangar/data/booking",
      stock: "/api/kst/cangar/data/stok",
      stockItems: "/api/kst/cangar/data/stok/items",
      finance: "/api/kst/cangar/data/keuangan",
      financeRecap: "/api/kst/cangar/data/keuangan/rekap",
    },
    jatikerto: {
      pertanianItems: "/kst/jatikerto/data/pertanian/items",
      peternakanItems: "/kst/jatikerto/data/peternakan/items",
      kemitraanItems: "/kst/jatikerto/data/kemitraan/items",
      akademikItems: "/kst/jatikerto/data/akademik/items",
      konservasiHewan: "/kst/jatikerto/data/konservasi/hewan",
      konservasiTanaman: "/kst/jatikerto/data/konservasi/tanaman",
    },
    ngijo: {
      trackerInovasiSummary: "/kst/ngijo/tracker-inovasi/summary",
      trackerInovasi: "/kst/ngijo/tracker-inovasi",
      greenPerformance: "/kst/ngijo/keberlanjutan/green-performance",
      waterLifecycle: "/kst/ngijo/keberlanjutan/water-lifecycle",
      wasteMetrics: "/kst/ngijo/keberlanjutan/waste-metrics",
      energyDynamics: "/kst/ngijo/keberlanjutan/energy-dynamics",
      renewableEnergy: "/kst/ngijo/keberlanjutan/renewable-energy",
      sensors: "/kst/ngijo/keberlanjutan/sensors",
    },
  },
  reports: {
    download: "/reports/download",
  },
} as const;
