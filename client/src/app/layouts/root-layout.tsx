import { cn } from "@/lib/utils";
// import SidebarComp from "@/components/sidebar/sidebar-comp";
// import SidebarHeader from "@/components/sidebar/sidebar-header";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { height } from "@/assets/constants/styles";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex md:flex-row flex-col-reverse">
      {/* <SidebarHeader />
      <SidebarComp /> */}
      <ScrollArea className={cn("md:h-screen w-full", height.max)}>
        <div className={cn("mx-auto", height.max)}>{children}</div>
      </ScrollArea>
    </div>
  );
};
export default RootLayout;
