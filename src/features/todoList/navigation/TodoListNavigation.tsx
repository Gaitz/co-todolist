import styles from "./TodoListNavigation.module.css";
import { RootState, useAppDispatch } from "@shared/store";
import {
  selectTodoLists,
  selectCurrentTodoListKey,
  addTodoList,
  TodoListKey,
  switchTodoList,
  addTodoListToServer,
} from "@todoLists/todoListSlice";
import { useSelector } from "react-redux";

const TodoListNavigation = () => {
  const dispatch = useAppDispatch();

  const user = useSelector((state: RootState) => state.userAuthentication);
  const isAuthenticated = user.isAuthenticated;

  const currentTodoListKey = useSelector(selectCurrentTodoListKey);
  const todoLists = useSelector(selectTodoLists);

  const onCreateTodoList = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      const userEmail = user.userEmail;
      dispatch(addTodoListToServer({ userEmail }));
    }
  };

  const onClickTodoList =
    (owner: string, targetTodoListKey: TodoListKey) =>
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      dispatch(switchTodoList({ owner, targetTodoListKey }));
    };

  let lists;
  if (Object.keys(todoLists).length === 0) {
    lists = <p>will list all todo lists</p>;
  } else {
    lists = Object.keys(todoLists).map((owner: string) => {
      const todoList = todoLists[owner];
      return (
        <section key={owner}>
          <p>{owner}</p>
          <ul>
            {Object.keys(todoList).map((todoListKey: TodoListKey) => {
              return (
                <li
                  key={todoListKey}
                  onClick={onClickTodoList(owner, todoListKey)}
                  className={
                    todoListKey === currentTodoListKey
                      ? styles.currentTodoList
                      : styles.todoList
                  }
                >
                  {todoListKey}
                </li>
              );
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
