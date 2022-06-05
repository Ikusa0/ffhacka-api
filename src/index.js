const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.get(`/api`, async (req, res) => {
  res.json({ up: true });
});

app.get(`/api/seed`, async (req, res) => {
  const seedUser = {
    email: "test@gmail.com",
    name: "Jane",
    password: "123",
    cpf: "000.000.000-00",
  };

  try {
    await prisma.user.deleteMany({
      where: {
        email: "test@gmail.com",
      },
    });

    const result = await prisma.user.create({
      data: seedUser,
    });
    res.json(result);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

app.post(`/api/create_user`, async (req, res) => {
  const result = await prisma.user.create({
    data: {
      ...req.body,
    },
  });
  res.json(result);
});

app.delete(`/api/delete_user/:id`, async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.json(user);
});

app.get("/api/get_users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get("/api/get_user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.json(user);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(
    `🚀 Server ready at: http://localhost:${PORT}\n⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`
  )
);
