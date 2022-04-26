import type { NextPage } from "next";
import Head from "next/head";
import styles from "@shared/styles/Layout.module.css";
import UserAuthentication from "@userAuthentication/UserAuthentication";
import TodoList from "src/features/todoList/TodoList";
import TodoListNavigation from "src/features/todoList/navigation/TodoListNavigation";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to co-todolist</h1>
        <UserAuthentication />
        <section className={styles.todoListContainer}>
          <TodoList />
          <TodoListNavigation />
        </section>
      </main>
    </div>
  );
};

export default Home;
