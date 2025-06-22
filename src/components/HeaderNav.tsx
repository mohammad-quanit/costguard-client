
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, DollarSign, History, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "./Logo";

export const HeaderNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: DollarSign },
    { path: "/alerts", label: "Alert Settings", icon: AlertTriangle },
    { path: "/history", label: "History", icon: History },
    { path: "/notifications", label: "Notifications", icon: Bell },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <Logo />
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">CostGuard</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">AWS Cost Monitoring Platform</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                2
              </Badge>
            </Button>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Last updated: <span className="font-medium">2 mins ago</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
