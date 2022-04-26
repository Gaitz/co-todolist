import styles from "./TodoListNavigation.module.css";
import { RootState } from "@shared/store";
import { useSelector } from "react-redux";

const TodoListNavigation = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.userAuthentication.isAuthenticated
  );

  return (
    <nav className={styles.nav}>
      <button disabled={!isAuthenticated}>Create a todo list</button>
      <ul>list all todo lists</ul>
    </nav>
  );
};

export default TodoListNavigation;
