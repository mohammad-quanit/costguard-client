
import { Shield, DollarSign } from "lucide-react";

export const Logo = ({ size = "default" }: { size?: "small" | "default" | "large" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-10 h-10", 
    large: "w-16 h-16"
  };

  const iconSizeClasses = {
    small: "h-4 w-4",
    default: "h-6 w-6",
    large: "h-8 w-8"
  };

  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg`}>
      <Shield className={`${iconSizeClasses[size]} text-white absolute`} />
      <DollarSign className={`${iconSizeClasses[size]} text-yellow-300 relative z-10`} strokeWidth={2.5} />
    </div>
  );
};
