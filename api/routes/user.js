const express = require('express');
const router = express.Router();
// const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/user');

router.post('/signup', UserController.user_signup_user);

router.post('/login', UserController.user_login_user);

router.post('/fav', UserController.user_add_favorite);

router.get('/fav', UserController.user_fetch_favorite);

module.exports = router;
