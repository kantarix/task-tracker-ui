interface Board {
    columns: Map<TypedColumn, Column>
}

type TypedColumn = "TODO" | "IN_PROGRESS" | "DONE"

interface Column {
    id: TypedColumn;
    todos: Todo[];
}

interface Todo {
    $id: string;
    $createdAt: string;
    name: string;
    description: String;
    state: TypedColumn;
    // image?: string;
}

// interface Image {
//     bucketId: string;
//     fileId: string;
// }