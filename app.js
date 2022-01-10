const express = require('express')
const app = express()
const port = 3000
const restaurant_list = require('./restaurant.json')
const exphbs = require('express-handlebars')

//使用 npm i express-handlebars(最新) 結果這行會出錯 "TypeError: exphbs is not a function"
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))

app.set('view engine', 'handlebars')
app.use(express.static('public'))

//首頁
app.get('/', (req, res) => {
  res.render('index', { restaurant: restaurant_list.results })
})

//分頁介紹
app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurant_list.results.find(restaurant => restaurant.id.toString() === req.params.id)
  res.render('show', { restaurant: restaurant })
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