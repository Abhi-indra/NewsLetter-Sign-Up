const express  = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// Used For enable the css uses in its own directory
app.use(express.static("public")); 

//For Parsing the data by the use of body parser modules
app.use(bodyParser.urlencoded({extended:true}));

//for sending the html page we use get method
app.get("/",(req, res) => {
    res.sendFile(__dirname + "/signup.html")
});

//for sending the data to the server from the get request
app.post("/",(req,res) => {

    const firstName = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastname
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/43c1a607b4";

    const options = {
        method: "POST",
        auth: "abhishek:00dd6a332d4739374c32286dca76a0d1-us9"
    }

    const request = https.request(url, options, function(response){
        console.log(response);
        if(response.statuscode == 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

});


app.post('/failure.html', function(req, res){
    res.redirect("/");
});




//check for It is listening the port or not
app.listen(3000,(req,res) => {
    console.log("Server is running on port 3000");
});

//API Key
// 00dd6a332d4739374c32286dca76a0d1-us9
//Auidence ID
// 43c1a607b4