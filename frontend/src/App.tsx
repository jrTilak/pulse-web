import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/landing/landing-page";
import RootLayout from "./components/layouts/root-layout";
import UserLogin from "./components/auth/user-login";
import UserSignup from "./components/auth/user-signup";
interface RouteType {
  path: string;
  Layout?: ({ children }: { children: React.ReactNode }) => JSX.Element;
  noLayout?: boolean;
  Component: () => JSX.Element;
}

const routes: RouteType[] = [
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: UserLogin,
    noLayout: true,
  },
  {
    path: "/signup",
    Component: UserSignup,
    noLayout: true,
  },
];

const App = () => {
  return (
    <Routes>
      {routes.map(({ path, Layout, Component, noLayout }, index) => {
        const Element = Layout ? (
          <Layout>
            <Component />
          </Layout>
        ) : (
          <Component />
        );
        return (
          <Route
            key={index}
            path={path}
            element={
              noLayout ? <Component /> : <RootLayout>{Element}</RootLayout>
            }
          />
        );
      })}
    </Routes>
  );
};

export default App;
