var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var BASE_URL = 'https://hopit.herokuapp.com/';
//var BASE_URL = 'http://hop-lodfs.c9users.io/';
function randomStr(s) {
    return Math.round((Math.pow(36, s + 1) - Math.random() * Math.pow(36, s))).toString(36).slice(1);
}

var delMessages = {};

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));


app.post("/newGame", function (req, res) {
    var key = randomStr(5);
    delMessages[key] = [];
    console.log('Made Key ' + key);
    res.send(`<!DOCTYPE html>
<html >
  <head>
    <meta charset="UTF-8">
    <title>CodePen - Name that colour!</title>
    <link rel="stylesheet" type="text/css" href="./public/css/style.css">
    <link href="https://fonts.googleapis.com/css?family=Jaldi" rel="stylesheet">
  </head>

  <body>
    <div class="timer__container">
    <div id="timer" class="timer"></div>
</div>
<div class="scores__container wrap clearfix">
    <div class="score__container">
    <div class="box">
        <p><span id="score_">Score</span> <br> <span id="score" class="score"></span></p>
    </div>
    </div>
    <div id="pb-container" class="pb__container">
        <p>Personal best: <span id="pb" class="score"></span></p>
    </div>
</div>
<div class="wrap">
    <h1 class="title">Name that colour!</h1>
    <p class="subtitle">Click the colour, <em>not</em> the word. <a href="http://codepen.io/andrewtanner1987/full/e259f8d33a896f23a4003f66c48bd251/" target="_blank">Full screen view</a> works best.</p>
    <button class="start" id="start">Go!</button>
    <p class="word" id="word"></p>
    <ul id="options" class="options__container"></ul>
    <div id="gameover-container" class="modal__container">
        <div class="modal">
            <p>Game over!</p>
            <button id="restart">Have another go?</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="./public/js/game.js"></script>    
  </body>
</html>
 
`);
});

app.get("/:index", function (req, res) {
    var index = req.params.index;
    if(delMessages[index] != undefined) {
    res.send(`<!DOCTYPE html>
    <html>
    <head>
    <title>Hop</title>
    <link rel='stylesheet' href='./public/css/styles.css'/>
    </head>
    <body>
    <ul id="messages"></ul>
    <form id="hopNameForm" class="text-center centered">
        <input autocomplete="off" id="hopName" type="text" placeholder="Your Username"/>
    </form>
    <form id="hopChatForm">
      <input autocomplete="off" id="hopChatMes" placeholder="Your message"/><button class="btn btn-outline">Send</button>
    </form>
    <script src="/socket.io/socket.io.js"></script>
    <script src="./public/js/lib/paint.min.js"></script>
    <script src='./public/js/hop.js'></script>
    <script src='./public/js/scripts.js'></script>
    </body>
    </html>`);
    } else {
        res.send(`<!DOCTYPE html><html><head><title>404</title><link rel='stylesheet' href='./public/css/styles.css'/></head><body><div class='text-center centered animate fadeIn'><h1>404</h1><br><img id="frown" src='http://emojipedia-us.s3.amazonaws.com/cache/9e/ed/9eed096cb7f1adf49b7495df19945d15.png'/></div></body></html>`);
    }
});
io.on('connection', function(socket){
    socket.on('hop message', function(data){
        io.emit('hop message', {msg: data.msg, name: data.name});
    });
});



http.listen(process.env.PORT, function (req, res) {
    console.log("Listening");
});
