import LastChatsList from "../pages/chats/last-chats-list";

const ChatPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex md:ml-4 h-full w-full">
      <div className="flex w-full">
        <LastChatsList />
        {children}
      </div>
    </div>
  );
};
export default ChatPageLayout;
