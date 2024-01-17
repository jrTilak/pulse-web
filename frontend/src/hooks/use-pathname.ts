import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const usePathname = () => {
  const location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  return pathname;
};

export default usePathname;
