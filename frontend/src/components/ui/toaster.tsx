import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";
import { useToast } from "../../hooks/use-toast";
import { IoCloseCircleOutline } from "react-icons/io5";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { cn } from "../../lib/utils";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <ToastIcon variant={props.variant} />
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

const ToastIcon = ({
  variant,
}: {
  variant: "default" | "destructive" | null | undefined;
}) => {
  const classNames = "w-8 h-8";
  switch (variant) {
    case "default":
      return <IoIosCheckmarkCircleOutline className={cn(classNames)} />;
    case "destructive":
      return (
        <IoCloseCircleOutline
          className={cn(classNames, "text-primary-foreground")}
        />
      );
    default:
      return null;
  }
};
