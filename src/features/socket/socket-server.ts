import { Socket } from "socket.io";
import { ServerToClientEvents } from "./socket-client";
import { TodoLists, initialState } from "@todoLists/todoListSlice";

export type ClientToServerEvents = {
  helloToServer: (msg: string) => void;
  signIn: (userEmail: string, res: (todoLists: TodoLists) => void) => void;
};

let todoListState: TodoLists = { todoLists: {} };

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
    res(todoListState);
  });
};
