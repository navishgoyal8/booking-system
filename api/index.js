require("dotenv").config()
const express = require("express")
const User = require('./models/User.js')
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
const imageDownloader = require('image-downloader')
const multer = require('multer')
const fs = require('fs')
const placeModel = require("./models/Place.js")
const bookingModel = require("./models/Booking.js")
const path = require('path')

const bcryptSalt = bcrypt.genSaltSync(10)
const jwtSecret = "sfmbvsgfshfjmdfddsds"   //RANDOM TEXT 

app.use(express.json())
app.use(cookieParser())
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(cors());
                                        //  { credentials:true,
                                        // origin: 'http://localhost:3000'}

// console.log(process.env.MONGODB_URL)
mongoose.connect('mongodb+srv://booking:navishng@atlascluster.ycgr3ie.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster');

port = 4000

const getUserDataFromToken = async(req) => {
    return new Promise((resolve,reject) => {
        jwt.verify(req.cookies.token,jwtSecret,{},async(err,userData) => {
            if(err) throw err;
            resolve(userData);
        });
    });
}


app.get("/test",(req,res)=>{
    res.send("Hello World!")
})

app.post('/register',async(req,res) => {
    const {name,email,password} = req.body;
    try{
        const UserDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password,bcryptSalt)
        })

        res.json(UserDoc)
    }
    catch(e){
        res.status(422).json(e)
    }
  
})

app.post('/login',async(req,res) => {
    const {email,password} = req.body;
    const UserDoc = await User.findOne({email})
    if(UserDoc){
        const passOK = bcrypt.compareSync(password,UserDoc.password)
        if(passOK){
            jwt.sign({email:UserDoc.email,id:UserDoc._id},jwtSecret,{},(err,token) => {
                if(err) throw err;
                res.cookie('token',token).json(UserDoc);
            })   
        }
        else{
            res.status(422).json('Password is incorrect!')
        }
    }
    else{
        res.status(422).json('Email Not Found!')
    }
})

app.get('/profile',(req,res) => {
    const {token} = req.cookies
    if(token){
        jwt.verify(token,jwtSecret,{},async(err,user) =>{
            if(err) throw err;
            const {name,email,_id} = await User.findById(user.id)
            res.json({name,email,_id})
        })
    }
    else{
        res.json(null)
    }
   
})

app.post('/logout',(req,res) => {
    res.cookie('token','').json(true)
})

app.post('/upload-by-link',async(req,res) => {
    const {link} = req.body;
    console.log(link)
    const newName = 'photo'+ Date.now() + '.jpg'
    const options = {
        url: link,
        dest: __dirname+'/uploads/'+newName,
    }

    await imageDownloader.image(options)
    .then(({ filename }) => {
    console.log('Saved to', filename); // saved to /path/to/dest/image.jpg
    })
    .catch((err) => console.error(err));
    
    res.json(newName)
})

const photosMiddleware = multer({dest: 'uploads'})

app.post('/upload',photosMiddleware.array('photos',100),(req,res) => {

    const uploadedFiles = [];
    for(let i=0;i<req.files.length;i++){
        const {path,originalname} = req.files[i]
        const parts = originalname.split('.')
        const ext = parts[parts.length-1]
        const newPath = path + '.' + ext;
        fs.renameSync(path,newPath)
        uploadedFiles.push(newPath.replace('uploads',''))
    }
    res.json(uploadedFiles)
})

app.post('/places',(req,res) => {
    const placeData = req.body;
    const {token} = req.cookies
     jwt.verify(token,jwtSecret,{},async(err,user) =>{
            if(err) throw err;
            const placeDoc = await placeModel.create({
                owner: user.id,
                title: placeData.title,
                address: placeData.address,
                photos: placeData.addPhotos,
                description: placeData.description,
                perks: placeData.perks,
                extraInfo: placeData.extraInfo,
                checkIn: placeData.checkInTime,
                checkOut: placeData.checkOutTime,
                maxGuests: placeData.maxGuests,
                place: placeData.price
            })
            res.json(placeDoc)
        })

})

app.get('/user-places',(req,res) => {
    const {token} = req.cookies
     jwt.verify(token,jwtSecret,{},async(err,user) =>{
        if(err) throw err;
        const userId = user.id;
        const userData = await placeModel.find({owner: userId})
        res.json(userData)
     })

})

app.get('/places/:id',async(req,res) => {
    const {id} = req.params;
    res.json(await placeModel.findById(id))
})

app.put('/places',async(req,res) => {
    const {token} = req.cookies;
    const updateData = req.body;
    jwt.verify(token,jwtSecret,{},async(err,user) => {
        const placeDoc = await placeModel.findById(updateData.id)
        if(err) throw err;
        if(user.id === placeDoc.owner.toString()){
            placeDoc.set({
                title: updateData.title,
                address: updateData.address,
                photos: updateData.addPhotos,
                description: updateData.description,
                perks: updateData.perks,
                extraInfo: updateData.extraInfo,
                checkIn: updateData.checkInTime,
                checkOut: updateData.checkOutTime,
                maxGuests: updateData.maxGuests,
                price: updateData.price
            })
            placeDoc.save()
            res.json('ok')
        }
    })

})

app.get('/places',async(req,res) => {
    try{
        const places = await placeModel.find()
        res.json(places)
    }
    catch(e){
        console.log('Error found')
    }
})

app.post('/booking',async(req,res) => {
    const bookings = req.body;
    const userData = await getUserDataFromToken(req)
    console.log(bookings)
        bookingModel.create({
        user: userData.id,
        place: bookings.place,
        checkIn: bookings.checkIn,
        checkOut: bookings.checkOut,
        maxGuests: bookings.maxGuests,
        name: bookings.fullName,
        phoneNumber: bookings.mobile,
        price: bookings.price
    }).then((doc) => {
        res.json(doc)   
    })     
})



app.get('/bookings',async(req,res) => {
    const userData = await getUserDataFromToken(req)
    const bookingData = await bookingModel.find({user:userData.id}).populate('place');
    res.json(bookingData)

})

if(port) {
    app.listen(port,()=>{
    console.log(`Server is running at port ${port}:`)
})
}

module.exports = app;

