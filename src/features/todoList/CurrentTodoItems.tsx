import { useSelector } from "react-redux";
import {
  selectCurrentTodoItems,
  toggleItemState,
  TodoItem,
} from "./todoListSlice";
import styles from "./todoList.module.css";
import { useAppDispatch } from "@shared/store";

const CurrentTodoItems = () => {
  const dispatch = useAppDispatch();
  const currentTodoItems = useSelector(selectCurrentTodoItems);

  const toggleStateHandler =
    (itemId: TodoItem["id"]) => (event: React.SyntheticEvent) => {
      event.stopPropagation();
      dispatch(toggleItemState({ itemId }));
    };

  return (
    <ul className={styles.todoItems}>
      {currentTodoItems.map((item) => (
        <li key={item.id}>
          <input
            type="checkbox"
            onChange={toggleStateHandler(item.id)}
            checked={item.isDone}
          />
          {item.description}
        </li>
      ))}
    </ul>
  );
};

export default CurrentTodoItems;
