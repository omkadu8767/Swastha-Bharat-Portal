require('dotenv').config({ path: __dirname + '/.env' });
const path = require("path")
const connectToMongo = require("./db");
const express = require("express");
var cors = require('cors')
connectToMongo();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors())

//Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/book', require('./routes/book'));
app.use('/api/order', require('./routes/order'));
app.use('/api/admin', require('./routes/admin'));

// app.get("/", (req, res) => {
//     res.send("Hello World");
// })

const __dirname2 = path.resolve();

// app.use(express.static(path.join(__dirname2, "../dist")));

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname2, "../dist/index.html"));
// });


app.listen(PORT, () => {
    console.log(`Medportal Backend listening at http://localhost:${PORT}`);
});

