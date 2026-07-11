"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "登录失败");
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-[#e8dfd3] bg-white p-8 shadow-sm"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-[#c9a87c]">
          Wedding Dashboard
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-[#2c2c2c]">管理员登录</h1>
        <p className="mt-2 text-sm leading-6 text-[#6b6b6b]">
          请输入访问密码查看宾客与涂鸦数据。
        </p>

        <label className="mt-6 block text-sm font-medium text-[#2c2c2c]">
          密码
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#e8dfd3] px-4 py-3 outline-none ring-[#c9a87c] focus:ring-2"
            autoComplete="current-password"
            required
          />
        </label>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-[#c9a87c] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "登录中..." : "进入 Dashboard"}
        </button>
      </form>
    </div>
  );
}
