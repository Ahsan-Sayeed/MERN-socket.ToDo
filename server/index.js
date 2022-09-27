const Table = require("./db");
const express = require("express");
const app = express();
const { createServer } = require("http");
const { Server } = require("socket.io");
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", //client host
  },
});

io.on("connection", async (socket) => {
  console.log("socket connected");
  //socket create
  socket.on("create", async (msg) => {
    if (msg) {
      createTodo(msg);
      socket.emit("read", await readTodo());
    }
  });
  //socket read : runs while refreshing
  socket.emit("read", await readTodo());

  socket.on("update", async (msg) => {
    updateTodo(msg);
    socket.emit("read", await readTodo());
  });

  //socket delete
  socket.on("delete", async (msg) => {
    deleteTodo(msg);
    socket.emit("read", await readTodo());
  });
});

// create todo function
const createTodo = async (payload) => {
  const result = await Table.insertMany([
    {
      text: payload,
    },
  ]);
  await readTodo();
  console.log(result);
};
// read todo function
const readTodo = async () => {
  await Table.find({});
  return await Table.find({});
};
// update todo function
const updateTodo = async (payload) => {
  console.log(payload);
  const result = await Table.updateOne(
    {
      _id: payload.id,
    },
    {
      text: payload.text,
    }
  );
  await readTodo();
};

// delete todo function
const deleteTodo = async (payload) => {
  const result = await Table.deleteOne({ _id: payload });
  await readTodo();
};

server.listen(4000, () => {
  console.log("server is running at http://localhost:4000");
});
