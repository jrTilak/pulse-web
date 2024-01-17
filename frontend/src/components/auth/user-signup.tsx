import MotionImg from "../animations/motion-img";
import { motion } from "framer-motion";
import { shadow } from "@/assets/constants/styles";
import LoginSvg from "../svgs/LoginSvg";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import GoogleLogin from "./methods/GoogleLogin";
import GuestLogin from "./methods/GuestLogin";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Button } from "../ui/button";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { AuthValidator, EmailUserType } from "@/validators/auth-validators";
import Loading from "react-loading";
import { toast } from "@/hooks/use-toast";
import { useAuthContext } from "@/hooks/use-auth";
import { UserAuthHandler } from "@/handlers/auth-handlers";
import { StringUtils } from "@/utils/string-utils";

const UserSignup = () => {
  const { setCurrentUser, setIsAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState(
    "password" as "password" | "text"
  );
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({} as EmailUserType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const handlePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (isSubmitting) return;
    e.preventDefault();
    const isValid = AuthValidator.validateEmailUser({
      ...formData,
      username: StringUtils.makeUsername(formData.name),
    });
    if (!isValid.success) {
      toast({
        title: "Error",
        description: isValid.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    submitBtnRef.current?.style.setProperty("cursor", "wait");
    const res = await UserAuthHandler.createEmailUser(isValid.data);
    submitBtnRef.current?.style.setProperty("cursor", "pointer");
    setIsSubmitting(false);
    if (!res.success) {
      toast({
        title: "Error",
        description: res.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    setCurrentUser(res.data);
    setIsAuthenticated(true);
    navigate("/feed");
  };

  return (
    <div className="relative min-h-screen bg-muted flex justify-center sm:max-h-[90vh] overflow-hidden">
      <MotionImg className="right-0 bottom-0" />
      <MotionImg className="hidden lg:block left-0 top-0" />
      <motion.div
        //scale up
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.4 } }}
        className={cn(
          "flex justify-center items-center flex-1 max-w-screen-xl m-0 shadow flex-reverse sm:m-10  sm:rounded-lg flex-row-reverse",
          shadow.sm
        )}
      >
        <div className="flex-1 hidden w-full h-full text-center lg:flex">
          <LoginSvg />
        </div>
        <div className="z-10 p-6 lg:w-1/2 xl:w-5/12 sm:p-12">
          <Link to="/">
            <img
              src={logo}
              className="relative w-32 transition-opacity w-mx-auto hover:opacity-60"
            />
          </Link>
          <div className="flex flex-col items-center mt-2">
            <div className="flex-1 w-full mt-8">
              <div className="flex flex-col items-center gap-4">
                <GoogleLogin />
                <GuestLogin />
              </div>
              <div className="my-6 text-center border-b">
                <div className="inline-block px-2 text-sm font-medium leading-none tracking-wide text-gray-600 transform translate-y-1/2 bg-transparent">
                  OR
                </div>
              </div>

              <form
                onSubmit={(e) => handleSubmit(e)}
                className="flex flex-col max-w-xs gap-4 mx-auto"
              >
                <motion.input
                  whileHover={{ scale: 1.05 }}
                  autoFocus
                  className="w-full px-4 py-3 text-sm font-medium border border-gray-200 rounded-lg bg-muted placeholder-muted-foreground placeholder:opacity-40 focus:outline-none focus:border-gray-400 focus:bg-background"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  onChange={(e) => handleChange(e)}
                  value={formData.name}
                />
                <motion.input
                  whileHover={{ scale: 1.05 }}
                  className="w-full px-4 py-3 text-sm font-medium border border-gray-200 rounded-lg bg-muted placeholder-muted-foreground placeholder:opacity-40 focus:outline-none focus:border-gray-400 focus:bg-background"
                  type="email"
                  placeholder="yourname@example.com"
                  id="email"
                  name="email"
                  onChange={(e) => handleChange(e)}
                  value={formData.email}
                />
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <motion.input
                    ref={passwordInputRef}
                    className="w-full px-4 py-3 text-sm font-medium border border-gray-200 rounded-lg bg-muted placeholder-muted-foreground placeholder:opacity-40 focus:outline-none focus:border-gray-400 focus:bg-background"
                    type={passwordType}
                    placeholder="Enter a password"
                    id="password"
                    name="password"
                    onChange={(e) => handleChange(e)}
                    value={formData.password}
                  />
                  {formData.password &&
                    (passwordType === "password" ? (
                      <HiOutlineEyeSlash
                        onClick={handlePasswordVisibility}
                        className="absolute cursor-pointer text-muted-foreground right-3 inset-y-1/2 -translate-y-1/2"
                      />
                    ) : (
                      <HiOutlineEye
                        onClick={handlePasswordVisibility}
                        className="absolute cursor-pointer text-muted-foreground right-3 inset-y-1/2 -translate-y-1/2"
                      />
                    ))}
                </motion.div>
                <Button
                  type="submit"
                  ref={submitBtnRef}
                  className={cn(
                    "flex items-center transition-all group gap-2",
                    isSubmitting && "cursor-not-allowed, opacity-50"
                  )}
                >
                  <span>Sign Up</span>
                  {isSubmitting ? (
                    <Loading type="spin" color="#000" height={20} width={20} />
                  ) : (
                    <IoIosArrowRoundForward className="w-6 h-6 transition-transform group-hover:translate-x-4" />
                  )}
                </Button>
                <p className="mt-2 text-xs text-center text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="border-b border-gray-500 border-dotted text-primary"
                  >
                    login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default UserSignup;
