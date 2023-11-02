interface Board {
    columns: Map<TypedColumn, Column>
}

type TypedColumn = "TODO" | "IN_PROGRESS" | "DONE"

interface Column {
    id: TypedColumn;
    todos: Todo[];
}

interface Todo {
    id: string;
    created_at: Date;
    name: string;
    description: string;
    state: TypedColumn;
}

interface User {
    id: string;
    created_at: Date;
    username: string;
    email: string;
    password: string;
}