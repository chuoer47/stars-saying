import { unlockSettings } from "@/app/settings/actions";

export function SettingsLoginForm({ hasError = false }: { hasError?: boolean }) {
  return (
    <form action={unlockSettings} className="mt-5 space-y-4">
      <label className="block text-sm text-sky-100">
        <span>设置密码</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-white outline-none"
          placeholder="输入后进入设置页面"
        />
      </label>
      {hasError ? (
        <p className="rounded-2xl border border-rose-200/20 bg-rose-200/10 px-4 py-3 text-sm text-rose-50">
          密码不正确。
        </p>
      ) : null}
      <button
        type="submit"
        className="w-full rounded-2xl bg-amber-300 px-5 py-4 text-sm font-semibold text-slate-950 disabled:opacity-60"
      >
        进入设置
      </button>
    </form>
  );
}
