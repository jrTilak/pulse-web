export default class PostUtils {
  /**
   * Appends the user to each post in the array and sorts the posts by createdAt date in descending order.
   *
   * @param posts - The array of posts.
   * @param user - The user object to be appended to each post.
   * @returns The sorted array of posts with the user appended.
   */
  public static appendUserAndSortPost = (posts: any, user: any) => {
    const resPosts = Object.values(posts).map((post: any) => {
      const postObject = post.toObject();
      return {
        ...postObject,
        owner: user,
      };
    });
    return resPosts.sort((a: any, b: any) => {
      return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
    });
  };

  /**
   * Appends a single user to a post object.
   *
   * @param post - The post object to append the user to.
   * @param user - The user object to append as the owner of the post.
   * @returns The updated post object with the user appended as the owner.
   */
  public static appendSingleUser = (post: any, user: any) => {
    return {
      ...post,
      owner: user,
    };
  };
}
