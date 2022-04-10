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
  return Promise.all(Array.from(SEED_USER, (seedUser, i) => {

    bcrypt
      .genSalt(10)
      .then(salt => {
        return bcrypt.hash(seedUser.password, salt)
      })
      .then(hash => {
        return User.create({ email: seedUser.email, password: hash })
      })
      .then(user => {
        const userId = user._id
        let restaurants = []
        seedUser.restaurantId.forEach((id) => {
          const restaurant = restaurantList.find((item) => item.id === id)
          restaurants.push(restaurant)
        })
        restaurants.map((data) => data.userId = userId)
        return Restaurant.create(restaurants)
      })
      .then(() => {
        console.log('restaurantSeeder done.')
        process.exit() // 加入這行以後只會跑出5筆資料
      })
  }))
})



