"use client";

import { useState } from "react";
import type { GuestRecord } from "@/lib/types";

interface GuestRowProps {
  guest: GuestRecord;
}

export function GuestRow({ guest }: GuestRowProps) {
  const [open, setOpen] = useState(false);
  const companionCount = guest.companions.length;
  const attendeeCount = 1 + companionCount;

  return (
    <article className="px-4 py-4 sm:px-5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="grid w-full gap-3 text-left md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto] md:items-center md:gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block text-xs transition ${open ? "rotate-90" : ""}`}
              aria-hidden
            >
              ▶
            </span>
            <h2 className="text-lg font-semibold text-[#2c2c2c]">
              {guest.mainContact || "（未填写姓名）"}
            </h2>
          </div>
          <p className="mt-1 text-xs text-[#6b6b6b] md:pl-5">
            提交于 {formatDate(guest.createdAt)} · 共 {attendeeCount} 人
          </p>
        </div>

        <div className="md:pl-0 pl-5 text-sm text-[#6b6b6b]">
          {guest.phone ? <p>电话：{guest.phone}</p> : <p>电话：—</p>}
          {guest.wechatId ? <p className="mt-1">微信：{guest.wechatId}</p> : null}
        </div>

        <div className="pl-5 text-sm text-[#2c2c2c] md:pl-0">
          {companionCount > 0 ? `${companionCount} 人` : "无"}
        </div>

        <div className="pl-5 text-sm text-[#2c2c2c] md:pl-0">
          {guest.drawings.length > 0 ? `${guest.drawings.length} 幅` : "—"}
        </div>
      </button>

      {open ? (
        <div className="mt-4 space-y-5 border-t border-[#f0e8dc] pt-4 md:pl-5">
          <DetailSection title="出行信息">
            <DetailItem label="自驾" value={guest.isDriving ? "是" : "否"} />
            <DetailItem
              label="接驳"
              value={
                guest.needsShuttle
                  ? `需要${guest.shuttleLocation ? `（${guest.shuttleLocation}）` : ""}`
                  : "不需要"
              }
            />
            <DetailItem label="饮食限制" value={guest.dietaryRestrictions || "—"} />
            <DetailItem label="备注" value={guest.notes || "—"} />
          </DetailSection>

          <DetailSection title="随行人员">
            {guest.companions.length ? (
              <ul className="space-y-2">
                {guest.companions.map((companion, index) => (
                  <li
                    key={`${companion.name}-${index}`}
                    className="flex flex-wrap items-center gap-2 rounded-xl bg-[#faf8f5] px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-[#2c2c2c]">
                      {companion.name || "（未填写姓名）"}
                    </span>
                    {companion.relation ? (
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#6b6b6b]">
                        {companion.relation}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#6b6b6b]">无随行人员</p>
            )}
          </DetailSection>

          <DetailSection title="涂鸦作品">
            {guest.drawings.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {guest.drawings.map((drawing) => (
                  <figure
                    key={drawing.id}
                    className="overflow-hidden rounded-xl border border-[#e8dfd3] bg-[#faf8f5]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={drawing.url}
                      alt={`${guest.mainContact} 的涂鸦`}
                      className="aspect-square w-full bg-white object-contain"
                    />
                    <figcaption className="px-3 py-2 text-xs text-[#6b6b6b]">
                      {drawing.id}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#6b6b6b]">尚未上传涂鸦</p>
            )}
          </DetailSection>

          <p className="text-xs text-[#6b6b6b]">Guest ID: {guest.id}</p>
        </div>
      ) : null}
    </article>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
}) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-[#2c2c2c]">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm text-[#6b6b6b]">
      <span className="font-medium text-[#2c2c2c]">{label}：</span>
      {value}
    </p>
  );
}

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN");
}
