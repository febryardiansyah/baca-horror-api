const AuthorModel = require("./src/story/author.model");
const CommentModel = require("./src/story/comment.model");
const FavoriteModel = require("./src/story/favorite.model");
const LikeModel = require("./src/story/like.model");
const ReportedComment = require("./src/story/reportedComment.model");
const StoryModel = require("./src/story/story.model");
const UserModel = require("./src/user/user.model");

/**
 * AUTHOR
 */
AuthorModel.hasMany(StoryModel, { as: 'stories', foreignKey: 'author_id' })

/**
 * STORY
 */
StoryModel.belongsTo(AuthorModel, { as: 'author', foreignKey: 'author_id' })
StoryModel.belongsToMany(UserModel, { as: 'users_like', through: LikeModel })
StoryModel.belongsToMany(UserModel, { as: 'users_favorite', through: FavoriteModel })
StoryModel.belongsToMany(UserModel, {
    as: 'users_comment', through: {
        model: CommentModel, unique: false,
    }, foreignKey: 'storyId'
})

/**
 * USER
 */
UserModel.belongsToMany(StoryModel, { as: 'stories_like', through: LikeModel })
UserModel.belongsToMany(StoryModel, { as: 'stories_favorite', through: FavoriteModel })
UserModel.belongsToMany(StoryModel, {
    as: 'stories_comment', through: {
        model: CommentModel, unique: false,
    }, foreignKey: 'userId'
})

CommentModel.belongsTo(StoryModel, { as: 'story' })
CommentModel.belongsTo(UserModel, { as: 'user' })
CommentModel.hasMany(ReportedComment, { as: 'reports' })

ReportedComment.belongsTo(CommentModel, { as: 'comment' })

module.exports = {
    UserModel,
    AuthorModel,
    StoryModel,
    FavoriteModel,
    CommentModel,
    ReportedComment
}