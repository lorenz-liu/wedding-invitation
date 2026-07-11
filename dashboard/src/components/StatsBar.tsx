import type { GuestDashboardStats } from "@/lib/types";

interface StatsBarProps {
  stats: GuestDashboardStats;
  filteredCount: number;
}

export function StatsBar({ stats, filteredCount }: StatsBarProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="参加总人数" value={stats.totalAttendees} highlight />
      <StatCard label="主联络人" value={stats.mainContactCount} />
      <StatCard label="随行人员" value={stats.companionCount} />
      <StatCard label="涂鸦作品" value={stats.drawingCount} />
      <p className="sm:col-span-2 xl:col-span-4 text-sm text-[#6b6b6b]">
        当前列表显示 {filteredCount} 组答函（按主联络人）
      </p>
    </section>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border px-5 py-4 ${
        highlight
          ? "border-[#c9a87c] bg-[#faf3ea]"
          : "border-[#e8dfd3] bg-white"
      }`}
    >
      <p className="text-sm text-[#6b6b6b]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[#2c2c2c]">{value}</p>
    </div>
  );
}
