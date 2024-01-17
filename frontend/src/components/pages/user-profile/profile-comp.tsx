import { COVER_PLACEHOLDER } from "@/assets/constants/placeholders";
import { shadow } from "@/assets/constants/styles";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { PiChatsCircle } from "react-icons/pi";
import Loading from "react-loading";
import UploadImageButton from "./upload-image-btn";
import ProfileInfo from "./profile-info";
import UserBio from "./user-bio";
import SocialLinkBadge from "@/components/shared/badges/social-link-badge";
import { AddSocialLinkBtn } from "./add-social-link-btn";
import CreatePostCard from "@/components/shared/cards/create-post-card";
import { toast } from "@/hooks/use-toast";
import { useAuthContext } from "@/hooks/use-auth";
import UserAvatar from "@/components/shared/avatars/user-avatar";
import { PostType } from "@/types/post.types";
import PostComponent from "@/components/shared/post/post-component";
import { useNavigate } from "react-router-dom";
import UserHandler from "@/handlers/user-handlers";
import { useProfilePageContext } from "@/hooks/use-profile-page";
import ChatUtils from "@/utils/chat-utils";

const Profile = () => {
  const { user, isOwner, setUser, posts, setPosts } = useProfilePageContext();
  const navigate = useNavigate();
  const {
    setCurrentUser,
    currentUserFollowingList,
    setCurrentUserFollowingList,
    currentUser,
  } = useAuthContext();
  const [isPhotoUploading, setIsPhotoUploading] = useState(
    false as "cover" | "profile" | false
  );
  const [isFollowersUpdating, setIsFollowersUpdating] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(currentUserFollowingList.includes(user._id));
  }, [currentUserFollowingList]);

  const handleFollowUser = async (isToFolllow: boolean = true) => {
    setIsFollowersUpdating(true);
    const res = await UserHandler.followUser(user.username, isToFolllow);
    setIsFollowersUpdating(false);
    if (!res.success) {
      toast({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
      return;
    }
    setCurrentUser(res.data.user);
    setUser(res.data.userToFollow);
    if (isToFolllow) {
      setCurrentUserFollowingList([
        ...currentUserFollowingList,
        res.data.userToFollow._id,
      ]);
    } else {
      setCurrentUserFollowingList(
        currentUserFollowingList.filter(
          (id) => id !== res.data.userToFollow._id
        )
      );
    }
  };

  return (
    <>
      <section className="w-full max-w-4xl mx-auto pb-4 sm:pb-8">
        <div>
          <div
            className="relative w-full bg-no-repeat bg-cover"
            style={{
              height: "300px",
              backgroundImage: `url(${user?.coverImg || COVER_PLACEHOLDER})`,
            }}
          >
            {isOwner && (
              <UploadImageButton
                type="cover"
                setIsPhotoUploading={setIsPhotoUploading}
                isPhotoUploading={isPhotoUploading}
              />
            )}
            {isPhotoUploading === "cover" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Loading type="spin" color="#fff" height={40} width={40} />
              </div>
            )}
          </div>
          <div className={cn("p-4 rounded-b-md", shadow.sm)}>
            <div className="relative flex w-full">
              {/* <!-- Avatar --> */}
              <div className="flex flex-1">
                <div className="-mt-24">
                  <div className="relative rounded-full h-36 w-36">
                    <UserAvatar
                      user={user}
                      className="relative object-cover object-center border-4 rounded-full border-background h-36 w-36"
                    />
                    {isOwner && (
                      <UploadImageButton
                        type="profile"
                        setIsPhotoUploading={setIsPhotoUploading}
                        isPhotoUploading={isPhotoUploading}
                      />
                    )}
                    {
                      isPhotoUploading === "profile" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                          <Loading
                            type="spin"
                            color="#fff"
                            height={40}
                            width={40}
                          />
                        </div>
                      ) /* <!-- Online Status Badge --> */
                    }
                  </div>
                </div>
              </div>
              {/* <!-- Follow Button --> */}
              <div className="flex items-center justify-end w-full gap-2 text-right md:justify-between">
                <div className="items-center hidden gap-0 md:flex">
                  <Button
                    variant="ghost"
                    className="flex items-center justify-center gap-1 cursor-pointer hover:bg-none"
                  >
                    <span className="font-semibold">{user.following || 0}</span>
                    Following
                  </Button>
                  <hr className="w-px h-6 rounded md:mx-2 bg-muted-foreground opacity-40" />
                  <Button
                    variant="ghost"
                    className="flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="font-semibold">{user.followers || 0}</span>
                    Followers
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  {isOwner ? (
                    <>
                      <Button variant="ghost" className="p-2 rounded-full">
                        <IoSettingsOutline className="w-6 h-6" />
                      </Button>
                      <Button variant="outline">Edit Profile</Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          navigate(
                            `/chats/${ChatUtils.createChatId(user._id, currentUser._id)}`
                          );
                        }}
                        variant="outline"
                      >
                        <PiChatsCircle className="w-6 h-6" />
                      </Button>
                      {isFollowing ? (
                        <Button
                          onClick={() => handleFollowUser(false)}
                          variant="secondary"
                          className="sm:min-w-[80px]"
                        >
                          {isFollowersUpdating ? (
                            <Loading
                              type="spin"
                              color="#fff"
                              height={20}
                              width={20}
                            />
                          ) : (
                            "Unfollow"
                          )}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleFollowUser(true)}
                          variant="default"
                          className="sm:min-w-[80px]"
                        >
                          {isFollowersUpdating ? (
                            <Loading
                              type="spin"
                              color="#fff"
                              height={20}
                              width={20}
                            />
                          ) : (
                            "Follow"
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <ProfileInfo />
          </div>
          <div className="flex flex-col grid-cols-6 gap-4 mt-4 md:grid">
            <div className="flex flex-col col-span-2">
              <div
                className={cn(
                  " rounded-md relative p-4 text-muted-foreground flex flex-col gap-4 max-h-max group",
                  shadow.sm
                )}
              >
                <span className="text-lg font-semibold">Info</span>
                <UserBio />
                {user?.socialLinks?.map((link) => (
                  <SocialLinkBadge socialLink={link} key={link.url} />
                ))}
                {isOwner && <AddSocialLinkBtn />}
              </div>
              <div className="h-full blank"></div>
            </div>
            <div className="flex flex-col col-span-4 gap-4 rounded-md">
              {isOwner && <CreatePostCard />}
              {posts.map(
                (post) =>
                  post.isPinned && (
                    <PostComponent
                      key={post._id}
                      post={post as PostType}
                      setUserPosts={setPosts}
                      isPinned={true}
                    />
                  )
              )}
              {posts.map(
                (post) =>
                  !post.isPinned && (
                    <PostComponent
                      key={post._id}
                      post={post as PostType}
                      setUserPosts={setPosts}
                      isPinned={false}
                    />
                  )
              )}

              <span className="flex items-center justify-center w-full h-full text-xl font-semibold text-center text-muted-foreground">
                {posts.length === 0 ? "No posts yet!" : "End of posts!"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Profile;
