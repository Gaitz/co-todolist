import { useSelector } from "react-redux";
import {
  selectCurrentTodoList,
  selectCurrentTodoListKey,
  addTodoItemToServer,
} from "./todoListSlice";
import styles from "./todoList.module.css";
import { useAppDispatch } from "@shared/store";
import CurrentTodoItems from "./CurrentTodoItems";

const TodoList = () => {
  const dispatch = useAppDispatch();

  const currentTodoList = useSelector(selectCurrentTodoList);
  const currentTodoListKey = useSelector(selectCurrentTodoListKey);

  if (currentTodoList === undefined) {
    return <p>Please create a todo list first</p>;
  }

  const addTodoItemHandler = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      description: { value: string };
    };
    const description = target.description.value;
    const { owner, todoListKey } = currentTodoList.metadata;
    dispatch(
      addTodoItemToServer({
        description,
        targetListKey: todoListKey,
        targetOwner: owner,
      })
    );
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
