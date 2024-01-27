import { Routes, Route } from "react-router-dom";
import RootLayout from "./components/layouts/root-layout";
import ROUTES from "./configs/routes";
import { Suspense } from "react";
import LoadingPage from "./components/pages/shared/loading-page";

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
          <Layout>
            <ComponentWithSuspense />
          </Layout>
        ) : (
          <ComponentWithSuspense />
        );
        return (
          <Route
            key={index}
            path={path}
            element={
              noLayout ? (
                <ComponentWithSuspense />
              ) : (
                <RootLayout>{Element}</RootLayout>
              )
            }
          />
        );
      })}
    </Routes>
  );
};

export default App;
