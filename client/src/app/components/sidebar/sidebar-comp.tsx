import { FiLogOut } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { navLinks } from "./nav-links";
import { cn } from "../../../lib/utils";
import { motion } from "framer-motion";
import { AVATAR_PLACEHOLDER } from "@/assets/constants/placeholders";
import SidebarProfile from "./sidebar-profile";
import useAuthStore from "@/app/providers/auth-providers";

const SidebarComp = () => {
  const { currentUser } = useAuthStore((state) => state);
  const isSidebarCollapsed = false;
  const pathname = useLocation().pathname;
  const sidebar = {
    open: {
      clipPath: `circle(${1000 * 2 + 200}px at 40px 40px)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    },
    closed: {
      clipPath: "circle(30px at 40px 40px)",
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };
  const itemVariants = {
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
      },
    }),
    closed: {
      y: 100,
      opacity: 0,
    },
  };

  return (
    <>
      <motion.section
        initial={{
          boxShadow: "none",
        }}
        animate={{
          boxShadow: "0px 0px 40px 0px #7C3C9B57",
        }}
        className={cn(
          //  border-r shadow.sm
          "relative transition-all ease-in max-md:border-t max-md:z-20 overflow-x-hidden",
          isSidebarCollapsed ? "" : "xl:w-60"
        )}
      >
        <motion.div
          className="absolute w-full h-full bg-muted -z-10"
          initial={sidebar.closed}
          animate={sidebar.open}
        />
        <motion.div
          className={cn(
            "overflow-hidden md:p-4",
            isSidebarCollapsed ? "" : "xl:p-5"
          )}
        >
          {/* Sidebar logo */}
          <motion.div
            initial={itemVariants.closed}
            animate={itemVariants.open(1)}
            className={cn(
              "hidden pt-4 pb-8 md:flex group",
              isSidebarCollapsed ? "" : "max-xl:justify-center"
            )}
          >
            <Link
              to="/feed"
              className="flex gap-2 transition-opacity group-hover:opacity-60"
            >
              <img src={logo} width={80} height={80} alt="logo" />
            </Link>
          </motion.div>
          {/* User -- Profile */}
          <motion.div
            initial={itemVariants.closed}
            animate={itemVariants.open(2)}
            className={cn(
              "flex-col items-center justify-center hidden",
              isSidebarCollapsed ? "" : "xl:flex"
            )}
          >
            <SidebarProfile />
          </motion.div>
          <motion.hr
            initial={itemVariants.closed}
            animate={{ ...itemVariants.open(3), opacity: 0.1 }}
            className="hidden my-2 border-muted-foreground md:block"
          />

          {/* Sidebar links */}
          <div
            className={cn(
              "flex justify-around gap-2 md:flex-col max-md:w-screen md:justify-between max-md:px-4 max-md:py-2",
              isSidebarCollapsed ? "" : "max-xl:items-center"
            )}
          >
            {navLinks.map((link, index) => (
              <motion.div
                initial={itemVariants.closed}
                animate={itemVariants.open(index + 4)}
                key={index}
                className={cn(link.className)}
              >
                <Link
                  key={index}
                  to={link.path}
                  className={cn(
                    "flex items-center gap-3 p-2 transition-colors rounded-md hover:bg-background w-full"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {pathname.split("/")[1] === link.path.split("/")[1] ? (
                      <link.activeIcon className="w-6 h-6" />
                    ) : (
                      <link.icon className="w-6 h-6" />
                    )}
                    <span
                      className={cn(
                        "hidden",
                        isSidebarCollapsed ? "" : "xl:block"
                      )}
                    >
                      {link.title}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={itemVariants.closed}
              animate={itemVariants.open(navLinks.length + 4)}
            >
              <Link
                className={cn(
                  "cursor-pointer md:pt-2",
                  isSidebarCollapsed ? "" : "xl:hidden"
                )}
                to={`/u/${currentUser?.username}`}
              >
                <img
                  src={currentUser?.profileImg || AVATAR_PLACEHOLDER}
                  width={150}
                  height={150}
                  className="rounded-full object-cover w-6 !h-6"
                />
              </Link>
            </motion.div>
          </div>

          {/*  User -- Logout Container */}
          <div className="relative hidden md:block ">
            <motion.hr
              initial={itemVariants.closed}
              animate={{
                ...itemVariants.open(navLinks.length + 5),
                opacity: 0.1,
              }}
              className="hidden my-4 md:block border-muted-foreground"
            />
            <motion.div
              initial={itemVariants.closed}
              animate={itemVariants.open(navLinks.length + 6)}
              // onClick={handleLogoutUser}
              className={cn(
                "items-center gap-3 p-2 rounded-md cursor-pointer md:flex hover:bg-background",
                isSidebarCollapsed ? "" : "max-xl:justify-center"
              )}
            >
              <FiLogOut className="w-6 h-6" />
              <span
                className={cn("hidden", isSidebarCollapsed ? "" : "xl:block")}
              >
                Logout
              </span>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>
    </>
  );
};

export default SidebarComp;
