import chattingSvg from "@/assets/svg/individual/chatting.svg";
const OpenAChat = () => {
  return (
    <div className="p-4 w-full h-full flex-col m-auto justify-center gap-0 hidden md:flex">
      <img src={chattingSvg} alt="chatting" className="w-96 mx-auto" />
      <p className="text-center">
        Select a chat on the left to start messaging or create a new chat.
      </p>
    </div>
  );
};
export default OpenAChat;
