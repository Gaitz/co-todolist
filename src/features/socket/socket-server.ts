import { Socket } from "socket.io";
import { ServerToClientEvents } from "./socket-client";
import {
  newTodoListHelper,
  TodoListKey,
  TodoLists,
} from "@todoLists/todoListSlice";
import { UserEmail } from "@userAuthentication/userAuthenticationSlice";
import { prependListener } from "process";

export type ClientToServerEvents = {
  helloToServer: (msg: string) => void;
  signIn: (userEmail: string, res: (todoLists: TodoLists) => void) => void;
  addTodoList: (owner: UserEmail) => void;
};

let persistedTodoLists: TodoLists = { todoLists: {} };

export const onConnection = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  // @ts-ignore
  console.log(`connection created, ${socket.id}`);

  socket.on("helloToServer", (msg) => {
    console.log(msg);
    // socket.broadcast.emit("helloFromServer", `${msg} through server`);
  });

  socket.on("signIn", (userEmail, res) => {
    // @ts-ignore
    socket.user = userEmail;
    res(persistedTodoLists);
  });

  socket.on("addTodoList", (owner) => {
    const todoListKey: TodoListKey = owner + "-" + new Date().toISOString();
    console.log("create todo list,", todoListKey);
    socket.broadcast.emit("addTodoList", { owner, todoListKey });
    newTodoListHelper(persistedTodoLists)({ owner, todoListKey });
  });
};
