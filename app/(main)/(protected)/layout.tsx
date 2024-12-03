import { SessionProvider } from "next-auth/react";
interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SessionProvider>
      <div>
        {children}
      </div>
    </SessionProvider>
  );
};

export default DashboardLayout;
