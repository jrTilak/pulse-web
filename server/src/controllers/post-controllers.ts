import { Request, Response } from "express";
import Post from "../schema/Post";
import User from "../schema/User";
import Draft from "../schema/Draft";
import UserPrivateInfo from "../schema/UserPrivateInfo";
import ResponseController from "./reponse-controllers";
import PostUtils from "../utils/post-utils";
import mongoose from "mongoose";

export class PostController {
  /**
   * Creates a new post.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the created post.
   */
  public static createNewPost = async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      const user = await User.findOne({ _id: res.locals.jwtData.id });
      const newPost = new Post({
        content,
        createdBy: user._id,
      });
      await newPost.save();
      // update user's posts in User schema
      await User.findOneAndUpdate(
        { _id: user._id },
        { $push: { posts: newPost._id } },
        { new: true }
      );
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Post created successfully!",
        data: newPost,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Retrieves all posts created by a specific user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A response with the user's posts.
   */
  public static getAllPosts = async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      if (!user) {
        ResponseController.Handle404Error(res, []);
      }
      const posts = await Post.find({ createdBy: user._id });

      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Posts found!",
        data: PostUtils.appendUserAndSortPost(posts, user),
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Creates a new draft post.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns The response with the created draft post.
   */
  public static createDraft = async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      const newDraft = new Draft({
        content,
        createdBy: res.locals.jwtData.id,
      });
      await newDraft.save();
      await UserPrivateInfo.findOneAndUpdate(
        { userId: res.locals.jwtData.id },
        { $push: { drafts: newDraft._id } },
        { new: true }
      );
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Draft created successfully!",
        data: newDraft,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Retrieves the saved posts id for the authenticated user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A success response with the saved posts data or an error response.
   */
  public static getSavedPosts = async (req: Request, res: Response) => {
    try {
      const userId = new mongoose.Types.ObjectId(res.locals.jwtData.id);
      const userPrivateInfo = await UserPrivateInfo.findOne({
        userId,
      });
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Posts found!",
        data: userPrivateInfo?.savedPosts || [],
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Deletes a post.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A response indicating the success or failure of the operation and the updated user.
   */
  public static deletePost = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId);
      if (!post) {
        return ResponseController.Handle404Error(res, []);
      }
      if (post.createdBy.toString() !== res.locals.jwtData.id) {
        return ResponseController.HandleUnauthorizedError(res, []);
      }
      await Post.findByIdAndDelete(postId);
      const user = await User.findOneAndUpdate(
        { _id: res.locals.jwtData.id },
        { $pull: { posts: postId } },
        { new: true }
      );

      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Post deleted successfully!",
        data: user,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Toggles the pin status of a post.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the updated post or an error response.
   */
  public static togglePinPost = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId;
      const isToPin = req.method === "POST";
      const post = await Post.findById(postId);
      if (!post) {
        return ResponseController.Handle404Error(res, []);
      }
      if (post.createdBy.toString() !== res.locals.jwtData.id) {
        return ResponseController.HandleUnauthorizedError(res, []);
      }

      post.isPinned = isToPin;
      await post.save();

      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Post pinned successfully!",
        data: post,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Toggles the save status of a post for the authenticated user.
   * If the post is already saved, it will be removed from the saved posts list.
   * If the post is not saved, it will be added to the saved posts list.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A success response with status 200 if the operation is successful, or a 500 error response if an error occurs.
   */
  public static toggleSavePost = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId;
      const isToSave = req.method === "POST";

      await UserPrivateInfo.findOneAndUpdate(
        { userId: res.locals.jwtData.id },
        isToSave
          ? { $addToSet: { savedPosts: postId } }
          : { $pull: { savedPosts: postId } },
        { new: true }
      );

      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Post saved successfully!",
        data: {},
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Toggles the like status of a post.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the updated post or an error response.
   */
  public static toggleLikePost = async (req: Request, res: Response) => {
    try {
      const postId = req.params.postId;
      const isToLike = req.method === "POST";

      const post = await Post.findByIdAndUpdate(
        postId,
        isToLike
          ? { $push: { likes: res.locals.jwtData.id } }
          : { $pull: { likes: res.locals.jwtData.id } },
        { new: true }
      );

      if (!post) {
        return ResponseController.Handle404Error(res, []);
      }

      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Post liked successfully!",
        data: post,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Adds a comment to a post.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the updated post with the added comment.
   */
  public static addComment = async (req: Request, res: Response) => {
    try {
      const { comment } = req.body;
      const newPost = await Post.findOneAndUpdate(
        { _id: req.params.postId },
        {
          $push: {
            comments: {
              content: comment,
              createdBy: res.locals.jwtData.id,
              createdAt: Date.now(),
            },
          },
        },
        { new: true }
      );

      if (!newPost) {
        return ResponseController.Handle404Error(res, []);
      }

      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Comment added successfully!",
        data: newPost.comments,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Retrieves relevant posts based on the user's following list and random posts.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the response containing the relevant posts.
   */
  public static getRelevantPost = async (req: Request, res: Response) => {
    const { neglect } = req.query;
    const toNeglect = neglect ? (neglect as string).split(",") : [];

    try {
      const post = await Post.findOne({
        _id: { $nin: toNeglect },
        createdBy: { $nin: res.locals.jwtData.id },
      });
      if (!post) {
        return ResponseController.Handle404Error(res, []);
      }
      console.log(post);
      const user = await User.findOne({ _id: post?.createdBy });
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Posts found!",
        data: PostUtils.appendSingleUser(post.toJSON(), user.toJSON()),
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Retrieves a post by id.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the response containing the post.
   */
  public static getPostById = async (req: Request, res: Response) => {
    try {
      const post = (await Post.findById(req.params.postId)).toJSON();
      const user = (await User.findOne({ _id: post?.createdBy })).toJSON();
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Posts found!",
        data: PostUtils.appendSingleUser(post, user),
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };
}
