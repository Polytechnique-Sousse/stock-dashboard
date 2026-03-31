import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number | string;
  color?: string;
  icon: LucideIcon;
  trend?: string;
  up?: boolean;
};

export default function StatCard({
  title,
  value,
  color = "bg-blue-500",
  icon: Icon,
  trend,
  up = true,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`${color} p-3 rounded-xl`}>
        <Icon size={22} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${up ? "text-green-500" : "text-red-500"}`}>
          {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend}
        </div>
      )}
    </div>
  );
}