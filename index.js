//Base dependencies
const express = require("express");
const cors = require("cors");

//Import routes
const postRouter = require('./posts/postsRoutes');

const server = express();
server.use(cors());
server.use(express.json());
server.use('/api/posts', postRouter)



server.listen(5000, ()=>{
    console.log(`Server listening on port 5000`);
    
})