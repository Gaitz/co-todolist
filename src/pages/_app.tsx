import "@shared/styles/globals.css";
import type { AppProps } from "next/app";
import store from "@shared/store";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "./api/socket";

export let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");
      socket = io();

      socket.on("connect", () => {
        console.log("connected");
        socket.emit("hello", "hello from client");
      });

      socket.on("hello", (msg) => {
        console.log(msg);
      });
    };
    socketInitializer();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
