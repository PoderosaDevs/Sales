export function StatCard({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className={`p-5 md:p-6 rounded-2xl border ${accent ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white/[0.02] border-white/5"}`}>
      <p className={`text-[10px] font-bold uppercase tracking-[2px] ${accent ? "text-emerald-500" : "text-gray-500"}`}>{label}</p>
      <p className={`text-2xl md:text-3xl font-black mt-1 ${accent ? "text-emerald-500" : "text-white"}`}>{value}</p>
    </div>
  );
}
