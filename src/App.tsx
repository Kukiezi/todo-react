import {
    Dispatch,
    FormEvent,
    forwardRef,
    memo,
    ReactNode,
    SetStateAction,
    useCallback,
    useRef,
    useState,
} from "react";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const FlexItem = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

type ToDoItem = {
    name: string;
    status: "COMPLETED" | "IN_PROGRESS";
};

const App = () => {
    const [toDoItems, setToDoItems] = useState<Array<ToDoItem>>([]);
    const [newToDo, setNewToDo] = useState<string>("");

    const submitNewToDoItem = useCallback(() => {
        const newToDoitem: ToDoItem = {
            name: newToDo,
            status: "IN_PROGRESS",
        };

        setToDoItems((prev) => [...prev, newToDoitem]);
        setNewToDo("");
    }, [newToDo]);

    const removeToDoItem = useCallback((toDoItem: ToDoItem) => {
        const newItems = [...toDoItems].filter((item) => item.name !== toDoItem.name);
        setToDoItems(newItems);
    }, [toDoItems]);

    const completeToDoItem = useCallback((toDoItem: ToDoItem) => {
        setToDoItems((prev) =>
            prev.map((item) => {
                if (item.name === toDoItem.name) {
                    return {
                        ...toDoItem,
                        status:
                            toDoItem.status === "COMPLETED"
                                ? "IN_PROGRESS"
                                : "COMPLETED",
                    };
                }
                return item;
            })
        );
    }, []);

    const updateItemName = useCallback((existingToDo: ToDoItem, newTodoName: string) => {
        setToDoItems((prev) =>
            prev.map((item) => {
                if (item.name === existingToDo.name) {
                    return {
                        ...item,
                        name: newTodoName,
                    };
                }
                return item;
            })
        );
    }, []);

    return (
        <Container>
            <FlexItem>
                <h1>TODO APP</h1>
            </FlexItem>
            <FlexItem>
                <Form onSubmit={submitNewToDoItem}>
                    <Input value={newToDo} onChange={setNewToDo} />
                </Form>
            </FlexItem>
            <FlexItem>
                <ToDoList
                    todos={toDoItems}
                    removeItem={removeToDoItem}
                    markAsCompleted={completeToDoItem}
                    updateItemName={updateItemName}
                />
            </FlexItem>
        </Container>
    );
};

type ListProps = {
    todos: Array<ToDoItem>;
    removeItem: (toDoItem: ToDoItem) => void;
    markAsCompleted: (toDoItem: ToDoItem) => void;
    updateItemName: (existingToDo: ToDoItem, newTodoName: string) => void;
};

const CompletedTodo = styled.span`
    text-decoration: line-through;
    color: gray;
`;
const InProgressTodo = styled.span`
    color: black;
`;

const ToDoList = ({
    todos,
    removeItem,
    markAsCompleted,
    updateItemName,
}: ListProps) => {
    return (
        <ul>
            {todos.map((todo) => (
                <ToDoItem
                    key={todo.name}
                    todo={todo}
                    markAsCompleted={markAsCompleted}
                    removeItem={removeItem}
                    updateItemName={updateItemName}
                />
            ))}
        </ul>
    );
};

type ToDoItemProps = {
    todo: ToDoItem;
    removeItem: (toDoItem: ToDoItem) => void;
    markAsCompleted: (toDoItem: ToDoItem) => void;
    updateItemName: (existingToDo: ToDoItem, newTodoName: string) => void;
};
const ToDoItem = memo(({
    todo,
    removeItem,
    markAsCompleted,
    updateItemName,
}: ToDoItemProps) => {
    const [editing, setEditing] = useState<boolean>(false);
    const [todoDraft, setTodoDraft] = useState(todo.name);
    const completeEdit = () => {
        setTodoDraft(todoDraft);
        setEditing(false);
        updateItemName(todo, todoDraft);
    };
    console.log(todo.name)
    return (
        <li key={todo.name}>
            {todo.status === "COMPLETED" ? (
                <CompletedTodo>{todo.name}</CompletedTodo>
            ) : editing ? (
                <Form onSubmit={completeEdit}>
                    <Input
                        onChange={setTodoDraft}
                        value={todoDraft}
                    />
                </Form>
            ) : (
                <InProgressTodo>{todo.name}</InProgressTodo>
            )}
            <button
                onClick={() => {
                    markAsCompleted(todo);
                }}
            >
                ✅
            </button>
            {todo.status === "IN_PROGRESS" && (
                <button
                    onClick={() => {
                        setEditing(true);
                    }}
                >
                    ✍️
                </button>
            )}

            <button
                onClick={() => {
                    removeItem(todo);
                }}
            >
                ❌
            </button>
        </li>
    );
});

type FormProps = {
    onSubmit: () => void;
    children: ReactNode;
};
const Form = ({ children, onSubmit }: FormProps) => {
    const submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit();
    };
    return <form onSubmit={(e) => submitForm(e)}>{children}</form>;
};

type InputProps = {
    onChange: Dispatch<SetStateAction<string>>;
    value: string;
};

const Input = ({ onChange, value }: InputProps) => {
    return (
        <input
            name="todoItem"
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default App;
