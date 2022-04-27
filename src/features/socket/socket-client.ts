export type ServerToClientEvents = {
  restore: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  helloFromServer: (msg: string) => void;
};
