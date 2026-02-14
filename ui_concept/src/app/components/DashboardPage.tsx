import { Sidebar } from "@/app/components/Sidebar";
import { Header } from "@/app/components/Header";
import { PriorityCard } from "@/app/components/PriorityCard";
import { ThemeExplorer } from "@/app/components/ThemeExplorer";
import { AgileHealth } from "@/app/components/AgileHealth";

export function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main Content Area - 3 Column Grid */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="grid grid-cols-3 gap-6">
              {/* Column 1: The Priorities */}
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  The Priorities
                  <span className="block text-xs font-normal text-gray-500 mt-1">
                    Executive Summary
                  </span>
                </h2>
                <PriorityCard
                  title="Fix Mobile Login"
                  priority="high"
                  mentions={34}
                />
                <PriorityCard
                  title="Export to CSV is slow"
                  priority="medium"
                  mentions={12}
                />
                <PriorityCard
                  title="Dark Mode request"
                  priority="low"
                  mentions={8}
                />
              </div>

              {/* Column 2: Theme Explorer */}
              <div>
                <ThemeExplorer />
              </div>

              {/* Column 3: Agile Health */}
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                  Anti-Pattern Detector
                </h2>
                <AgileHealth />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
