const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");

app.set("/", "html");
app.use(express.static(path.join(__dirname, "/")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.render("index"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
