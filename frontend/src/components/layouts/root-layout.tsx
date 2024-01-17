import { cn } from "@/lib/utils";
// import SidebarComp from "../shared/sidebar/sidebar-comp";
// import SidebarHeader from "../shared/sidebar/sidebar-header";
import { ScrollArea } from "../ui/scroll-area";
import { height } from "@/assets/constants/styles";
// import CallingPage from "../pages/call/calling-page";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex md:flex-row flex-col-reverse">
      {/* <SidebarHeader />
      <SidebarComp /> */}
      <ScrollArea className={cn("md:h-screen w-full", height.max)}>
        <div className={cn("mx-auto", height.max)}>{children}</div>
      </ScrollArea>
      {/* <CallingPage /> */}
    </div>
  );
};
export default RootLayout;
