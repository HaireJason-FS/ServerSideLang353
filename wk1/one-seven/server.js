// const http = require('http');
// require('dotenv').config();
// const app = require('./app');

// const server = http.createServer(app);

// server.listen(process.env.PORT, () => {
//     console.log(`Server is running on port ${process.env.PORT}`);
// });

const http = require('http');
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});