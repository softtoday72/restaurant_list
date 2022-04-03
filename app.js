const express = require('express')
const session = require('express-session')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

//這行要在 express-session後面
const usePassport = require('./config/passport')
//app.use裡面 session要放最前面 (bodyParser, methodOverride不影響)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
//這行要在路由前面
usePassport(app)
app.use(flash())
//在 usePassport(app) 之後、app.use(routes) 之前，加入一組 middleware
app.use((req, res, next) => {
  // 你可以在這裡 console.log(req.user) 等資訊來觀察
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  //flash-message
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')  // 設定 warning_msg 訊息
  next()
})

//下面這行, 會自動找資料夾裡面的 index.js 所以打到資料夾位置就好
const routes = require('./routes')

//連接資料庫,只須執行一次 所以不用設變數來接
require('./config/mongoose')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//使用 npm i express-handlebars(最新) 結果這行會出錯 "TypeError: exphbs is not a function"
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

//設定監聽器
app.listen(port, () => {
  console.log(`Express in listening on localhost:${port}`)
})
