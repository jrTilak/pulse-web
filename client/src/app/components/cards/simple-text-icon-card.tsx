import { shadow } from "@/assets/constants/styles";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IconType } from "react-icons";
interface SimpleTextIconCardProps {
  text: string;
  Icon: IconType;
  href?: string;
  action?: () => void;
  className?: string;
}
const SimpleTextIconCard = ({
  text,
  Icon,
  href,
  action,
  className,
}: SimpleTextIconCardProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (href) {
      navigate(href);
    } else if (action) {
      action();
    }
  };
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className={cn(
        "w-[80vw] md:w-52 bg-muted rounded-md flex items-center justify-center flex-col cursor-pointer aspect-[2/1] md:aspect-[1/2]",
        shadow.sm,
        className
      )}
    >
      <span className="text-lg font-semibold text-center">{text}</span>
      <Icon className="text-3xl" />
    </motion.div>
  );
};
export default SimpleTextIconCard;
