// Remember when running file use "node server" in command line don't use "npm server" that is where I went wrong thinking I had a bug! Now with nodemon just use npm run watch.
// Now with nodemon installed it will watch any changes and help with not having to always stop you server so now use - npm run watch
// Remember it's best to run a lot of npm locally in project and not globally

// Pushing app online! 1-4-2020 Having a hard time pushing to heroku
// I had a origin/master diverge I believe I have fixed it on 1-5-2020 trying again to heroku

// Require express.js
let express = require('express');
let mongodb = require('mongodb');
let sanitizeHTML = require('sanitize-html');

let app = express();
let db;

// For Heroku port because localhost:3000 is just for us!
let port = process.env.PORT;
if(port == null || port == "") {
  port = 3000;
}


app.use(express.static('public'));

// Connect
let connectionString = 'mongodb+srv://wishListApp:12345@cluster0-kccxp.mongodb.net/wishListApp?retryWrites=true&w=majority';
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  db = client.db();
  app.listen(port);
});


app.use(express.json());
// Used to access form data
app.use(express.urlencoded({extended: false})); 


function passwordProtected(req, res, next) {
  res.set('WWW-Authenticate', 'Basic realm="Simple Wishlist App"');
  console.log(req.headers.authorization);
  //  Basic bGVhcm46amF2YXNjcmlwdA== is known as base64
  if (req.headers.authorization == "Basic bGVhcm46amF2YXNjcmlwdA==") {
    next();
  } else {
    // 401 means unauthorized
    res.status(401).send("Authentication Required!");
  }
}


app.use(passwordProtected);


app.get('/', function(req, res) {
    db.collection('items').find().toArray(function(err, items) {
      // console.log(items);

      res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wish List App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">Wish List App</h1>
    
    <div class="jumbotron p-3 shadow-sm">
      <form id="create-form" action="/create-item" method="POST">
        <div class="d-flex align-items-center">
          <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>
    
    <ul id="item-list" class="list-group pb-5">
      
    </ul>
    
  </div>
  
  <script>
    let items = ${JSON.stringify(items)}
  </script>

  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="/browser.js"></script>
</body>
</html>`);
    });
});





app.post('/create-item', function(req, res) {
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}});
  // console.log(req.body.item);
  db.collection('items').insertOne({text: safeText}, function(err, info) {
    res.json(info.ops[0]);
  });
  // res.send('Thanks for submitting');
});

app.post('/update-item', function(req, res) {
  let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} });
  //console.log(req.body.text);
  //res.send("Success!");
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectID(req.body.id)}, {$set: {text: safeText}}, function() {
    res.send("Success!");
  });
});

app.post('/delete-item', function(req, res) {
  db.collection('items').deleteOne({ _id: new mongodb.ObjectID(req.body.id) }, function() {
    res.send("Success!");
  });
});

// app.listen(3000);
