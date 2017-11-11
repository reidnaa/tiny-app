const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


const PORT = process.env.PORT || 8080; // default port 8080


function generateRandomString(chars, number) {
    let result = '';
    for (let  i = number; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}



app.use(cookieParser());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


///// DATABASES ///////////////////////////////////////////////////

//database of urls
var urlDatabase = {
  "b2xVn2":{ longUrl:  "http://www.lighthouselabs.ca",
              userID: "userRandomID"
            },
  "9sm5xK": { longUrl :"http://www.google.com",
              userID: "user2RandomID"
            }

};

// users database
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "12"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "32"
  }
};
//////////////////////////////////////////////////////////////////////

//login page
app.get("/login" , (req,res) => {

  let user_email;
  let user_id = req.cookies["user_id"];

  if ( users[user_id]){
    user_email = users[user_id].email;
  }


  let templateVars = {
                      user_email: user_email,
                      user_id: user_id
                      };
res.render("login" , templateVars);
});

// LOGIN!! post =====================================================================

function checkForm (email, password){

  if(email && password){
    return true;
  }else {
    return false;
  }
}



app.post("/login", (req, res) => {
    var validEmail = false;
    var validPassword = false;
    var isComplete = checkForm(req.body.email , req.body.password);
    let user_id =  req.cookies["user_id"];
    let user_email = req.cookies["user_email"];
    var templateVars = {user_id: user_id,
                        user_email : user_email
                        };

    if (isComplete){

      for ( user in users){

          if (users[user].email === req.body.email){
                validEmail = true;
              if (users[user].password === req.body.password){
                validPassword = true;
                res.cookie("user_id" , user);
                res.redirect("/");
                break;
              } else {
               res.send("wrong password").status(403);
              }
          }
      } if (!validEmail){
          res.send("Please register email");
      }
    } else {
      res.send("need valid email and password input").status(403);
    }

});



// logout

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/");
});



// DELETE THE URLS
app.post("/urls/:id/delete", (req , res ) => {

  let user_id = req.cookies["user_id"];


  for ( id in urlDatabase){
    if (user_id === urlDatabase[id].userID){
      delete urlDatabase[req.params.id];
    }
  }

 res.redirect("/urls");

});

// go to urls_new.ejs page

app.get("/urls/new", (req, res) => {
  let user_id = req.cookies["user_id"];
  let user = users[user_id];
  let user_email = user !== undefined ? user.email : null;



  let templateVars = {
  urls: urlDatabase,
  shortURL: req.params.id,
  user: req.cookies["user"],
  user_email: user_email
};
  res.render("urls_new", templateVars );
});


//
app.post("/urls", (req, res) => {



  let rString = generateRandomString('0123456789abcdefghijklmnopqrstuvwxyz', 6);
  let user_id = req.cookies["user_id"];
  let user = users[user_id];
  let user_email = user !== undefined ? user.email : null;
  let templateVars = { urls: urlDatabase ,
                         user_id : user_id,
                         user_email : user_email
                        };



  let longUrl = "https://" +  req.body['longURL'];
  urlDatabase[rString] = {
    longUrl : longUrl,
    userID : user_id
  }
  res.redirect(`/urls/${rString}`);
});







// go to urls_index.ejs page
app.get("/urls", (req, res) => {


  let user_id = req.cookies["user_id"];

  let user = users[user_id];

  if (user){
    let user_email = user !== undefined ? user.email : null;
    let templateVars = { urls: urlDatabase ,
                         user_id : user_id,
                         user_email : user_email
                        };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("login");
  }
});






app.post("/urls/:id" , (req, res ) => {

let templateVars = {
  urls: urlDatabase,
  shortURL: req.params.id,
  user_id: req.cookies["user_id"]
};
let id = templateVars.urls ;

id[req.params.id] = req.body.longURL

 res.redirect("/urls/"+ templateVars.shortURL);
});

// when on /urls/"shortcode" display urls_shows.ejs with the url and short code
app.get("/urls/:id", (req, res) => {

  let user_id = req.cookies["user_id"];
  let user = users[user_id];
  let user_email = user !== undefined ? user.email : null;
  let templateVars = {
    urls:     urlDatabase,
    shortURL: req.params.id,
    user_id: req.cookies["user_id"],
    user_email:user_email
  };

  res.render("urls_show", templateVars);
});



// get register page
app.get("/register", (req,res) => {

let templateVars = {user_id : undefined ,
                    user_email : undefined
                    };
  res.render("register" , templateVars);

});

// register page post
app.post("/register", (req, res) => {
  const newId = generateRandomString('0123456789abcdefghijklmnopqrstuvwxyz', 12);

  for (let user in users) {
    if ( users[user].email === req.body.email){
      res.send(" 400 error - email already registered");
    }
  }

    if( !req.body.email || !req.body.password){
      res.send(" 400 error - email and password must be filled").status(400);
    } else  {
        users[newId] = { id : newId,
                          email: req.body.email,
                          password: req.body.password
                        };



      res.cookie("user_id" , newId );

      res.redirect("/urls");
    }
});

//home page
app.get("/", (req, res) => {

  let user_email;
  let user_id = req.cookies["user_id"];

  if ( users[user_id]){
    user_email = users[user_id].email;
  }


  let templateVars = {
    user_email: user_email,
    user_id: user_id
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




app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});