// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

export type ServerToClientEvents = {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  hello: (msg: string) => void;
};

export type ClientToServerEvents = {
  hello: (msg: string) => void;
};

export type InterServerEvents = {
  ping: () => void;
};

let socketServer: Server;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (socketServer === undefined) {
    const io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents
      // @ts-ignore
    >(res.socket.server);
    socketServer = io;

    io.on("connection", (socket) => {
      console.log("connection created");
      socket.on("hello", (msg) => {
        console.log(msg);
        socket.broadcast.emit("hello", `${msg} through server`);
      });
    });
  }

  res.end();
}
