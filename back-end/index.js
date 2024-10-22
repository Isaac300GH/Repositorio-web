/* const http = require('http');
const port = 5000;

const server = http.createServer((req, res) => res.end("HOLA :D"));
server.listen(port, () => console.log("Funcionó")); */
const express = require('express');
const app = express();
const port = 5000;

app.get("/", (req, res) => res.send("HOLA :D"));
app.get("/lapapaya", (req, res) => res.send("papasha"));
app.listen(port, () => console.log("funcionó"));
