import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import mysql from 'mysql';

//ANGELA USED A GOOD METHOD ON solution.js CAN ALWAYS CHECK IT

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "Tsh1end@",
  port: 5432,
});
db.connect();

//MYSQL DATABASE
var mySQL = mysql.createConnection({
  host     : 'localhost',
  user     : 'david',
  password : 'Password',
  database : 'david',
  port: 3306
});
 
mySQL.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body["username"];
  const password = req.body["password"];

  /*try{
    const checkResult = await db.query(
      "SELECT * FROM users WHERE email = $1", [email]);
    
    if(checkResult.rows.length > 0){
      res.send("Email already exists. Try logging in.");
    }else{
        const result = await db.query(
          "INSERT INTO users (email, password) VALUES ($1, $2)",
          [email, password]);
        console.log(result);
        res.render("secrets.ejs");
      } 
  }catch(err){
    console.log(err);
    res.sendStatus(500);
  }*/
  

});

app.post("/login", async (req, res) => {
  const email = req.body["username"];
  const password = req.body["password"];
  try{
    const checkResult = await db.query(
      "SELECT * FROM users WHERE email = $1", [email]
    );
    if(checkResult.rows.length < 1){
      res.send("Email doesn't exists. Try signing up.");
    }else {
      const result = await db.query(
        "SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]
      );
      if(result.rows.length < 1){
        res.send("Incorrect Password");
      } else {
        res.render("secrets.ejs");
      }
    }
  }catch(err){
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
