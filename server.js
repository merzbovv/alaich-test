import express from "express";
import cors from "cors";
import {v4 as uuidv4} from 'uuid';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Для обработки JSON-запросов

// Объект для хранения сессии
const sessions = {};

// Два пользователя для примера
const authUsers = [
  {id: 1, fullname: "Artem", email: "a1996@gmail.com", password: "123456"},
  {id: 2, fullname: "Bob", email: "a2002@gmail.com", password: "qwerty"}
];

const authors = [
  {
    "authorId": 1,
    "name": "Walt Disney"
  },
  {
    "authorId": 2,
    "name": "Mark Twain"
  },
  {
    "authorId": 3,
    "name": "Albert Einstein"
  }
]

const authorsQuote = [
  {
    "quoteId": 1,
    "authorId": 1,
    "quote": "The more you like yourself, the less you are like anyone else, which makes you unique."
  },
  {
    "quoteId": 2,
    "authorId": 1,
    "quote": "Disneyland is a work of love. We didn't go into Disneyland just with the idea of making money."
  },
  {
    "quoteId": 3,
    "authorId": 1,
    "quote": "I always like to look on the optimistic side of life, but I am realistic enough to know that life is a complex matter."
  },
  {
    "quoteId": 4,
    "authorId": 2,
    "quote": "The secret of getting ahead is getting started."
  },
  {
    "quoteId": 5,
    "authorId": 2,
    "quote": "Part of the secret of a success in life is to eat what you like and let the food fight it out inside."
  },
  {
    "quoteId": 6,
    "authorId": 2,
    "quote": "You can't depend on your eyes when your imagination is out of focus."
  },
  {
    "quoteId": 7,
    "authorId": 3,
    "quote": "Look deep into nature, and then you will understand everything better."
  },
  {
    "quoteId": 8,
    "authorId": 3,
    "quote": "Learn from yesterday, live for today, hope for tomorrow. The important thing is not to stop questioning."
  },
  {
    "quoteId": 9,
    "authorId": 3,
    "quote": "The only source of knowledge is experience."
  }
]

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

app.get("/author", (req, res) =>
{
  const token = req.query.token;
  if (token.length === 0)
  {
    return res.status(403).json({success: false, data: {message: "Access denied."}});
  }
  else
  {
    // Получаем случайное число от 1-3
    const randomNumber = Math.floor(Math.random() * 3) + 1;
    const author = authors.find((u) => u.authorId === randomNumber);
    return res.status(200).json({success: true, data: {authorId: author.authorId, name: author.name}});
  }
})

app.get("/quote", (req, res) =>
{
  const token = req.query.token;
  const authorId = req.query.authorId;
  if (token.length === 0)
  {
    return res.status(403).json({success: false, data: {message: "Access denied."}});
  }
  else
  {
    // Создаем новый массив filteredQuotes, в который попадают только подходящие элементы.
    const filteredQuotes = authorsQuote.filter(item => item.authorId === Number(authorId));
    // Берем случайный элемент из отфильтрованного массива
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    return res.status(200).json({
      success: true,
      data: {quoteId: randomQuote.quoteId, authorId: randomQuote.authorId, quote: randomQuote.quote}
    });
  }
})

// Разлогируем пользователя, удаляем токен из сессии
app.delete("/logout", (req, res) =>
{
  const token = req.query.token;
  delete sessions[token];
  return res.status(200).json({success: true, data: {}});
})

// Получение информации о профиле
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