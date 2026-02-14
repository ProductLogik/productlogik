import { FileDown, ChevronRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Project:</span>
          <span className="text-gray-900 font-medium">
            Q4 Customer Feedback
          </span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-medium">Analysis</span>
        </div>

        {/* Action Button */}
        <Button variant="outline" size="sm" className="gap-2">
          <FileDown className="w-4 h-4" />
          Export PDF
        </Button>
      </div>
    </header>
  );
}
