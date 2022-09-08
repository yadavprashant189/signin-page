const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));     //used for static files in system like image
app.get("/", function(req,res){                  //get root destimation and show signup page there
  res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
  const firstname = req.body.first;
  const secondname = req.body.last;
  const email = req.body.email;
  const data = {
    update_existing:true,                         //data to be sent to mailchimp server
    members:[
      {
      email_address:email,
      status: "subscribed",
      merge_fields:{
        FNAME: firstname,
        LNAME: secondname
      }
    }
    ]
  };

  const jsonData = JSON.stringify(data);                //convert data to string before sending
  const url = "https://us11.api.mailchimp.com/3.0/lists/c850a86b96";      //url to my list
  const options = {
    method:"POST",
    auth:"Prashant:f497449e704a0b932158f325e4a68706-us11"
  };
  const give = https.request(url, options, function(response){
    if (response.statusCode === 200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });
  give.write(jsonData);
  give.end();

});


app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server running on port 3000");
});


//d16158ecb95b9136fed7795fd64dbf00-us11  -   API key

//c850a86b96  -  list id
