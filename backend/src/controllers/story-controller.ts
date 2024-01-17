import { NextFunction, Request, Response } from "express";
import UserStory from "../schema/UserStory";
import { ErrorResponseType, SuccessResponseType } from "../types/response";
import User from "../schema/User";
// import agenda from "./agenda-event-controllers";
import UserPrivateInfo from "../schema/UserPrivateInfo";
import ResponseController from "./reponse-controllers";

export default class StoryController {
  /**
   * Retrieves a story by its ID.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the response containing the story.
   */
  public static getStoryById = async (req: Request, res: Response) => {
    try {
      const story = await UserStory.findById(req.params.storyId);
      if (!story) {
        return ResponseController.Handle404Error(res, []);
      }

      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Story found",
        data: story,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Deletes a story by its ID.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A response indicating the success or failure of the operation.
   */
  public static deleteStoryById = async (req: Request, res: Response) => {
    try {
      const story = await UserStory.findById(req.params.storyId);
      if (!story) {
        return ResponseController.Handle404Error(res, []);
      }
      if (res.locals.jwtData.id !== story.createdBy) {
        return ResponseController.HandleUnauthorizedError(res, []);
      }

      await story.deleteOne();
      await User.findByIdAndUpdate(story.createdBy, {
        $pull: { stories: story._id },
      });

      //todo Cancel the scheduled job
      // agenda.cancel({ name: "delete-story", "data.storyId": story._id });

      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Story deleted successfully",
        data: null,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Updates the view count of a story and returns the updated story.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the updated story or an error response.
   */
  public static viewAStory = async (req: Request, res: Response) => {
    try {
      const story = await UserStory.findByIdAndUpdate(req.params.storyId, {
        $addToSet: { views: res.locals.jwtData.id },
      });
      if (!story) {
        return ResponseController.Handle404Error(res, []);
      }
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Story viewed successfully",
        data: story,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Like a story.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the updated story or an error response.
   */
  public static likeAStory = async (req: Request, res: Response) => {
    try {
      const story = await UserStory.findByIdAndUpdate(
        req.params.storyId,
        {
          $addToSet: { likes: res.locals.jwtData.id },
        },
        { new: true }
      );
      if (!story) {
        return ResponseController.Handle404Error(res, []);
      }
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Story liked successfully",
        data: story,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Unlike a story.
   *
   * @param req - The request object.
   * @param res - The response object.
   * @returns A promise that resolves to the updated story or an error response.
   */
  public static unlikeAStory = async (req: Request, res: Response) => {
    try {
      const story = await UserStory.findByIdAndUpdate(
        req.params.storyId,
        {
          $pull: { likes: res.locals.jwtData.id },
        },
        { new: true }
      );
      if (!story) {
        return ResponseController.Handle404Error(res, []);
      }
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Story unliked successfully",
        data: story,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Retrieves the stories created by the users that the current user is following.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A success response with the following stories.
   */
  public static getFollowingStories = async (req: Request, res: Response) => {
    try {
      const user = await UserPrivateInfo.findOne({
        userId: res.locals.jwtData.id,
      });
      const followingStories = await UserStory.find({
        createdBy: { $in: user.following },
      });
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "Following stories retrieved successfully",
        data: followingStories,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };
}
