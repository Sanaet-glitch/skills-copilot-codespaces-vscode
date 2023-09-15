//create web server
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment.js');
var Post = require('../models/post.js');
var User = require('../models/user.js');
var auth = require('../middleware/auth.js');
var async = require('async');
var validator = require('validator');
var mongoose = require('mongoose');

//add a comment
router.post('/add', auth, function(req, res) {
  var post_id = req.body.post_id;
  var content = req.body.content;
  var user_id = req.session.user._id;
  var comment = new Comment({
    post_id: post_id,
    user_id: user_id,
    content: content
  });
  comment.save(function(err) {
    if (err) {
      return res.json({
        error: err
      });
    }
    Post.update({
      _id: post_id
    }, {
      $inc: {
        comment_count: 1
      }
    }, function(err) {
      if (err) {
        return res.json({
          error: err
        });
      }
      res.json({
        success: 'success'
      });
    });
  });
});

//get comments by post id
router.get('/get', function(req, res) {
  var post_id = req.query.post_id;
  var page = req.query.page || 1;
  var limit = req.query.limit || 10;
  var skip = (page - 1) * limit;
  Comment.find({
    post_id: post_id
  }).populate('user_id').skip(skip).limit(limit).exec(function(err, comments) {
    if (err) {
      return res.json({
        error: err
      });
    }
    res.json({
      comments: comments
    });
  });
});

//delete a comment
router.post('/delete', auth, function(req, res) {
  var comment_id = req.body.comment_id;
  var post_id = req.body.post_id;
  var user_id = req.session.user._id;
  Comment.findOne({
    _id: comment_id
  }, function(err, comment) {
    if (err) {
      return res.json({
        error: err
      });
    }
    if (comment.user_id != user_id) {
      return res.json({
        error: 'not authorized'
      });
    }
    comment.remove(function(err) {
      if (err) {
        return res.json({
          error: err
        });
      }