import SummaryCards from "./components/SummaryCards";
import DataTable from "./components/DataTable";

export default function TrackerInovasi() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 bg-gray-50/50 min-h-screen">
      {/* SECTION 1: Summary Cards */}
      <SummaryCards />

      {/* SECTION 2: Data Table and Filters */}
      <DataTable />
    </div>
  );
}
