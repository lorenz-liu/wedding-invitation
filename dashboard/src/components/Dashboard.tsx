"use client";

import { useEffect, useMemo, useState } from "react";
import type { GuestRecord, GuestsApiResponse } from "@/lib/types";
import { filterGuests } from "@/lib/guest-stats";
import { StatsBar } from "./StatsBar";
import { GuestList } from "./GuestList";

export function Dashboard() {
  const [query, setQuery] = useState("");
  const [guests, setGuests] = useState<GuestRecord[]>([]);
  const [stats, setStats] = useState<GuestsApiResponse["stats"]>({
    mainContactCount: 0,
    companionCount: 0,
    totalAttendees: 0,
    drawingCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastLoadedAt, setLastLoadedAt] = useState<string>("");

  async function loadGuests() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/guests", { cache: "no-store" });
      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!response.ok) {
        const data = (await response.json()) as { message?: string; error?: string };
        throw new Error(data.message || data.error || "加载失败");
      }

      const data = (await response.json()) as GuestsApiResponse;
      setGuests(data.guests);
      setStats(data.stats);
      setLastLoadedAt(new Date().toLocaleString("zh-CN"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadGuests();
  }, []);

  const filteredGuests = useMemo(
    () => filterGuests(guests, query),
    [guests, query],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-[#e8dfd3] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[#c9a87c]">
            Wedding Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-[#2c2c2c]">
            宾客与涂鸦总览
          </h1>
          <p className="mt-2 text-sm text-[#6b6b6b]">
            数据来源：Tablestore `guests` · OSS `guest-drawings`
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void loadGuests()}
            disabled={loading}
            className="rounded-full border border-[#c9a87c] px-4 py-2 text-sm font-medium text-[#c9a87c] transition hover:bg-[#faf3ea] disabled:opacity-50"
          >
            {loading ? "刷新中..." : "刷新数据"}
          </button>
          <button
            type="button"
            onClick={() => {
              void fetch("/api/auth/login", { method: "DELETE" }).then(() => {
                window.location.href = "/login";
              });
            }}
            className="rounded-full border border-[#e8dfd3] px-4 py-2 text-sm text-[#6b6b6b] transition hover:bg-white"
          >
            退出登录
          </button>
        </div>
      </header>

      <StatsBar stats={stats} filteredCount={filteredGuests.length} />

      <section className="rounded-2xl border border-[#e8dfd3] bg-white p-4 sm:p-5">
        <label className="block text-sm font-medium text-[#2c2c2c]">
          搜索宾客
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="姓名、电话、微信、备注、随行人员..."
            className="mt-2 w-full rounded-xl border border-[#e8dfd3] px-4 py-3 outline-none ring-[#c9a87c] focus:ring-2"
          />
        </label>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading && guests.length === 0 ? (
        <div className="rounded-2xl border border-[#e8dfd3] bg-white px-4 py-10 text-center text-[#6b6b6b]">
          正在加载宾客数据...
        </div>
      ) : (
        <GuestList guests={filteredGuests} />
      )}

      {lastLoadedAt ? (
        <p className="text-center text-xs text-[#6b6b6b]">
          上次刷新：{lastLoadedAt}
        </p>
      ) : null}
    </div>
  );
}
