import { useSelector } from "react-redux";
import {
  selectCurrentTodoList,
  selectCurrentTodoListKey,
  addTodoItem,
} from "./todoListSlice";
import styles from "./todoList.module.css";
import { useAppDispatch } from "@shared/store";

const CurrentTodoItems = () => {
  const currentTodoList = useSelector(selectCurrentTodoList);

  return (
    <ul className={styles.todoItems}>
      {currentTodoList.map((item) => (
        <li key={item.id}>
          <input type="checkbox" />
          {item.description}
        </li>
      ))}
    </ul>
  );
};

const TodoList = () => {
  const dispatch = useAppDispatch();

  const currentTodoList = useSelector(selectCurrentTodoList);
  const currentTodoListKey = useSelector(selectCurrentTodoListKey);

  if (currentTodoList === undefined) {
    return <p>Please create a todo list first</p>;
  }

  console.log("current", currentTodoList);

  const addTodoItemHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      description: { value: string };
    };
    const description = target.description.value;
    dispatch(addTodoItem({ description }));
    target.description.value = "";
  };

  return (
    <>
      <h2>{currentTodoListKey}</h2>
      <form className={styles.addTodoItemForm} onSubmit={addTodoItemHandler}>
        <p>Create a todo item with</p>
        <label htmlFor="description">description: </label>
        <input type="text" name="description" />
        <button type="submit">Add</button>
      </form>
      <CurrentTodoItems />
    </>
  );
};

export default TodoList;
