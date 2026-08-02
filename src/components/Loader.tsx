export function Loader({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="w-14 h-14 rounded-full border-4 border-white/10 border-t-emerald-500 animate-spin" />
      <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function EmptyState({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
      {icon}
      <p className="text-sm uppercase tracking-widest font-bold text-gray-500">{title}</p>
    </div>
  );
}
