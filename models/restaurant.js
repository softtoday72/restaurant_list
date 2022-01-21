const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  name:{
    type: String,
    require: true,
  },
  name_en: {
    type: String,
    
  },
  category: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  google_map: {
    type: String,
    
  },
  rating: {
    type: Number,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    
  },
})

module.exports = mongoose.model('Restaurant', restaurantSchema)