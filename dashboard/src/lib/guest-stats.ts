import type { GuestDashboardStats, GuestRecord } from "./types";

export function computeGuestStats(guests: GuestRecord[]): GuestDashboardStats {
  const mainContactCount = guests.length;
  const companionCount = guests.reduce(
    (sum, guest) => sum + guest.companions.length,
    0,
  );
  const drawingCount = guests.reduce(
    (sum, guest) => sum + guest.drawingIds.length,
    0,
  );

  return {
    mainContactCount,
    companionCount,
    totalAttendees: mainContactCount + companionCount,
    drawingCount,
  };
}

export function filterGuests(guests: GuestRecord[], query: string): GuestRecord[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return guests;

  return guests.filter((guest) => {
    const haystack = [
      guest.mainContact,
      guest.phone,
      guest.wechatId,
      guest.notes,
      guest.shuttleLocation,
      guest.dietaryRestrictions,
      guest.companions.map((c) => `${c.name} ${c.relation}`).join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });
}
