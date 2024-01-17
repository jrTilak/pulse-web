import { cn } from "@/lib/utils";
import blob from "@/assets/svg/individual/blob.svg";
import { motion } from "framer-motion";
const MotionImg = ({ className }: { className: string }) => {
  return (
    <motion.img
      //scale up
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.2, transition: { duration: 0.4 } }}
      exit={{ scale: 0, opacity: 0 }}
      src={blob}
      className={cn(
        "absolute filter h-[50%] w-[50%] blur-2xl opacity-20",
        className
      )}
    />
  );
};

export default MotionImg;
