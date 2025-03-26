const mongoose = require('mongoose');

const URL = `mongodb://localhost:27017/login`;

const connecttomongo=mongoose.connect(URL).then(
    console.log("MongoDb is connected")
)
module.exports=connecttomongo;
