const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId, required:true},
    place: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Place'},
    checkIn: {type:Date, required:true},
    checkOut: {type:Date, required:true},
    maxGuests: {type:String, required:true},
    name: {type:String, required:true},
    phoneNumber: {type:String, required:true},
    price: Number
})

const bookingModel = mongoose.model('Booking',bookingSchema)

module.exports = bookingModel;