"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendSingleUser = exports.appendUserAndSortPost = void 0;
/**
 * Appends the user to each post in the array and sorts the posts by createdAt date in descending order.
 *
 * @param posts - The array of posts.
 * @param user - The user object to be appended to each post.
 * @returns The sorted array of posts with the user appended.
 */
const appendUserAndSortPost = (posts, user) => {
    const resPosts = Object.values(posts).map((post) => {
        const postObject = post.toObject();
        return {
            ...postObject,
            owner: user,
        };
    });
    return resPosts.sort((a, b) => {
        return new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf();
    });
};
exports.appendUserAndSortPost = appendUserAndSortPost;
/**
 * Appends a single user to a post object.
 *
 * @param post - The post object to append the user to.
 * @param user - The user object to append as the owner of the post.
 * @returns The updated post object with the user appended as the owner.
 */
const appendSingleUser = (post, user) => {
    return {
        ...post,
        owner: user,
    };
};
exports.appendSingleUser = appendSingleUser;
//# sourceMappingURL=post.utils.js.map