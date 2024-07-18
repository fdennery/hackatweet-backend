const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    label: String,
    hashtag: String,
    liked_by: [[{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]]
    
});

const Tweet = mongoose.model('tweets',tweetSchema);
module.exports = tweetSchema;
