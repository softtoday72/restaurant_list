const express = require('express')
const router = express.Router()
//退兩層後 , 就能找到models資料夾在同一層 , 再往裡面進入找到restaurant.js
const Restaurant = require('../../models/restaurant')

//新增 
//這邊用 "/restaurants/new" 會出錯 :CastError: Cast to ObjectId failed for value "new" (type string) at path "_id" for model "Restaurant"
// '/restaurants/new' 會被認為是分頁介紹的路由 , 然後資料庫找不到資料 一直轉圈圈
//承上面狀況, 把新增路由放到分頁介紹前面就解決問題了 , 先判斷是不是 new 不是在找是不是 _id  
router.get('/new', (req, res) => {
  res.render("new")
})

//分頁介紹
router.get('/:id', (req, res) => {
  const id = req.params.id
  // findById() 是找資料庫裡面的 _id 而不是取名叫 id 的項目
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant: restaurant }))
    .catch(error => {
      console.log(error)
      res.render('errorPage', {error: error.message})
    })
})

//修改資料
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { error: error.message })
    })
})

//新增之後,按下Save (POST即是新增的語意, 不用改)
router.post('/', (req, res) => {
  const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  return Restaurant.create({
    name, name_en, category, image, location, phone, google_map,
    rating: Number(rating),
    description
  })
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { error: error.message })
    })
})

//有時候找不到路由(Cannot get @#$%.....), 不是卡在入口找不到而是卡在出口找不到, 尤其是路由是 put post delete, 但錯誤訊息是get要警覺
router.put('/:id', (req, res) => {
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
    .catch(error => {
      console.log(error)
      res.render('errorPage', { error: error.message })
    })
})

//刪除
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log(error)
      res.render('errorPage', { error: error.message })
    })
})

module.exports = router