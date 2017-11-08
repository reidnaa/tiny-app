var express = require("express");
var methodOverride = require('method-override')

var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.post("/urls/:id/delete", (req , res ) => {




 delete urlDatabase[req.params.id];



 res.redirect("/urls");

})

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  urlDatabase[rString] = "https://" +  req.body['longURL'];
  res.redirect(`/urls/${rString}`);
});



app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {

  let templateVars = { urls:     urlDatabase,
                       shortURL: req.params.id
                     };

  res.render("urls_show", templateVars);
});


//home page
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


// at Hello page === /hello
app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});




var rString = generateRandomString('0123456789abcdefghijklmnopqrstuvwxyz');
function generateRandomString(chars) {
    let result = '';
    for (let  i = 6; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
