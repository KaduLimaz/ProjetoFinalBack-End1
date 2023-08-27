import express, { json } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

const app = express();
const port = 8080;

app.use(express.json());

app.get("/", (request, response) => {
  response.send("Server Online");
});

app.listen(port, () => {
  console.log("Server Online");
});

//banco de dados

const bankUsers = [];
const messages = [];
const newUserID = uuidv4();

//casdastro de usuario

app.post("/sign-up", async (request, response) => {
  const { name, email, password } = request.body;
  //validação de email

  if (!email) {
    return response.status(400).json({
      message: "E-mail obrigatório!",
    });
  }

  if (email) {
    const userExists = bankUsers.find((user) => user.email === email);
    if (userExists) {
      return response.status(400).json({
        message: "E-mail já cadastrado!",
      });
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
    message: "Usuário criado com sucesso!",
    user: newUser,
  });
});

//login

app.post("/login", async (request, response) => {
  const { email, password } = request.body;

  const userValid = bankUsers.find((user) => user.email === email);

  if (!userValid) {
    return response.status(400).json({
      message: "Login ou senha incorreto",
    });
  }
  const passwordIsValid = await bcrypt.compare(password, userValid.password);

  if (!passwordIsValid) {
    return response.status(400).json({
      message: "Login ou senha incorreto",
    });
  }

  response.status(200).json({
    message: `Login realizado com sucesso! Bem vindo ${userValid.name}`,
  });
});

//Criar recado

app.post("/message/new", (request, response) => {
  const { title, description, userID } = request.body;

  const user = bankUsers.find((user) => user.id === userID);
  if (!user) {
    return response.status(400).json({
      message: "Usuário não encontrado!",
    });
  }
  const newMessage = {
    id: uuidv4(),
    title,
    description,
    userID,
  };

  if (!newMessage.title) {
    return response.status(400).json({
      message: "Título obrigatório!",
    });
  }
  messages.push(newMessage);

  response.status(201).json({
    message: "Recado criado com sucesso",
    newMessage,
  });
});

//listar Recados de um usuario

app.get("/message/:userID", (request, response) => {
  const { userID } = request.params;

  const user = bankUsers.find((user) => user.id === userID);
  if (!user) {
    return response.status(400).json({
      message: "Usuário não encontrado!",
    });
  }

  const filterMessagesUser = messages.filter(
    (menssage) => menssage.userID === userID
  );

  if (filterMessagesUser.length === 0) {
    return response.status(400).json({
      message: "Recado não encontrado!",
    });
  }
  return response.status(200).json(filterMessagesUser);
});

//atualizar recados de um usuario

app.put("/message/:messageID", (request, response) => {
  const { messageID } = request.params;
  const { title, description } = request.body;

  const messageIndex = messages.findIndex(
    (message) => message.id === messageID
  );

  if (messageIndex === -1) {
    return response.status(400).json({
      message: "Recado não encontrado!",
    });
  }

 

  messages[messageIndex].title = title;
  messages[messageIndex].description = description;

  

  return response.status(200).json({
    message: "Recado atualizado com sucesso!",
  });
});

//deletar recados de um usuario


app.delete("/message/:messageID", (request, response) => {
  const { messageID} = request.params;
  const messageIndex = messages.findIndex(
    (message) => message.id === messageID
  );
  if (messageIndex === -1) {
    return response.status(400).json({
      message: "Recado não encontrado!",
    });
  }
  messages.splice(messageIndex, 1);
  return response.status(200).json({
    message: "Recado deletado com sucesso!",
  });

})