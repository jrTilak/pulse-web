"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
await UserPrivateInfo.findOneAndUpdate({ userId: res.locals.jwtData.id }, isToSave
    ? { $push: { savedPosts: postId } }
    : { $pull: { savedPosts: postId } }, { new: true });
//# sourceMappingURL=tempCodeRunnerFile.js.map