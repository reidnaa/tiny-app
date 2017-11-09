const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')


const PORT = process.env.PORT || 8080; // default port 8080

app.use(cookieParser());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


// LOGIN!!
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});


// logout

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});


//database of urls
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// DELETE THE URLS
app.post("/urls/:id/delete", (req , res ) => {

 delete urlDatabase[req.params.id];
 res.redirect("/urls");

});

// go to urls_new.ejs page

app.get("/urls/new", (req, res) => {
  let templateVars = {
  urls: urlDatabase,
  shortURL: req.params.id,
  username: req.cookies["username"]
};
  res.render("urls_new", templateVars );
});


//
app.post("/urls", (req, res) => {
  urlDatabase[rString] = "https://" +  req.body['longURL'];
  res.redirect(`/urls/${rString}`);
});


// go to urls_index.ejs page
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase , username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});


app.post("/urls/:id" , (req, res ) => {

let templateVars = {
  urls: urlDatabase,
  shortURL: req.params.id,
  username: req.cookies["username"]
};
let id = templateVars.urls ;

id[req.params.id] = req.body.longURL

 res.redirect("/urls/"+ templateVars.shortURL);
});

// when on /urls/"shortcode" display urls_shows.ejs with the url and short code
app.get("/urls/:id", (req, res) => {

  let templateVars = {
    urls:     urlDatabase,
    shortURL: req.params.id,
    username: req.cookies["username"]
  };

  res.render("urls_show", templateVars);
});


//home page
app.get("/", (req, res) => {
  let templateVars = {
  username: req.cookies["username"]
};
  res.render("home", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


// at Hello page === /hello
app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

//
//, username: req.cookies["username"]

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
