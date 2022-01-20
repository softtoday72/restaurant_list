const express = require('express')
const router = express.Router()

//退兩層後 , 就能找到models資料夾在同一層 , 再往裡面進入找到restaurant.js
const Restaurant = require('../../models/restaurant')

//首頁
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => res.render('index', { restaurant: restaurant }))
    .catch(error => console.log(error))
})

//搜尋頁, 這個前綴詞歸類在?
router.get('/search', (req, res) => {
  // console.log('req query=>', req.query.keyword)
  const keyword = req.query.keyword
  const key = keyword.trim().toLowerCase()
  //如果keyword是空字串 '' , 所有字串都會包含空字串 , movies 會等於 movieList, 80個電影都會被包含進去 ,但還是寫一下~
  if (!keyword) {
    return res.redirect('/')
  }

  Restaurant.find()
    .lean()
    .then(dataset => {
      //箭頭函式有大括號的話 , 要寫 return 不然沒有回傳
      //省略大括號同時也省略了 return ,所以不用寫
      const restaurants = dataset.filter(data => {
        return data.name.toLowerCase().includes(key) || data.name_en.toLowerCase().includes(key) || data.category.includes(key)
      }
      )
      //右邊的movies是剛剛挑選出來的 , 左邊是index裡面的變數
      //大括號左右兩邊都相同時可以寫一個就好 ex下面可改成 { movies }
      res.render(('index'), { restaurant: restaurants, keyword: keyword })
    })
    .catch(error => console.log(error))
})

module.exports = router