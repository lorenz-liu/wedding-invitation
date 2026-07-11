export interface CompanionGuest {
  name: string;
  relation: string;
}

export interface GuestDrawing {
  id: string;
  url: string;
}

export interface GuestRecord {
  id: string;
  mainContact: string;
  phone: string;
  wechatId: string;
  companions: CompanionGuest[];
  dietaryRestrictions: string;
  isDriving: boolean;
  needsShuttle: boolean;
  shuttleLocation: string;
  notes: string;
  drawingIds: string[];
  drawings: GuestDrawing[];
  createdAt: string;
}

export interface GuestDashboardStats {
  mainContactCount: number;
  companionCount: number;
  totalAttendees: number;
  drawingCount: number;
}

export interface GuestsApiResponse {
  guests: GuestRecord[];
  stats: GuestDashboardStats;
}
