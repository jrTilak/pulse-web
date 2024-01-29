import { Routes, Route } from "react-router-dom";
import RootLayout from "@/app/layouts/root-layout";
import ROUTES from "@/configs/routes";
import { Suspense } from "react";
import LoadingPage from "@/app/pages/shared/loading-page";
import AuthWrapper from "@/app/layouts/auth-wrapper";

const App = () => {
  return (
    <Routes>
      {ROUTES.map(({ path, Layout, Component, noLayout }, index) => {
        const ComponentWithSuspense = () => (
          <Suspense fallback={<LoadingPage />}>
            <Component />
          </Suspense>
        );
        const Element = Layout ? (
          <Suspense fallback={<LoadingPage />}>
            <Layout>
              <ComponentWithSuspense />
            </Layout>
          </Suspense>
        ) : (
          <ComponentWithSuspense />
        );
        return (
          <Route
            key={index}
            path={path}
            element={
              <AuthWrapper>
                {noLayout ? (
                  <ComponentWithSuspense />
                ) : (
                  <RootLayout>{Element}</RootLayout>
                )}
              </AuthWrapper>
            }
          />
        );
      })}
    </Routes>
  );
};

export default App;
