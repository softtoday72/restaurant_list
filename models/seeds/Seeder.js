const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const User = require('../user')
const restaurantList = require('../../restaurant.json').results
const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

const SEED_USER = [
  {
    email: 'user1@example.com',
    password: '12345678',
    restaurantId: [1, 2, 3]
  },
  {
    email: 'user2@example.com',
    password: '12345678',
    restaurantId: [4, 5, 6]
  }
]

db.once('open', () => {
  return Promise.all(Array.from({ length: SEED_USER.length }, (value, i) => {

    return bcrypt
      .genSalt(10)
      .then(salt => {
        return bcrypt.hash(SEED_USER[i].password, salt)
      })
      .then(hash => {
        return User.create({ email: SEED_USER[i].email, password: hash })
      })
      .then(user => {
        const userId = user._id
        const userRestaurants = restaurantList.filter(element => {
          return SEED_USER[i].restaurantId.includes(element.id)
        })
        return Promise.all(
          Array.from(userRestaurants, (value) => {
            value.userId = userId  //在餐廳物件加入userId
            return Restaurant.create(value)
          }))
      })
      
  }))
  .then(() => {
        console.log('restaurantSeeder done.')
        process.exit() // 加入這行以後只會跑出5筆資料
      })
      .catch(error => console.log(error))
})



