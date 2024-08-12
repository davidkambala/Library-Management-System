import express from "express";
import bodyParser from "body-parser";
import mysql from 'mysql';
import bcrypt, { hash } from 'bcrypt';


const app = express();
const port = 3000;
const saltRounds = 10;
let groupName = "";

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

  try{
    mySQL.query(
      'SELECT * FROM users WHERE Username = ?', [email], function (error, results,fields) {
        if(error) throw error;
        console.log(results.length);
        if(results.length > 0){
            res.send("Email already exists. Try logging in.");
          }else{
               //Password hashing
              bcrypt.hash(password, saltRounds, (err, hash) => {
                if(err){
                  console.log("Error Hashing Password", err);
                }else{
                  mySQL.query(
                    'INSERT INTO users (Username, Password) VALUES (?, ?)', [email, hash], function (error, results, fields) {
                      if(error) throw error;
                      console.log(results);
                      getBooksData(function(error, data){
                        if(error){
                          console.error('Error fetching data:', error);
                        } else{
                          getUserID(email, function(error, userID) {
                            if (error) {
                              console.error(error);
                            } else {
                              console.log("UserID:", userID);
                              res.render("books.ejs", {
                                bookList: data,
                                myID: userID
                              })
                            }
                          })
                        }
                      })
                    });
                }
              })
            } 
      });

    
  }catch(err){
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/login", (req, res) => {
  const email = req.body["username"];
  const loginPassword = req.body["password"];
  try{
    mySQL.query(
        'SELECT * FROM users WHERE Username = ?', [email], function (error, results,fields) {
          if(error) throw error;
          if(results.length < 1){
              res.send("Username doesn't exists. Try signing up.");
            }else{
                const storedHashedPassword = results[0].Password;
                bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
                  if(err){
                    console.log("Error Comparing Passwords:", err);
                  }else{
                    console.log(result);
                    if(result){
                      //query to get the User ID
                      getUserID(email, function(error, userID) {
                        if (error) {
                          console.error(error);
                        } else {
                          console.log("UserID:", userID);
                        //Start
                        mySQL.query('SELECT * from groupName WHERE Username = ?', [email], function (error, results, fields){
                          if(error) throw error;
                          groupName = results[0].GroupName;
                          console.log(groupName);
                          if(groupName == "admin"){
                            getUserData(function(error, data){
                              if(error){
                                console.error('Error fetching data:', error);
                              } else{
                                res.render("main.ejs", {
                                  userTable: data,
                                  myID: userID
                                })}
                            })
                          } else if(groupName == "customer"){
                            getBooksData(function(error, data){
                              if(error){
                                console.error('Error fetching data:', error);
                              } else{
                                res.render("books.ejs", {
                                  bookList: data,
                                  myID: userID
                                })}
                            })
                          }
                          else if(groupName == "library staff"){
                            getReservationsData(function(error, data){
                              if(error){
                                console.error('Error fetching data:', error);
                              } else{
                                console.log(data);
                                res.render("reservations.ejs", {
                                  bookList: data,
                                  myID: userID
                                })
                              }
                          
                            })
                          }
                        })
                      }
                    });

                      //close above
                    }else{
                      res.send("Incorrect Password");
                    }
                  }
                })
              } 
        });

  }catch(err){
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/delete", (req, res) => {
  const deleteID = req.body["userId"];
  console.log(req.body["userId"]);
  mySQL.query('DELETE FROM users WHERE UserID = ?', [deleteID], function(error, results, fields){
    if(error) throw error;
    console.log("User " + deleteID + " deleted successfully");
  })
  res.redirect("/");
})

app.post("/approve", (req, res) => {
  const user = req.body["userID"];
  const book = req.body["bookID"];

  mySQL.query('INSERT INTO books_transactions (UserID, BookID, TransactionDate, ReturnDate) VALUES (?, ?, CURRENT_DATE(), CURRENT_DATE() + 14)',
  [user, book], function (error, result, fields){
  if(error) throw error;
  console.log("Inserted");
  })

  mySQL.query('DELETE FROM reservations WHERE BookID = ?', [book], function(error, results, fields){
    if(error) throw error;
    console.log("Book " + book + " Borrowed");
  })
    getReservationsData(function(error, data){
      if(error){
        console.error('Error fetching data:', error);
      } else{
        console.log(data);
        res.render("reservations.ejs", {
          bookList: data,
          myID: user
        })
      }
    })
 
})

app.post("/reserve", (req, res) => {
  const bookID = req.body["bookId"];
  const user = req.body["currentUser"];
  const status = "no";
  mySQL.query("INSERT INTO reservations (UserID, BookID, ReservationDate) VALUES (?, ?, CURRENT_DATE())",
    [user, bookID], function(error, results, fields){
    if(error) throw error;
    mySQL.query('UPDATE books SET Available = ? WHERE BookID = ? ', [status, bookID], function(error, results, fields){
      if (error) throw error;
      
      getBooksData(function(error, data){
        if(error){
          console.error('Error fetching data:', error);
        } else{
          res.render("books.ejs", {
            bookList: data,
            myID: user
          })
        }
    
      })
    })
  })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function getUserData(callback){
  let queryResult = [];
  mySQL.query('SELECT * FROM AllUsers', function(error, results, fields){
    if(error) {
      callback(error, null);
    }else{
    for(let i = 0; i < results.length; i++){
      queryResult.push(results[i]);
    }
    callback(null, queryResult)
    }
  })
}
function getBooksData(callback){
  let queryResult = [];
  mySQL.query('SELECT * FROM booklist', function(error, results, fields){
    if(error) {
      callback(error, null);
    }else{
    for(let i = 0; i < results.length; i++){
      queryResult.push(results[i]);
    }
    callback(null, queryResult)
    }
  })
}

function getReservationsData(callback){
  let queryResult = [];
  mySQL.query('SELECT * FROM reservationlist', function(error, results, fields){
    if(error) {
      callback(error, null);
    }else{
    for(let i = 0; i < results.length; i++){
      queryResult.push(results[i]);
    }
    callback(null, queryResult)
    }
  })
}

function getUserID(name, callback) {
  mySQL.query("SELECT UserID FROM users WHERE Username = ?", [name], function(error, results, fields) {
    if (error) return callback(error, null);
    if (results.length > 0) {
      callback(null, results[0].UserID);
    } else {
      callback(new Error("User not found"), null);
    }
  });
}