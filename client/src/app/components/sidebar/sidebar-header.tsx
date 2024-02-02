import { Link } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { IoNotifications } from "react-icons/io5";
const SidebarHeader = () => {
  return (
    <header className="flex fixed top-0 left-0 right-0 items-center justify-between px-6 py-3 border-b h-12 border-muted md:hidden z-40">
      <Link to="/feed" className="flex justify-center md:hidden">
        <img src={logo} width={40} height={40} alt="logo" />
      </Link>

      <div className="flex items-center">
        <Link to="/notification">
          <IoNotifications className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
};
export default SidebarHeader;
