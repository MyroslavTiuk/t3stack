import { Raleway } from "next/font/google";
import React from "react";
import HeaderComponent from "~/components/FlowBite/Header";
import { SidebarComponent } from "~/components/FlowBite/SideBar";
import { useSession } from "next-auth/react";
import AppFooter from "~/components/layout/AppFooter";
import { usePathname } from "next/navigation";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});
const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] =
    React.useState<boolean>(true);
  const session = useSession();
  function toggleSidebar() {
    setSidebarCollapsed(!isSidebarCollapsed);
  }
  const path = usePathname();
  return (
    <>
      {session.status === "authenticated" &&
      session.data.user.subscriptionActive &&
      !path.includes("subscription") ? (
        <>
          <SidebarComponent
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            setSidebarCollapsed={setSidebarCollapsed}
          />
          <div className="flex w-full pt-6 lg:pt-0">
            <div className="mt-10 flex min-h-[100vh] w-full flex-col justify-start bg-white lg:ml-64 lg:mt-0">
              <main className="min-h-screen gap-4">
                <HeaderComponent toggleSidebar={toggleSidebar} />
                <div className={raleway.className}>{children}</div>
              </main>
              <AppFooter />
            </div>
          </div>
        </>
      ) : (
        <main className="min-h-screen">
          <div className={raleway.className}>{children}</div>
        </main>
      )}
    </>
  );
};
export default RootLayout;
