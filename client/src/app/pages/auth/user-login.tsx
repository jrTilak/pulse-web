import { cn } from "@/lib/utils";
import MotionImg from "@/app/components/animations/motion-img";
import { motion } from "framer-motion";
import { shadow } from "@/assets/constants/styles";
import LoginSvg from "@/app/components/svgs/LoginSvg";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import GoogleLogin from "./methods/GoogleLogin";
import GuestLogin from "./methods/GuestLogin";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Button } from "@/app/components/ui/button";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { useState } from "react";
import Loading from "react-loading";
import toast from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  AuthValidator,
  LoginCredentialsType,
} from "@/validators/auth-validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserAuthHandler } from "@/handlers/auth-handlers";

const UserLogin = () => {
  const [passwordType, setPasswordType] = useState(
    "password" as "password" | "text"
  );
  const redirect = useSearchParams()[0].get("redirect");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentialsType>({
    resolver: zodResolver(AuthValidator.loginCredentialsSchema),
  });

  const handlePasswordVisibility = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const onSubmit: SubmitHandler<LoginCredentialsType> = async (data) => {
    UserAuthHandler.loginUser(data)
      .then(() => {
        navigate(redirect || "/feed");
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <div className="relative min-h-[100svh] bg-muted flex justify-center sm:max-h-[90vh] overflow-hidden">
      <MotionImg className="right-0 top-0" />
      <MotionImg className="hidden lg:block left-0 bottom-0" />
      <motion.div
        //scale up
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.4 } }}
        className={cn(
          "flex justify-center items-center flex-1 max-w-screen-xl m-0 shadow flex-reverse sm:m-10  sm:rounded-lg flex-row",
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
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col max-w-xs gap-2 mx-auto"
              >
                <motion.input
                  autoFocus
                  whileHover={{ scale: 1.05 }}
                  className="w-full px-4 py-3 text-sm font-medium border border-gray-200 rounded-lg bg-muted placeholder-muted-foreground placeholder:opacity-40 focus:outline-none focus:border-gray-400 focus:bg-background"
                  type="email"
                  placeholder="yourname@example.com"
                  id="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 opacity-80">
                    {errors.email.message}
                  </p>
                )}
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <motion.input
                    className="w-full px-4 py-3 text-sm font-medium border border-gray-200 rounded-lg bg-muted placeholder-muted-foreground placeholder:opacity-40 focus:outline-none focus:border-gray-400 focus:bg-background"
                    type={passwordType}
                    placeholder="Enter a password"
                    id="password"
                    {...register("password")}
                  />
                  {passwordType === "password" ? (
                    <HiOutlineEyeSlash
                      onClick={handlePasswordVisibility}
                      className="absolute cursor-pointer text-muted-foreground right-3 top-3"
                    />
                  ) : (
                    <HiOutlineEye
                      onClick={handlePasswordVisibility}
                      className="absolute cursor-pointer text-muted-foreground right-3 top-3"
                    />
                  )}
                </motion.div>
                {errors.password && (
                  <p className="text-xs text-red-500 opacity-80">
                    {errors.password.message}
                  </p>
                )}
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  role="submit"
                  className={cn(
                    "flex items-center transition-all group gap-2",
                    isSubmitting && "cursor-not-allowed, opacity-50"
                  )}
                >
                  <span>Login</span>
                  {isSubmitting ? (
                    <Loading type="spin" color="#000" height={20} width={20} />
                  ) : (
                    <IoIosArrowRoundForward className="w-6 h-6 transition-transform group-hover:translate-x-4" />
                  )}
                </Button>
                <p className="mt-2 text-sm text-center text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to={`/signup${redirect ? `?redirect=${redirect}` : ""}`}
                    className="border-b border-gray-500 border-dotted text-primary"
                  >
                    sign up{" "}
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
export default UserLogin;
