import styles from "./TodoListNavigation.module.css";
import { RootState, useAppDispatch } from "@shared/store";
import { addTodoList } from "@todoLists/todoListsSlice";
import { useSelector } from "react-redux";
import { socket } from "src/pages/_app";

const TodoListNavigation = () => {
  const dispatch = useAppDispatch();

  const user = useSelector((state: RootState) => state.userAuthentication);
  const isAuthenticated = user.isAuthenticated;

  const onCreateTodoList = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      const userEmail = user.userEmail;
      dispatch(addTodoList({ userEmail }));
      socket.emit("hello", `hello from ${userEmail}`);
    }
  };

  return (
    <nav className={styles.nav}>
      <button disabled={!isAuthenticated} onClick={onCreateTodoList}>
        Create a todo list
      </button>
      <ul>list all todo lists</ul>
    </nav>
  );
};

export default TodoListNavigation;
