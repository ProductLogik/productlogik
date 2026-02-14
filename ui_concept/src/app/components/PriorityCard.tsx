import { Badge } from "@/app/components/ui/badge";

interface PriorityCardProps {
  title: string;
  priority: "high" | "medium" | "low";
  mentions: number;
}

export function PriorityCard({ title, priority, mentions }: PriorityCardProps) {
  const priorityConfig = {
    high: {
      label: "High Priority",
      color: "bg-rose-100 text-rose-700 border-rose-200",
    },
    medium: {
      label: "Medium Priority",
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
    low: {
      label: "Low Priority",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
  };

  const config = priorityConfig[priority];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-900 leading-tight">
          {title}
        </h3>
        <Badge
          variant="outline"
          className={`${config.color} text-xs font-medium whitespace-nowrap border`}
        >
          {config.label}
        </Badge>
      </div>
      <p className="text-xs text-gray-600">
        <span className="font-semibold text-gray-900">{mentions}</span> mentions
      </p>
    </div>
  );
}
