const mongo=require('./database');
const express = require('express')
const app = express()
const port = 8000;
const cors=require('cors');

app.use(cors());
app.use(express.json());
app.use('/login',require(`./routes/login`));
app.use('/signup',require(`./routes/signup`));

app.listen(port, () => {
  console.log(`The app listening on port ${port}`)
})