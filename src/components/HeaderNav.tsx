
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, DollarSign, History, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const HeaderNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: DollarSign },
    { path: "/alerts", label: "Alert Settings", icon: Settings },
    { path: "/history", label: "History", icon: History },
    { path: "/notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">CloudWatch</h1>
                <p className="text-sm text-slate-500">Cost Alerting</p>
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
                        ? "bg-blue-100 text-blue-700"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
            <div className="text-sm text-slate-600">
              Last updated: <span className="font-medium">2 mins ago</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
