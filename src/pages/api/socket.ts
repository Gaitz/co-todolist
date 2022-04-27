// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";
import { ServerToClientEvents } from "@socket/socket-client";
import { ClientToServerEvents, onConnection } from "@socket/socket-server";

type InterServerEvents = {
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

    io.on("connection", onConnection);
  }

  res.end();
}
