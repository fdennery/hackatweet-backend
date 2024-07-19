const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    label: String,
    hashtags: [String],
    liked_by: [[{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]],
    creation_date : { type: Date, default: Date.now }
    
});

const Tweet = mongoose.model('tweets',tweetSchema);
module.exports = Tweet;
