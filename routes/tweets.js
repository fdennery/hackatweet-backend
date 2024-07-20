var express = require('express');
var router = express.Router();

require ('../models/connection')
const Tweet = require('../models/tweets')
const User = require('../models/users')


function checkBody(body, keys) {
  let isValid = true;

  for (const field of keys) {
    if (!body[field] || body[field] === '') {
      isValid = false;
    }
  }

  return isValid;
}

module.exports = { checkBody };


/* GET  all tweets listing. */
router.get('/', (req, res,) => {

  Tweet.find()
  .populate('creator',['username', 'firstname'])
  .populate('liked_by', ['username'])
  .sort({ creation_date:'desc'})
  .then(dbData => {
    res.json({tweets: dbData });
  })



});

// Create Tweet

router.post('/' ,(req, res) => {
 if (!checkBody(req.body, ['creator', 'tweet' ])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({username: req.body.creator})
  .then (userData => {
    if (userData === null) {
      res.json({result:'false', error: 'user not found'});
      return;
    }


  let hashtags = req.body.tweet.match(/#[a-z]+/gi)
  //let label =  req.body.tweet.replace(/#\S+/gi, '')

 const newTweet = new Tweet({
    creator: userData._id,
    label: req.body.tweet,
    hashtags: hashtags,
    liked_by: []
  })

  newTweet.save().then(newDoc => {
    res.json({result : true, tweet: newDoc})
  })
});
});

router.delete('/:tweetId', (req,res) => {
  console.log(req.params.tweetId)
  Tweet.deleteOne({
    _id : req.params.tweetId
  }).then(deletedDoc => {
    if(deletedDoc.deletedCount > 0) {
      res.json({result: true, deletedDoc})
    } else {
      res.json({result: false, error: 'No Tweet with this ID'})
    }
  })
})

router.put('/updateLikes', (req, res)=> {
  if (!checkBody(req.body, ['tweetId', 'username' ])) {
    res.json({ result: false, error: 'Tweet not found' });
    return;
  }

  User.findOne({username: req.body.username})
  .then (userData => {
    if (userData === null) {
      res.json({result:true, error: 'user not found'})
    }
 
  Tweet.findOne({_id: req.body.tweetId}).then( dbData => {
    if (!dbData) {
      res.json({result: false, error: 'Tweet not found'})
    } else if (!dbData.liked_by.includes(userData._id)){
      Tweet.updateOne(
        {_id: req.body.tweetId},
        { $push: {liked_by: userData._id}}
      ).then(updatedDoc => {
        if (updatedDoc.modifiedCount > 0) {
        res.json({result: true, message:'tweet liked', updatedDoc})
      } else {
        res.json({result: false, error: 'An error occured'})
      }
    })
    } else if (dbData.liked_by.includes(userData._id)){
      Tweet.updateOne(
        {_id: req.body.tweetId},
        { $pull: {liked_by: userData._id}}
      ).then(updatedDoc => {
        if (updatedDoc.modifiedCount > 0) {
        res.json({result: true, message: 'tweet unliked', updatedDoc})
      } else {
        res.json({result: false, error: 'An error occured'})
  
      }})
    }; 
});
});
});


router.get('/trends', (req , res)=> {
  Tweet.aggregate([
    { $unwind: '$hashtags' },
    { $group: { _id: '$hashtags', count: { $sum: 1 } } } 
  ]).then(dbData => {
    res.json({result: true, trends: dbData})
  })

})

router.get('/byHashtag/:hashtag', (req, res) => {
  Tweet.find({hashtags: {$in: [`#${req.params.hashtag}`]}}).sort({ creation_date:'desc'})
.then(dbData => {
  res.json({result :true, tweets: dbData})
})
})
module.exports = router;
