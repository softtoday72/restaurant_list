//從json檔取出資料
const data = require('../../restaurant.json').results

//叫出與資料庫互動的model
const Restaurant = require('../restaurant')

//這邊連接資料庫
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('mongodb connected!')
  //產生資料
  Restaurant.create(data)
    .then(() => {
      console.log("restaurantSeeder done!")
      db.close()
    })
    .catch(err => console.log(err))
})



