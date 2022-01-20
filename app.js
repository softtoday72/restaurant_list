const express = require('express')
const app = express()
const port = 3000
//下面這行, 會自動找資料夾裡面的 index.js 所以打到資料夾位置就好
const routes = require('./routes')
// const restaurant_list = require('./restaurant.json')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected!')
})


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
