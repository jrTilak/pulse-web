import { COVER_PLACEHOLDER } from "@/assets/constants/placeholders";
import { shadow } from "@/assets/constants/styles";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { PiChatsCircle } from "react-icons/pi";
import Loading from "react-loading";
import UploadImageButton from "./upload-image-btn";
import ProfileInfo from "./profile-info";
import UserAvatar from "@/app/components/avatars/user-avatar";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/app/providers/auth-providers";
import ChatUtils from "@/utils/chat-utils";
import useUserProfileStore from "@/app/providers/user-profile-provider";
import { Skeleton } from "@/app/components/ui/skeleton";
import UserBio from "./user-bio";
import SocialLinkBadge from "@/app/components/badges/social-link-badge";
import AddSocialLinkButton from "./add-social-link-button";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore((state) => state);
  const { user, isLoading } = useUserProfileStore();
  const isOwner = user?.username === currentUser?.username;
  const isFollowing = false;
  const isFollowersUpdating = false;
  const [isPhotoUploading, setIsPhotoUploading] = useState(
    false as "cover" | "profile" | false
  );

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
            {isLoading && (
              <Skeleton className="absolute inset-0 w-full h-full" />
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
                    {isLoading && (
                      <Skeleton className="absolute inset-0 w-full h-full rounded-full" />
                    )}
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
                    <span className="font-semibold">
                      {user?.following || 0}
                    </span>
                    Following
                  </Button>
                  <hr className="w-px h-6 rounded md:mx-2 bg-muted-foreground opacity-40" />
                  <Button
                    variant="ghost"
                    className="flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="font-semibold">
                      {user?.followers || 0}
                    </span>
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
                            `/chats/${ChatUtils.createChatId(
                              user?._id || "",
                              currentUser?._id || ""
                            )}`
                          );
                        }}
                        variant="outline"
                      >
                        <PiChatsCircle className="w-6 h-6" />
                      </Button>
                      {isFollowing ? (
                        <Button
                          // onClick={() => handleFollowUser(false)}
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
                          // onClick={() => handleFollowUser(true)}
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
                  {
                    isLoading && (
                      <>
                        <Skeleton className="w-24 h-10" />
                        <Skeleton className="w-24 h-10" />
                      </>
                    ) /* <!-- Follow Button --> */
                  }
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
                <span className="text-lg font-semibold">Bio</span>
                {!isLoading ? <UserBio /> : <Skeleton className="h-10" />}

                {!isLoading ? (
                  user?.socialLinks?.map((link) => (
                    <SocialLinkBadge socialLink={link} key={link.url} />
                  ))
                ) : (
                  <Skeleton className="h-6 rounded-sm" />
                )}
                {isOwner && <AddSocialLinkButton />}
              </div>
              <div className="h-full blank"></div>
            </div>
            {/* <div className="flex flex-col col-span-4 gap-4 rounded-md">
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
            </div> */}
          </div>
        </div>
      </section>
    </>
  );
};
export default Profile;
