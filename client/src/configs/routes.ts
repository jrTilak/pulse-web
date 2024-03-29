import React from "react";

const LandingPage = React.lazy(
  () => import("@/app/pages/landing/landing-page")
);
const UserLogin = React.lazy(() => import("@/app/pages/auth/user-login"));
const UserSignup = React.lazy(() => import("@/app/pages/auth/user-signup"));
const FeedPage = React.lazy(() => import("@/app/pages/feed/feed-page"));
const ProfilePage = React.lazy(
  () => import("@/app/pages/user-profile/profile-page")
);
const CreateNew = React.lazy(() => import("@/app/pages/new/create-new"));
const CreateNewStory = React.lazy(
  () => import("@/app/pages/new/new-story/create-new-story")
);
const CreateNewPost = React.lazy(
  () => import("@/app/pages/new/new-post/create-new-post")
);
const SearchPage = React.lazy(
  () => import("@/app/pages/search/search-page")
);
// const NotificationPage = React.lazy(
//   () => import("@/app/pages/notifications/notification-page")
// );
const OpenAChat = React.lazy(
  () => import("@/app/pages/chats/open-a-chat")
);
const ChatsOneToOne = React.lazy(
  () => import("@/app/pages/chats/chat-one-to-one")
);
const ChatPageLayout = React.lazy(
  () => import("@/app/layouts/chat-page-layout")
);
const Error404Page = React.lazy(() => import("@/app/pages/error/404"));

interface RouteType {
  path: string;
  Layout?: React.LazyExoticComponent<
    ({ children }: { children: React.ReactNode }) => JSX.Element
  >;
  noLayout?: boolean;
  Component: React.LazyExoticComponent<() => JSX.Element>;
}

const ROUTES: RouteType[] = [
  {
    path: "/",
    Component: LandingPage,
    noLayout: true,
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
  // {
  //   path: "/notification",
  //   Component: NotificationPage,
  // },
  {
    path: "/chats",
    Component: OpenAChat,
    Layout: ChatPageLayout,
  },
  {
    path: "/chats/:chatId",
    Component: ChatsOneToOne,
    Layout: ChatPageLayout,
  },
  {
    path: "*",
    Component: Error404Page,
  },
];

export default ROUTES;
