$(document).ready(function () {
  console.log('ready!')

  var socket = io()

  socket.on('connect', function () {
    console.log('connected with back end')
  })

  $('form').submit(function (e) {
    e.preventDefault()
    var search_term = $('input').val()
    socket.emit('updateTerm', search_term)
  })

  socket.on('tweets', function (data) {
    // alert('new tweet')
    var tweet_list = '<li>' + data.name + '</li>'
    $('.tweet-container li').text(data.text)
  })

  socket.on('updatedTerm', function (searchTerm) {
    $('h1').text('Twitter Search for ' + searchTerm)
  })
})
