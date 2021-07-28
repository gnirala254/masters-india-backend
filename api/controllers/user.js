const User = require('../models/user');
const Favorite = require('../models/favorite');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.user_signup_user = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'this email id already registered',
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: 'User created',
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.user_login_user = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(404).json({
          message: 'Auth failed',
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed',
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            '' + process.env.JWT_KEY,
            {
              expiresIn: '1h',
            }
          );
          return res.status(200).json({
            message: 'Auth successfull',
            token: token,
          });
        }
        res.status(401).json({
          message: 'Auth failed',
        });
      });
    });
};

exports.user_add_favorite = (req, res, next) => {
  Favorite.find({ pageid: req.body.pageid })
    .exec()
    .then((fav) => {
      if (fav.length >= 1) {
        return res.status(409).json({
          message: 'it is already a favorite',
        });
      } else {
        const favorite = new Favorite({
          _id: new mongoose.Types.ObjectId(),
          pageid: req.body.pageid,
          title: req.body.title,
          snippet: req.body.snippet,
        });
        favorite
          .save()
          .then((result) => {
            console.log(result);
            res.status(201).json({
              message: 'Favorite Added',
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    });
};

exports.user_fetch_favorite = (req, res, next) => {
  Favorite.find()
    .select('pageid title snippet')
    .exec()
    .then((docs) => {
      const response = {
        favorites: docs.map((doc) => {
          return {
            pageid: doc.pageid,
            title: doc.title,
            snippet: doc.snippet,
          };
        }),
      };
      res.status(200).json({ response });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
