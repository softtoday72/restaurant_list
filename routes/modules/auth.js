const express = require('express')
const router = express.Router()

const passport = require('passport')

//網站向 Facebook 發出請求, 是我們向 Facebook 要求的資料
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

//是 Facebook 把資料發回來的地方
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

module.exports = router