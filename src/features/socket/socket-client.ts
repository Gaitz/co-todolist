import { io, Socket } from "socket.io-client";
import { ClientToServerEvents } from "@socket/socket-server";
import { addTodoList } from "@todoLists/todoListSlice";
import { TodoListMetadata } from "@todoLists/todoListSlice";
import { AppDispatch } from "@shared/store";

export type ServerToClientEvents = {
  restore: () => void;
  helloFromServer: (msg: string) => void;
  addTodoList: ({ owner, todoListKey }: TodoListMetadata) => void;
};

export let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

export const initializeSocket = async (dispatch: AppDispatch) => {
  await fetch("/api/socket");
  socket = io();

  socket.on("connect", () => {
    console.log("socket connected");

    socket.emit("helloToServer", "hello from client");
  });

  socket.on("helloFromServer", (msg: string) => {
    console.log(msg);
  });

  socket.on("addTodoList", (todoListMetadata) => {
    console.log("addTodoList event", todoListMetadata);
    dispatch(addTodoList(todoListMetadata));
  });
};
