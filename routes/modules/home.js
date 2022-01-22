const express = require('express')
const router = express.Router()

//退兩層後 , 就能找到models資料夾在同一層 , 再往裡面進入找到restaurant.js
const Restaurant = require('../../models/restaurant')

//首頁
// router.get('/', (req, res) => {
//   Restaurant.find()
//     .lean()
//     .then(restaurant => res.render('index', { restaurant: restaurant }))
//     .catch(error => {
//       console.log(error)
//       res.render('errorPage', { error: error.message })
//     })
// })

//搜尋頁合併首頁
router.get('/', (req, res) => {
  // console.log('req query=>', req.query.keyword)
  const keyword = !req.query.keyword ? '' : req.query.keyword.trim()
  //const key = keyword.trim().toLowerCase()
  //如果keyword是空字串 '' , 所有字串都會包含空字串 , movies 會等於 movieList, 80個電影都會被包含進去
  
  const sortValue = req.query.sort
  let sorter = {}
  switch (sortValue) {
    case '1': sorter = { name: 'asc' }
      break;
    case '2': sorter = { name: 'desc' }
      break;
    case '3': sorter = { category: 'desc' }
      break;
    case '4': sorter = { location: 'desc' }
      break;
    //用資料庫建立的id排序  
    default: sorter = { _id: 'asc' }
  }
  
  // $or用法 : { $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }
  // $regex用法 : { <field>: { $regex: 'pattern', $options: '<options>' } }
  //option: 'i' ,的 i是指 大小寫不敏感
  Restaurant.find({ $or: [{ name: { $regex: keyword, $options: 'i' } }, { category: { $regex: keyword, $options: 'i' } }] })
    .sort(sorter)
    .lean()
    .then(restaurants => {
      //箭頭函式有大括號的話 , 要寫 return 不然沒有回傳
      //省略大括號同時也省略了 return ,所以不用寫
      // const restaurants = dataset.filter(data => {
      //   return data.name.toLowerCase().includes(keyword) || data.name_en.toLowerCase().includes(keyword) || data.category.includes(keyword)
      // })
      //右邊的movies是剛剛挑選出來的 , 左邊是index裡面的變數
      //大括號左右兩邊都相同時可以寫一個就好 ex下面可改成 { movies }
      res.render(('index'), { restaurant: restaurants, keyword: keyword })
    })
    .catch(error => {
      console.log(error)
      res.render('errorPage', { error: error.message })
    })
})



module.exports = router