import type { GuestRecord } from "@/lib/types";
import { GuestRow } from "./GuestRow";

interface GuestListProps {
  guests: GuestRecord[];
}

export function GuestList({ guests }: GuestListProps) {
  if (!guests.length) {
    return (
      <div className="rounded-2xl border border-[#e8dfd3] bg-white px-4 py-10 text-center text-[#6b6b6b]">
        暂无匹配的宾客记录
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e8dfd3] bg-white">
      <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto] gap-4 border-b border-[#f0e8dc] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-[#6b6b6b] md:grid">
        <span>主联络人</span>
        <span>联系方式</span>
        <span>随行</span>
        <span>涂鸦</span>
      </div>
      <div className="divide-y divide-[#f0e8dc]">
        {guests.map((guest) => (
          <GuestRow key={guest.id} guest={guest} />
        ))}
      </div>
    </div>
  );
}
