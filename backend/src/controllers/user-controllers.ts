import { Request, Response } from "express";
import User from "../schema/User";
import UserPrivateInfo from "../schema/UserPrivateInfo";
import UserStory from "../schema/UserStory";
import { saveOnlyTheseKeys } from "../utils/obj-utils";
import ResponseController from "./reponse-controllers";
// import agenda from "./agenda-event-controllers";

export default class UserController {
  /**
   * Retrieves a user by their username.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A success response with the user data if found, or a 404 error response if not found.
   */
  public static getUserByUsername = async (req: Request, res: Response) => {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      ResponseController.Handle404Error(res, []);
    }
    return ResponseController.HandleSuccessResponse(res, {
      status: 200,
      message: "User found",
      data: user,
    });
  };

  /**
   * Edits the details of a user.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the updated user details.
   */
  public static editUserDetails = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const cannotUpdate = ["_id", "createdAt", "__v"];
      if (Object.keys(body).some((key) => cannotUpdate.includes(key))) {
        return ResponseController.HandleResponseError(res, {
          status: 400,
          message: "Cannot update these fields " + cannotUpdate.join(", "),
          errors: [],
        });
      }

      const exceptions = ["socialLinks"];

      //check if body has any key other than exceptions
      if (!Object.keys(body).some((key) => exceptions.includes(key))) {
        const user = await User.findOneAndUpdate(
          { _id: res.locals.jwtData.id },
          body,
          {
            new: true,
          }
        );
        if (!user) {
          return ResponseController.Handle404Error(res, []);
        }
        return ResponseController.HandleSuccessResponse(res, {
          status: 200,
          message: "User updated",
          data: user,
        });
      } else {
        //if body has socialLinks
        const userToFollow = await User.findOne({ _id: res.locals.jwtData.id });

        //check if newUser.socialLinks has length more than 5 and any links are repeated
        const socialLinks = [
          ...userToFollow.socialLinks,
          ...(body.socialLinks as typeof userToFollow.socialLinks),
        ];
        const links = socialLinks.map((link: any) => link.url);
        const uniqueLinks = [...new Set(links)];
        if (uniqueLinks.length !== links.length) {
          return ResponseController.HandleResponseError(res, {
            status: 400,
            message: "Link already exists, Try another one",
            errors: [],
          });
        }
        if (socialLinks.length > 5) {
          return ResponseController.HandleResponseError(res, {
            status: 400,
            message: "Cannot add more than 5 links",
            errors: [],
          });
        }
        const updatedUser = await User.findOneAndUpdate(
          { _id: res.locals.jwtData.id },
          {
            ...body,
            socialLinks,
          },
          {
            new: true,
          }
        );
        return ResponseController.HandleSuccessResponse(res, {
          status: 200,
          message: "User updated",
          data: updatedUser,
        });
      }
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Handles the logic for following or unfollowing a user.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A response indicating the success or failure of the operation.
   */
  public static followUser = async (req: Request, res: Response) => {
    try {
      const userToFollow = await User.findOne({
        username: req.params.username,
      });
      const user = await User.findOne({ _id: res.locals.jwtData.id });
      const isToFollow = req.method === "POST";

      if (!userToFollow || !user) {
        return ResponseController.Handle404Error(res, []);
      }
      if (userToFollow._id.toString() === res.locals.jwtData.id) {
        return ResponseController.HandleResponseError(res, {
          status: 400,
          message: "Cannot follow yourself",
          errors: [],
        });
      }

      const userToFollowPrivateInfo = await UserPrivateInfo.findOne({
        userId: userToFollow._id,
      });
      const userPrivateInfo = await UserPrivateInfo.findOne({
        userId: user._id,
      });

      //add userToFollow to user's following list
      if (isToFollow) {
        userPrivateInfo.following.push(userToFollow._id.toString());
        userToFollowPrivateInfo.followers.push(user._id.toString());
        await userPrivateInfo.save();
        await userToFollowPrivateInfo.save();
      } else {
        userPrivateInfo.following = userPrivateInfo.following.filter(
          (userId) => userId !== userToFollow._id.toString()
        );
        userToFollowPrivateInfo.followers =
          userToFollowPrivateInfo.followers.filter(
            (userId) => userId !== user._id.toString()
          );
        await userPrivateInfo.save();
        await userToFollowPrivateInfo.save();
      }
      user.following = userPrivateInfo.following.length;
      userToFollow.followers = userToFollowPrivateInfo.followers.length;
      await user.save();
      await userToFollow.save();

      const users = {
        user,
        userToFollow,
      };
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: isToFollow ? "Followed" : "Unfollowed",
        data: users,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Retrieves the list of followers id for the authenticated user.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A success response with the list of followers or an error response if an error occurs.
   */
  public static getFollowersList = async (req: Request, res: Response) => {
    try {
      const userPrivateInfo = await UserPrivateInfo.findOne({
        userId: res.locals.jwtData.id,
      });
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Followers found",
        data: userPrivateInfo.followers,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Retrieves the list of users that the current user is following.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A success response with the list of following users.
   */
  public static getFollowingList = async (req: Request, res: Response) => {
    try {
      const userPrivateInfo = await UserPrivateInfo.findOne({
        userId: res.locals.jwtData.id,
      });
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Following found",
        data: userPrivateInfo.following,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Creates a new story.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the response object.
   */
  public static createNewStory = async (
    //todo - move this to story controller
    req: Request,
    res: Response
  ) => {
    try {
      const body = req.body;
      const user = await User.findOne({ _id: res.locals.jwtData.id });
      const storyTypes = ["text", "image", "video"];

      if (!storyTypes.includes(req.params.type)) {
        return ResponseController.HandleResponseError(res, {
          status: 400,
          message:
            "Invalid story type, Story type can be + " + storyTypes.join(", "),
          errors: [],
        });
      }

      const newStory = new UserStory({
        createdBy: res.locals.jwtData.id,
        type: req.params.type,
        content: body.content,
      });
      await newStory.save();
      user.stories.push(newStory._id.toString());
      await user.save();

      //todo delete story after 24 hours
      // agenda.schedule("24 hours", "delete-story", {
      //   storyId: newStory._id,
      //   createdBy: newStory.createdBy,
      // });
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Story created",
        data: newStory,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Retrieves a user by their ID.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the user data or an error response.
   */
  public static getUserById = async (req: Request, res: Response) => {
    const qs = req.query.q as string;
    try {
      const user = await User.findOne({ _id: req.params.id });
      if (!user) {
        return ResponseController.Handle404Error(res, []);
      }
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "User found",
        data: qs == undefined ? saveOnlyTheseKeys(user, qs.split(",")) : user,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Retrieves all users.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A response indicating the success or failure of the operation.
   */
  public static getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find({});
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Users found",
        data: users,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Retrieves a list of suggested users based on the current user's preferences.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A response with the suggested users.
   */
  public static getSuggestedUsers = async (req: Request, res: Response) => {
    try {
      const user = await UserPrivateInfo.findOne({
        userId: res.locals.jwtData.id,
      });
      const suggestedUsers = await User.find({
        _id: { $nin: [...user.following, user.userId] },
      }).limit(5);
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Suggested users found",
        data: suggestedUsers,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };
}
