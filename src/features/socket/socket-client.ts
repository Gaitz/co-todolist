import { io, Socket } from "socket.io-client";
import { ClientToServerEvents } from "@socket/socket-server";
import {
  addTodoList,
  newTodoItem,
  updateTodoItem,
  NewTodoItemInput,
  UpdateTodoItemInput,
} from "@todoLists/todoListSlice";
import { TodoListMetadata } from "@todoLists/todoListSlice";
import { AppDispatch } from "@shared/store";

export type ServerToClientEvents = {
  restore: () => void;
  helloFromServer: (msg: string) => void;
  addTodoList: ({ owner, todoListKey }: TodoListMetadata) => void;
  addTodoItem: (newTodoItemInputs: NewTodoItemInput) => void;
  updateTodoItem: (updateTodoItemInput: UpdateTodoItemInput) => void;
};

export let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

export const initializeSocket = async (dispatch: AppDispatch) => {
  await fetch("/api/socket");
  socket = io({ autoConnect: false });

  socket.on("connect", () => {
    console.info("socket connected");
  });

  socket.on("helloFromServer", (msg: string) => {
    console.log(msg);
  });

  socket.on("addTodoList", (todoListMetadata) => {
    dispatch(addTodoList(todoListMetadata));
  });

  socket.on("addTodoItem", (newTodoItemInputs) => {
    dispatch(newTodoItem(newTodoItemInputs));
  });

  socket.on("updateTodoItem", (updateTodoItemInput) => {
    dispatch(updateTodoItem(updateTodoItemInput));
  });
};
