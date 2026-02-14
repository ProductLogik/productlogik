import { BarChart3, Upload, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { Progress } from "@/app/components/ui/progress";

const navItems = [
  { name: "Uploads", icon: Upload, href: "#" },
  { name: "Analysis", icon: BarChart3, href: "#", active: true },
  { name: "Settings", icon: Settings, href: "#" },
];

export function Sidebar() {
  return (
    <div className="w-60 border-r border-gray-200 bg-white flex flex-col h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-lg font-semibold tracking-tight text-gray-900">
          ProductLogik
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Logic-Driven Product Intelligence
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  item.active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </a>
          );
        })}
      </nav>

      {/* User Profile & Usage */}
      <div className="border-t border-gray-200 p-4 space-y-4">
        {/* Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">Usage</span>
            <span className="text-gray-900 font-semibold">4/10 credits</span>
          </div>
          <Progress value={40} className="h-1.5" />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs font-medium">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Jane Doe
            </p>
            <p className="text-xs text-gray-500 truncate">jane@company.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
