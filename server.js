import express from "express";
import cors from "cors";
import {v4 as uuidv4} from 'uuid';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Для обработки JSON-запросов

const sessions = {};

const authUsers = [
  {id: 1, fullname: "Artem", email: "a1996@gmail.com", password: "123456"},
  {id: 2, fullname: "Bob", email: "a2002@gmail.com", password: "qwerty"}
];

// Получение информации о компании
app.get("/info", (req, res) =>
{
  return res.status(200).json({success: true, data: {info: "Some information about the <b>company</b>."}});
});

// Авторизация по email и password
app.post("/login", (req, res) =>
{
  let token = "";
  let userId = null;
  authUsers.forEach((item) =>
  {
    if (req.body.email === item.email && req.body.password === item.password)
    {
      token = uuidv4();
      userId = item.id;
    }
  })
  if (token.length === 0)
  {
    return res.status(403).json({success: false, data: {message: "Access denied."}});
  }
  else
  {
    // Сохраняем токен в sessions
    sessions[token] = userId;
    return res.status(200).json({success: true, data: {token: token}});
  }
});

// Разголируем пользователя, удаляем токен из сессии
app.delete("/logout", (req, res) =>
{
  const token = req.query.token;
  delete sessions[token];
  return res.status(200).json({success: true, data: {}});
})

// Получение информации о компании
app.get("/profile", (req, res) =>
{
  const token = req.query.token;
  // Найти пользователя по ID
  const user = authUsers.find((u) => u.id === sessions[token]);
  return res.status(200).json({success: true, data: {fullname: user.fullname, email: user.email}});
});

// Запуск сервера
app.listen(PORT, () =>
{
  console.log(`Mock API запущен на http://localhost:${PORT}`);
});