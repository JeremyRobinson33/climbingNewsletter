const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

var port = process.env.PORT || 3003;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req,res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req,res) {
  var firstName = req.body.first;
  var lastName = req.body.last;
  var email = req.body.email;

  var data = {
    members:[
      {
        email_address:email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  var jsonData = JSON.stringify(data);

  console.log(email);

  var options = {
    url: 'https://us'+ process.env.serverNumber+'.api.mailchimp.com/3.0/lists/'+ process.env.listId,
    method: 'POST',
    headers: {
      "Authorization": "jeremy1 " + process.env.apiKey
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if(error) {
      res.sendFile(__dirname + "failure.html");
    } else {
      if(response.statusCode === 200) {
        res.sendFile(__dirname + "success.html");
      } else {
        res.sendFile(__dirname + "failure.html");
      }
    }
  })

});

app.post('/failure', function(req,res) {
  res.redirect('/');
})

app.listen(port, function() {
  console.log("Server is up and listening on port: " + port);
});
