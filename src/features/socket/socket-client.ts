import { socket } from "src/pages/_app";
import { ClientToServerEvents } from "@socket/socket-server";

export type ServerToClientEvents = {
  restore: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
  helloFromServer: (msg: string) => void;
  addTodoList: ({ owner, todoListKey }) => void;
};
