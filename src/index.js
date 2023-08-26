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

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: newUserID,
        name,
        email,
        password: hashPassword,
    };

    bankUsers.push(newUser);

    response.status(201).json({
        message: 'Usuário criado com sucesso!',
        user: newUser
    });
})

//login

app.post("/login", async (request, response)=>{
    const { email, password } = request.body;

    const userValid = bankUsers.find(user => user.email === email);

    if(!userValid){
        return response.status(400).json({
            message: 'Login ou senha incorreto'
        });
    }
    const passwordIsValid = await bcrypt.compare(password, userValid.password);


    if(!passwordIsValid){
        return response.status(400).json({
            message: 'Login ou senha incorreto'
        })
    }
 

    response.status(200).json({
        message: `Login realizado com sucesso! Bem vindo ${userValid.name}`,
        
    })

   
})
