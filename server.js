const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

//setting view engine to ejs
app.set('view engine', 'ejs')
//to access fullURL property of our body(req.body.fullURL)
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
//passing all values of form into views
  res.render('index', { shortUrls: shortUrls })
})

//async  await action makes insure  to wait untill this is finished
app.post('/shortUrls', async (req, res) => {
    //req.body=>gives access to our form
  await ShortUrl.create({ full: req.body.fullUrl })

  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()// update click

  res.redirect(shortUrl.full)
})

const port= process.env.PORT || 5000;

app.listen(port),()=>{
  console.log(`Server Running on ${port}`);
};