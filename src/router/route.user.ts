import { Router } from "express";
import { randomUUID } from "node:crypto";
import { Database } from "../database";

const userRoute = Router();

const database = new Database();

const table = "user";

userRoute.get("/", (request, response) => {
  const user = database.select(table);
  response.json(user);
});

userRoute.get("/:id", (request, response) => {
  const { id } = request.params;

  const result = database.select(table, id);

  // console.log(result, " - ", typeof result);

  if (result === undefined)
    response.status(400).json({ msg: "Usuário não encontrado!" });

  response.json(result);
});

// Parâmetro que esta vindo do CLIENTE - REQUEST
// Parâmetro que esta indo para o CLIENTE - RESPONSE

userRoute.post("/", (request, response) => {
  const { name, email, endereco, CEP, CPF, saldo } = request.body;

  const user = {
    id: randomUUID(),
    name: name,
    email: email,
    endereco: endereco,
    CEP: CEP,
    CPF: CPF,
    saldo: saldo,

  };

  database.insert(table, user);

  response.status(201).json({ msg: "sucesso!" });
});

userRoute.delete("/:id", (request, response) => {
  const { id } = request.params;

  const userExist: any = database.select(table, id);

  // console.log(result, " - ", typeof result);

  if (userExist === undefined)
    return response.status(400).json({ msg: "Usuário não encontrado!" });

  database.delete(table, id);

  response
    .status(202)
    .json({ msg: `Usuário ${userExist.name} foi deletado do banco` });
});

userRoute.put("/:id", (request, response) => {
  const { id } = request.params;
  const { name, email, endereco, CEP, CPF, saldo } = request.body;

  const userExist: any = database.select(table, id);
  if (userExist === undefined)
    return response.status(400).json({ msg: "Usuário não encontrado!" });

  database.update(table, id, { name, email, endereco, CEP, CPF, saldo });

  response.status(201).json({ msg: `O ID: {${id}} foi alterado no banco` });
});




//============================================================================================================================================================




const router = Router();

let users = [
  {
    id: 1,
    nome: 'usuario1',
    email: 'usuario1@gmail.com',
    valor: 100.0
  },
  {
    id: 2,
    nome: 'usuario2',
    email: 'usuario2@gmail.com',
    valor: 200.0
  }
];

router.get('/users', (req, res) => {
  res.json(users);
});

userRoute.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado!' });
  }
  res.json(user);
});

userRoute.post('/users', (req, res) => {
  const { nome, email, valor } = req.body;
  const id = users.length + 1;
  const user = { id, nome, email, valor };
  users.push(user);
  res.json(user);
});

userRoute.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado!' });
  }
  const { nome, email, valor } = req.body;
  user.nome = nome;
  user.email = email;
  user.valor = valor;
  res.json(user);
});

userRoute.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.json({ message: 'User deleted' });
});

userRoute.post('/users/:id/deposit', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado!' });
  }
  const { amount } = req.body;
  user.valor += amount;
  res.json(user);
});

userRoute.post('/users/:id/withdraw', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado!' });
  }
  const { amount } = req.body;
  if (user.valor < amount) {
    return res.status(400).json({ message: 'Valor insuficiente' });
  }
  user.valor -= amount;
  res.json(user);
});



//Esse sempre vai por último
export { userRoute };
