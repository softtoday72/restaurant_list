const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const restaurantRoutes = require('./modules/restaurantRoutes')
//在app.js遇到 '/'的路由, 就到home去找
router.use('/', home)
router.use('/restaurants', restaurantRoutes)

module.exports = router