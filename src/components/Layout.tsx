
import { HeaderNav } from "./HeaderNav";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <HeaderNav />
      {children}
    </div>
  );
};
