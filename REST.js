var mysql = require("mysql");
function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    router.get("/",function(req,res){
        console.log(req.body);
        res.json({"Message" : "Hello World !"});
    })
    router.post("/createUser", function(req,res){
      connection.query('select * from ServiceHolder where userEmail = ?', req.body.email, function(err,rows){
        if(err){
          res.json({"status" : 201, "Message" : "Problem to store your personal information. Please contact with Application supourt Center."});
        }else if(!rows.length){
            connection.query('select * from ServiceHolder where userPhone = ?', req.body.phone, function(err,rows){
              if(err){
                  res.json({"status" : 201, "Message" : "Problem to store your personal information. Please contact with Application supourt Center."});
              }else if(!rows.length){
                var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
                  var table = ["ServiceHolder","userName","userEmail","userPhone","userPass",req.body.name,req.body.email,req.body.phone,md5(req.body.password)];
                  query = mysql.format(query,table);
                  connection.query(query,function(err,rows){
                    if(err) {
                          res.json({"status" : 201, "Message" : "Problem to store your personal information. Please contact with Application supourt Center."});
                      } else {
                        connection.query('select * from ServiceHolder where userEmail = ?', req.body.email, function(err,rows){
                          if(!err){
                            res.json({"status" : 200, "Message": "Register Complete", "result":{"name":rows[0].userName, "token": md5(rows[0].userID)}});
                          }
                        })

                      }
                  });
              }else{
                  res.json({"status" : 201, "Message" : "Phone Number Aleady in this system. Please use different Phone Number"});
              }
            })

        }else{
            res.json({"status" : 201, "Message" : "Email Adrress Aleady in this system. Please use different email adrress"});
        }
      })
    });

    router.get("/login", function(req,res){
      var query = "SELECT * FROM ?? WHERE `userEmail` = ? AND `userPass` = ?";
      var table=["ServiceHolder", req.query.email,md5(req.query.password)]
      query = mysql.format(query,table);
      console.log(query);
      connection.query(query, function(err,rows){
        if(err){
          res.json({"status" : 201, "Message" : "Problem to contacted server. Please contact with Application supourt Center."});
        }else if(!rows.length){
          res.json({"status" : 201, "Message" : "userName or Password is wrong!"})
        }else if(( rows[0].userEmail == req.query.email)){
          res.json({"status" : 200, "result":{"name":rows[0].userName, "token": md5(rows[0].userID)}});
        }
      })
    })

    router.post("/setPush_id", function(req,res){
        var query = "UPDATE ?? SET `push_id` = ? WHERE `userID` = ?";
        var table=["ServiceHolder", req.body.push_id,req.body.token]
        query = mysql.format(query,table);
        console.log(query);
        connection.query(query, function(err,rows){
          if(err){
            res.json({"status" : 201, "Message" : "Problem to contacted server. Please contact with Application supourt Center."});
          }else if(rows.affectedRows ==1 ) {
              res.json({"status" : 201, "Message" : "Succssfully set push message"})
          }else{
              res.json({"status" : 201, "Message" : "Push message Update Fail"})
          }
        })
    })

    router.post("/request" , function(req,res){
      var query = "INSERT INTO ??(??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
      var table = ["request","userID","bedrooms","extra","date","note","status",req.body.token,req.body.bedrooms,req.body.extra,req.body.date,req.body.note,"0"];
      query = mysql.format(query,table);
      console.log(query);
      connection.query(query,function(err,rows){
        if(err) {
          res.json({"status" : 201, "Message" : "Problem to store your personal information. Please contact with Application supourt Center."});
        }else {
          res.json({"status" : 200, "Message" : "Request Submit Succssfully"});
        }
      })
    })

    router.get("/request", function(req,res){
      var query = "SELECT * FROM ?? WHERE `userID` = ? ";
      var table=["request", req.query.token]
      query = mysql.format(query,table);
      console.log(query);
      connection.query(query, function(err,rows){
        if(err){
          res.json({"status" : 201, "Message" : "Problem to contacted server. Please contact with Application supourt Center."});
        }else if(!rows.length){
          res.json({"status" : 201, "Message" : "Token is wrong!"})
        }else if(( rows[0].userID == req.query.token)){
          res.json({"status" : 200, "result":{rows}});
        }
      })
    })
}

module.exports = REST_ROUTER;
