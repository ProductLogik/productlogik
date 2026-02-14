import { AlertTriangle } from "lucide-react";

export function AgileHealth() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <h2 className="text-sm font-semibold text-white mb-4">
        Team Health Check
      </h2>

      <div className="space-y-4">
        {/* Warning Alert */}
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-rose-500 text-xs font-semibold uppercase tracking-wide">
                Risk Detected
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              Feature Factory
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              You shipped 40 points but user satisfaction dropped.
            </p>
          </div>
        </div>

        {/* Additional context */}
        <div className="pt-3 border-t border-gray-800">
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Story Points Shipped</span>
              <span className="text-gray-300 font-medium">40</span>
            </div>
            <div className="flex justify-between">
              <span>User Satisfaction</span>
              <span className="text-rose-400 font-medium">↓ -12%</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Churn</span>
              <span className="text-rose-400 font-medium">↑ +8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
