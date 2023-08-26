import express  from "express";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const app = express();
const port = 8080;

app.get('/', (require, response) => {
    response.send('Server Online');
})

app.listen(port,()=>{
    console.log("Server Online");
});