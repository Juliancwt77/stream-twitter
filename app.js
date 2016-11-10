var express = require('express')
var app = express()
var server = require('http').createServer(app)
var port = process.env.PORT || 4000

app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.render('index', { header: 'Twitter Search'})
})

var io = require('socket.io')(server)

var Twit = require('twit')
var twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

var stream

io.on('connect', function (socket) {
  console.log('connected with front end')
  socket.on('updateTerm', function (search_term) {
    socket.emit('updatedTerm', search_term)

    if (stream) {
      stream.stop()
    }

    stream = twitter.stream('statuses/filter', {
      track: search_term,
      language: 'en'
    })

    stream.on('tweet', function (tweet) {
      var data = {
        name: tweet.user.name
      }
      data.screen_name = tweet.user.screen_name
      data.text = tweet.text
      data.user_profile_image = tweet.user.profile_image_url

      socket.emit('tweets', data)
    })
  })
})

server.listen(port)
