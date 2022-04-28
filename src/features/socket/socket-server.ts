import { Socket } from "socket.io";
import { ServerToClientEvents } from "./socket-client";
import {
  newTodoListTo,
  TodoListKey,
  TodoLists,
  NewTodoItemInput,
  newTodoItemTo,
  TodoListMetadata,
  UpdateTodoItemInput,
  updateTodoItemTo,
} from "@todoLists/todoListSlice";
import { UserEmail } from "@userAuthentication/userAuthenticationSlice";
import { socketServer } from "src/pages/api/socket";

export type ClientToServerEvents = {
  helloToServer: (msg: string) => void;
  signIn: (userEmail: string, res: (todoLists: TodoLists) => void) => void;
  addTodoList: (owner: UserEmail) => void;
  addTodoItem: (data: Omit<NewTodoItemInput, "id">) => void;
  updateTodoItem: ({
    targetOwner,
    targetTodoListKey,
    updateTodoItem,
  }: UpdateTodoItemInput) => void;
};

let persistedTodoLists: TodoLists = { todoLists: {} };

export const onConnection = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  // @ts-ignore
  console.log(`connection created, ${socket.id}`);

  socket.on("helloToServer", (msg) => {
    console.log(msg);
  });

  socket.on("signIn", (userEmail, res) => {
    // @ts-ignore
    socket.user = userEmail;
    res(persistedTodoLists);
  });

  socket.on("addTodoList", (owner) => {
    const todoListKey: TodoListKey = owner + "-" + new Date().toISOString();
    const todoListMetadata: TodoListMetadata = {
      owner,
      todoListKey,
    };

    socketServer.emit("addTodoList", todoListMetadata);

    newTodoListTo(todoListMetadata)(persistedTodoLists);
    console.log("create todo list,", todoListKey);
  });

  socket.on(
    "addTodoItem",
    ({ creator, description, targetListKey, targetOwner }) => {
      const todoItemId = targetListKey + new Date().toISOString();
      const newTodoItemInput: NewTodoItemInput = {
        creator,
        description,
        id: todoItemId,
        targetListKey,
        targetOwner,
      };

      socketServer.emit("addTodoItem", newTodoItemInput);

      newTodoItemTo(newTodoItemInput)(persistedTodoLists);
      console.log("create todo item,", creator, description);
    }
  );

  socket.on("updateTodoItem", (updateTodoItemInput) => {
    const { targetOwner, targetTodoListKey, updateTodoItem } =
      updateTodoItemInput;

    socket.broadcast.emit("updateTodoItem", updateTodoItemInput);

    updateTodoItemTo(updateTodoItemInput)(persistedTodoLists);
    console.log("update", targetOwner, targetTodoListKey, updateTodoItem);
  });
};
