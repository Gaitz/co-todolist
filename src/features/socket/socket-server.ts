import { Socket } from "socket.io";

export type ServerToClientEvents = {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  hello: (msg: string) => void;
};

export const onConnection = (socket: Socket) => {
  console.log("connection created");

  socket.on("hello", (msg) => {
    console.log(msg);
    socket.broadcast.emit("hello", `${msg} through server`);
  });
};
