const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
const https = require("https");
const http = require("http");
const client = require("@mailchimp/mailchimp_marketing");
const port = 3000;

client.setConfig({
  apiKey: "98ce010510e6ed1e8f0f81024ca73f07-us20",
  server: "us20",
});

app.use(express.static("public"));
app.use(express.static(__dirname));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const fname = req.body.fName;
  const lname = req.body.lName;
  const email = req.body.email;

  const subscribingUser = {
    firstName: fname,
    lastName: lname,
    email: email,
  };

  // console.log(subscribingUser);

  // async function run() {
  //   const response = await client.lists.createList({
  //     name: "subcribed users",
  //   });
  // }

  // run();

  const run = async () => {
    const response = await client.lists.addListMember("a7f36a5341", {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });

    res.sendFile(__dirname + "/success.html");
    console.log`Successfully added contact as an audience member. The contact's id is ${response.id}`;
  };

  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(port, function () {
  console.log(`Example app listening at http://localhost:${port}`);
});
