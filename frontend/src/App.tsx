import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/landing/landing-page";
import RootLayout from "./components/layouts/root-layout";
import UserLogin from "./components/auth/user-login";
import UserSignup from "./components/auth/user-signup";
import FeedPage from "./components/pages/feed/feed-page";
import ProfilePage from "./components/pages/user-profile/profile-page";
import CreateNew from "./components/pages/new/create-new";
import CreateNewStory from "./components/pages/new/new-story/create-new-story";
import CreateNewPost from "./components/pages/new/new-post/create-new-post";
import SearchPage from "./components/pages/search/search-page";
import NotificationPage from "./components/pages/notifications/notification-page";
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
  {
    path: "/feed",
    Component: FeedPage,
  },
  {
    path: "/u/:username",
    Component: ProfilePage,
  },
  {
    path: "/new",
    Component: CreateNew,
  },
  {
    path: "/new/story",
    Component: CreateNewStory,
  },
  {
    path: "/new/story/:type",
    Component: CreateNewStory,
  },
  {
    path: "/new/post",
    Component: CreateNewPost,
  },
  {
    path: "/search",
    Component: SearchPage,
  },
  {
    path: "/search/:searchQuery",
    Component: SearchPage,
  },
  {
    path: "/notification",
    Component: NotificationPage,
  },
  {
    path: "*",
    Component: () => <h1>404</h1>,
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
