export const getTodosGroupedByColumn = async () => {
    // const data = await databases.listDocuments(
    //     process.env.NEXT_PUBLIC_DATABASE_ID!,
    //     process.env.NEXT_PUBLIC_TOOLS_COLLECTION_ID!
    // );

    const data = await fetch('http://localhost:8080/api/tasks');
    const todos = await data.json();

    const columns = todos.reduce((acc, todo) => {
        if (!acc.get(todo.state)) {
            acc.set(todo.state, {
                id: todo.state,
                todos: []
            })
        }

        acc.get(todo.state)!.todos.push({
            id: todo.id.toString(),
            created_at: todo.created_at,
            name: todo.name,
            description: todo.description,
            state: todo.state
            // ...acc(json.image && { image: JSON.parse(json.image) })
        })
        
        return acc;

    }, new Map<TypedColumn, Column>)

    // if columns doesn't have inprogress, todo and done, add them with empty todos
    const columnTypes: TypedColumn[] = ["TODO", "IN_PROGRESS", "DONE"];
    
    for (const columnType of columnTypes) {
        if(!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: [],
            })
        }
    }

    // sort columns by columnTypes

    const sortedColumns = new Map(
        Array.from(columns.entries()).sort(
            (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        )
    );

    console.log(sortedColumns);

    const board: Board = {
        columns: sortedColumns
    };

    return board;

};