const express = require('express')
const app = express()
const port = 3000
// const restaurant_list = require('./restaurant.json')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const Restaurant = require('./models/restaurant')
const db = mongoose.connection
const bodyParser = require('body-parser')

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

//使用 npm i express-handlebars(最新) 結果這行會出錯 "TypeError: exphbs is not a function"
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//首頁
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant: restaurant }))
    .catch(error => console.log(error))

})

//分頁介紹
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  // findById() 是找資料庫裡面的 _id 而不是取名叫 id 的項目
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

//刪除
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//新增 
//這邊用 "/restaurants/new" 會出錯 :CastError: Cast to ObjectId failed for value "new" (type string) at path "_id" for model "Restaurant"
// '/restaurants/new' 會被認為是分頁介紹的路由 , 然後資料庫找不到資料 一直轉圈圈
//去掉 s 作區別
app.get("/restaurant/new", (req, res) => {
  res.render("new")
})
//按下Save後
app.post('/restaurant',(req,res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({
    name, name_en, category, image, location, phone, google_map,
    rating: Number(rating),
    description
  })
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
    })
})


//修改資料
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/edited',(req,res) => {
  const id = req.params.id
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.findById(id)
    .then(data => {
      data.name = name
      data.name_en = name_en
      data.category = category
      data.image = image
      data.location = location
      data.phone = phone
      data.google_map = google_map
      data.rating = Number(rating)
      data.description = description
      data.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//搜尋頁
app.get('/search', (req, res) => {
  // console.log('req query=>', req.query.keyword)
  const keyword = req.query.keyword
  //如果keyword是空字串 '' , 所有字串都會包含空字串 , movies 會等於 movieList, 80個電影都會被包含進去
  const restaurants = restaurant_list.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword) || restaurant.name_en.toLowerCase().includes(keyword) || restaurant.category.includes(keyword)
  })
  //右邊的movies是剛剛挑選出來的 , 左邊是index裡面的變數
  //大括號左右兩邊都相同時可以寫一個就好 ex下面可改成 { movies }
  res.render('index', { restaurant: restaurants, keyword: keyword })
})



//設定監聽器
app.listen(port, () => {
  console.log(`Express in listening on localhost:${port}`)
})
