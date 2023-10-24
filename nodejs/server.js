var express = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql");
var nodemailer = require("nodemailer");

var app = express();
app.use(express.static("public"));
app.listen(2023, function () {
    console.log("Server Started....");
})
//----------------
var dbConfigurationObj = {
    host: "localhost",
    user: "root",
    password: "",
    database: "carecenter"
};
//---------------
app.get("/", function (req, resp) {
    var filePath = __dirname + "/public/index.html";
    resp.sendFile(filePath);
})
//--------------

var dbRef = mysql.createConnection(dbConfigurationObj);
dbRef.connect(function (Err) {
    if (Err == null)
        console.log("Connected Successfullyyy...");
    else
        console.log(Err.toString());
})
//-----signup----------
app.get("/db-signup", function (req, resp) {
    var data = [req.query.email, (req.query.pwd), req.query.type,];
    var mailer = req.query.email;
    dbRef.query("insert into users value(?,?,?,1)", data, function (err) {
        if (err)
            resp.send("Invalid");
        else {
            resp.send("You have signed successfully");
            var transport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "muskaan.in2808@gmail.com",
                    pass: "ujvtzghgxvpxjzqi"
                }
            });
            var mailoptions = {
                from: "muskaan.in2808@gmail.com",
                to: mailer,
                subject: "sending Email using nodejs",
                text: "Sign up successfully"
            };

            transport.sendMail(mailoptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("Email sent:" + info.response);
                }
            });
        }
    });
});
//---validations-----
app.get("/rightEmail", function (req, resp) {

    dbRef.query("select * from users where emailid=? ", [req.query.ServerEmailid], function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else if (table.length == 1)
            resp.send("Already Exists");
        else
            resp.send("Congratulations you are available");
    })
})
//-------------login-----------------------------
app.get("/db-login", function (req, resp) {
    var data = [req.query.email, req.query.pwd];
    console.log(req.query);
    dbRef.query("select * from users where emailid=? and pwd=?", data, function (err, table) {

        if (err) {
            resp.send(err);
        }
        else if (table.length == 1) {
            if (table[0].utype == "Client") {
                resp.send("1");
                console.log(req.query);
            }
            else if (table[0].utype == "Care Taker") {
                resp.send("2");
            }
        }
        else
            resp.send("Invalid Data");

    });
});
//-------------------
app.use(express.urlencoded({ extended: true }));
app.use(fileuploader());
//---save-client---
app.post("/save-process-post", function (req, resp) {
    console.log(req.body);
    var fullPath = process.cwd() + "/public/uploads/" + req.files.ppic.name;
    req.files.ppic.mv(fullPath, function (err) {
        if (err)
            console.log(err.toString());
        else
            console.log("Fileuploaded Successfully with data=" + JSON.stringify(req.body));
    })
    var data = [req.body.emailid, req.body.name, req.body.mob, req.body.add, req.body.city, req.body.state, req.body.id, req.files.ppic.name];
    dbRef.query("insert into client value(?,?,?,?,?,?,?,?)", data, function (err) {

        if (err == null)
            resp.send("<h2><center>You have signed up successfullyyyyyyy");
        else
            resp.send(err.toString());
    });
});
//--validations---
app.get("/chkEmail", function (req, resp) {
    dbRef.query("select * from client where emailid=? ", [req.query.forServerEmailid], function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else if (table.length == 1)
            resp.send("Already Exists");
        else
            resp.send("Congrats Avilable");
    })
})
//---search-user---
app.get("/searchUser", function (req, resp) {
    dbRef.query("select * from client where emailid=? ", [req.query.ServerEmailid], function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else
            resp.send(table);//sending JSON - Array of JSON objects

    })
})
//---updations--
app.post("/update-process-post", function (req, resp) {
    var ppicName;
    if (req.files == null) {
        ppicName = req.body.hdn;
    }
    else {
        var fullPath = process.cwd() + "/public/uploads/" + req.files.ppic.name;
        ppicName = req.files.ppic.name;
        req.files.ppic.mv(fullPath, function (err) {
            if (err)
                console.log(err.toString());
            else
                console.log("Fileuploaded Successfully with data=" + JSON.stringify(req.body));
        })
    }
    console.log(req.body);
    var dataAry = [req.body.name, req.body.mob, req.body.add, req.body.city, req.body.state, req.body.id, ppicName, req.body.emailid];
    dbRef.query('update client set name=?, contact=?, address=?,city=?,state=?,proof=?,ppic=? where emailid=? ', dataAry, function (err) {
        if (err == null)
            resp.send("<h2><center>Record Updated successfullyyyyyyy");
        else
            resp.send(err.toString());
    })
});
//----caretaker signup----
app.post("/signup-process-post", function (req, resp) {
    console.log(req.body);
    var fullPath = process.cwd() + "/public/uploads/" + req.files.ppic.name;
    req.files.ppic.mv(fullPath, function (err) {
        if (err)
            console.log(err.toString());
        else
            console.log("Fileuploaded Successfully with data=" + JSON.stringify(req.body));
    })
    var data = [req.body.email, req.body.name, req.body.mob, req.body.add, req.body.web, req.body.city, req.body.pin, req.body.state, req.body.selpets, req.files.ppic.name];
    dbRef.query("insert into caretaker value(?,?,?,?,?,?,?,?,?,?)", data, function (err) {
        console.log(req.body);
        if (err == null)
            resp.send("<h2><center>U have signed up successfullyyyyyyy");
        else
            resp.send(err.toString());
    });
});
//----validations---
app.get("/goodEmail", function (req, resp) {
    dbRef.query("select * from caretaker where emailid=? ", [req.query.ServerEmailid], function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else if (table.length == 1)
            resp.send("User exists");
        else
            resp.send("New user");
    });
});
//---search-user---
app.get("/search-user", function (req, resp) {
    dbRef.query("select * from caretaker where emailid=? ", [req.query.ServerEmailid], function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else
            resp.send(table);

    })
})
//-----update---
app.post("/updates-process-post", function (req, resp) {
    var ppicName;
    if (req.files == null) {
        ppicName = req.body.hdn;
    }
    else {
        var fullPath = process.cwd() + "/public/uploads/" + req.files.ppic.name;
        ppicName = req.files.ppic.name;
        req.files.ppic.mv(fullPath, function (err) {
            if (err)
                console.log(err.toString());
            else
                console.log("Fileuploaded Successfully with data=" + JSON.stringify(req.body));
        })
    }
    console.log(req.body);
    var dataAry = [req.body.name, req.body.mob, req.body.add, req.body.web, req.body.city, req.body.pin, req.body.state, req.body.selpets, ppicName, req.body.email];
    dbRef.query('update caretaker set name=?, contact=?, address=?,website=?,city=?,pin=?,state=?,selpets=?,ppic=? where emailid=? ', dataAry, function (err) {
        if (err == null)
            resp.send("<h2><center>Record Updated successfullyyyyyyy");
        else
            resp.send(err.toString());
    })
});
//--------users show all---------------
app.get("/show-users", function (req, resp) {
    console.log(req.query);

    dbRef.query("select * from users ", function (err, table) {

        if (err != null)
            resp.send(err.toString());

        else resp.send(table);
    })
})
//------client show all-----
app.get("/showUsers", function (req, resp) {
    console.log(req.query);

    dbRef.query("select * from client ", function (err, table) {

        if (err != null)
            resp.send(err.toString());

        else resp.send(table);
    })
})
//-------caretaker show all-----
app.get("/show-all-Users", function (req, resp) {
    console.log(req.query);

    dbRef.query("select * from caretaker ", function (err, table) {

        if (err != null)
            resp.send(err.toString());

        else
            resp.send(table);
    })
})
//----blocking user----------
app.get("/block-user", function (req, resp) {
    console.log(req.query);
    var dataAry = [req.query.ServerEmailid];
    dbRef.query('update users set status=0 where emailid=? ', dataAry, function (err) {
        if (err == null)
            resp.send("User blocked successfully");
        else
            resp.send(err.toString());
    })
});
//----------resuming user-------- 
app.get("/resume-user", function (req, resp) {
    console.log(req.query);
    var dataAry = [req.query.Serveremailid];
    dbRef.query('update users set status=1 where emailid=?', dataAry, function (err) {
        if (err == null)
            resp.send("User resumed successfully");
        else
            resp.send(err.toString());
    })
});
//--------------------------
app.get("/fetch-all-cities", function (req, resp) {
    console.log(req.query);
    dbRef.query("select distinct city from caretaker", function (err, table) {
        console.log(table);
        if (err != null)
            resp.send(err.toString());

        else
            resp.send(table);
    })
})
//-----------care-taker-finder-------------------------------------------
app.get("/fetch-city-and-pets-all", function (req, resp) {

    console.log(req.query);
    var dataAry = [req.query.cityForServer, "%" + req.query.petForServer + "%"];
    dbRef.query("select * from caretaker where city=? and selpets like ?", dataAry, function (err, table) {

        if (err != null)
            resp.send(err.toString());

        else resp.send(table);
    })
})
//---------------client change password-----------------------------------------------------------
app.get("/change-password", function (req, resp) {
    var email = req.query.Email;
    var oldpass = req.query.oldpass;
    var newpass = req.query.newpass;

    var data = [email, oldpass, newpass];
    dbRef.query("select * from users where emailid=? and pwd=?", data, function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else if (table.length == 1) {
            if (newpass) {
                if (table[0].utype == "Client") {
                    var data = [newpass, email];
                    dbRef.query("update users set pwd=? where emailid=?", data, function (err, result) {
                        if (err != null)
                            resp.send(err.toString());
                        else
                            resp.send("Change Password Successfully.....");
                    });
                }
                else {
                    resp.send("U Are Not Client");
                }
            }
            else {
                resp.send("Fill New Password");
            }
        }
        else
            resp.send("Plz Check Your Email Or Old Password");
    })
});
//--------------care taker change password--------------------------------------------------------------
app.get("/changepassword", function (req, resp) {
    var email = req.query.Email;
    var oldpass = req.query.oldpass;
    var newpass = req.query.newpass;

    var data = [email, oldpass, newpass];
    dbRef.query("select * from users where emailid=? and pwd=?", data, function (err, table) {
        if (err != null)
            resp.send(err.toString());
        else if (table.length == 1) {
            if (newpass) {
                if (table[0].utype == "Care Taker") {
                    var data = [newpass, email];
                    dbRef.query("update users set pwd=? where emailid=?", data, function (err, result) {
                        if (err != null)
                            resp.send(err.toString());
                        else
                            resp.send("Change Password Successfully.....");
                    });
                }
                else {
                    resp.send("U Are Not Care Taker");
                }
            }
            else {
                resp.send("Fill New Password");
            }
        }
        else
            resp.send("Plz Check Your Email Or Old Password");
    })
});
