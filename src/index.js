import express  from "express";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const app = express();
const port = 8080;

app.use(express.json());

app.get('/', (request, response) => {
    response.send('Server Online');
})

app.listen(port,()=>{
    console.log("Server Online");
});

//banco de dados

const bankUsers = [];
const messages = [];
const newUserID = uuidv4()

//casdastro de usuario

app.post("/sign-up", async (request, response) =>{
    const { name, email, password } = request.body;
//validação de email

    if(!email){
        return response.status(400).json({
            message: 'E-mail obrigatório!'
        })
    }

    if(email){
        const userExists = bankUsers.find(user => user.email === email)
        if(userExists){
            return response.status(400).json({
                message: 'E-mail já cadastrado!'
            })
        }
    
    }

    const hasPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: newUserID,
        name,
        email,
        password: hasPassword,
    };

    bankUsers.push(newUser);

    response.status(201).json({
        message: 'Usuário criado com sucesso!',
        user: newUser
    });
})
