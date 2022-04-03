const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const restaurantRoutes = require('./modules/restaurantRoutes')
const users = require('./modules/users')
const auth = require('./modules/auth')

//載入auth.js
const { authenticator } = require('../middleware/auth')

//在app.js遇到 '/'的路由, 就到home去找
router.use('/restaurants', authenticator, restaurantRoutes)// 加入驗證程序
router.use('/users', users)
router.use('/auth', auth) //不用驗證
router.use('/', authenticator, home)// 加入驗證程序
module.exports = router