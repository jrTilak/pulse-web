import shadowSvg from "@/assets/svg/login-svg/shadow.svg";
import mobileSvg from "@/assets/svg/login-svg/mobile.svg";
import documentSvg from "@/assets/svg/login-svg/document.svg";
import avatarStandingSvg from "@/assets/svg/login-svg/avatar-standing.svg";

import { motion } from "framer-motion";

const LoginSvg = () => {
  return (
    <div className="relative object-cover w-full h-full">
      <motion.img
        src={shadowSvg}
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0, scale: 1.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.36, -0.01, 0.5, 1.38] }}
      />
      <motion.img
        src={mobileSvg}
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: [0.36, -0.01, 0.5, 1.38] }}
      />
      <motion.img
        src={documentSvg}
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.36, -0.01, 0.5, 1.38] }}
      />
      <motion.img
        src={avatarStandingSvg}
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.36, -0.01, 0.5, 1.38] }}
      />
    </div>
  );
};
export default LoginSvg;
