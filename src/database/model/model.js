const AuthorModel = require("./src/story/author.model");
const StoryModel = require("./src/story/story.model");
const UserModel = require("./src/user/user.model");

/*
=====> Author
*/
AuthorModel.hasMany(StoryModel, { as: 'stories', foreignKey: 'author_id' })

/*
=====> Story
*/
StoryModel.belongsTo(AuthorModel, { as: 'author', foreignKey: 'author_id' })

module.exports = {
    UserModel,
    AuthorModel,
    StoryModel,
}