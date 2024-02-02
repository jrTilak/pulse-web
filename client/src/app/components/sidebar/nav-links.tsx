import {
  IoHomeOutline,
  IoHome,
  IoSearchOutline,
  IoSearchSharp,
  IoNotifications,
} from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { PiChatsCircle, PiChatsCircleBold } from "react-icons/pi";
import { BsPlusCircle } from "react-icons/bs";

export const navLinks = [
  {
    title: "Home",
    path: "/feed",
    icon: IoHomeOutline,
    activeIcon: IoHome,
  },
  {
    title: "Search",
    path: "/search",
    icon: IoSearchOutline,
    activeIcon: IoSearchSharp,
  },
  {
    title: "Create",
    path: "/new",
    icon: BsPlusCircle,
    activeIcon: BsPlusCircle,
    className: "md:hidden flex",
  },
  {
    title: "Notification",
    path: "/notification",
    icon: IoMdNotificationsOutline,
    activeIcon: IoNotifications,
    className: "hidden md:flex",
  },
  {
    title: "Messages",
    path: "/chats",
    icon: PiChatsCircle,
    activeIcon: PiChatsCircleBold,
  },
  {
    title: "Create",
    path: "/new",
    icon: BsPlusCircle,
    activeIcon: BsPlusCircle,
    className: "hidden md:flex",
  },
];
