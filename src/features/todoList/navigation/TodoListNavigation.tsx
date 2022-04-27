import styles from "./TodoListNavigation.module.css";
import { RootState, useAppDispatch } from "@shared/store";
import { addTodoList, TodoListKey } from "@todoLists/todoListsSlice";
import { useSelector } from "react-redux";

const TodoListNavigation = () => {
  const dispatch = useAppDispatch();

  const user = useSelector((state: RootState) => state.userAuthentication);
  const isAuthenticated = user.isAuthenticated;

  const todoLists = useSelector(
    (state: RootState) => state.todoLists.todoLists
  );

  const onCreateTodoList = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      const userEmail = user.userEmail;
      dispatch(addTodoList({ userEmail }));
    }
  };

  let lists;
  if (Object.keys(todoLists).length === 0) {
    lists = <p>will list all todo lists</p>;
  } else {
    lists = Object.keys(todoLists).map((owner: string) => {
      const todoList = todoLists[owner];
      console.log(todoList);
      return (
        <section key={owner}>
          <p>{owner}</p>
          <ul>
            {Object.keys(todoList).map((todoListKey: TodoListKey) => {
              return <li key={todoListKey}>{todoListKey}</li>;
            })}
          </ul>
        </section>
      );
    });
  }

  return (
    <nav className={styles.nav}>
      <button disabled={!isAuthenticated} onClick={onCreateTodoList}>
        Create a todo list
      </button>
      {lists}
    </nav>
  );
};

export default TodoListNavigation;
