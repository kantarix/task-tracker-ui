export const getTodosGroupedByColumn = async () => {
    // const data = await databases.listDocuments(
    //     process.env.NEXT_PUBLIC_DATABASE_ID!,
    //     process.env.NEXT_PUBLIC_TOOLS_COLLECTION_ID!
    // );

    const data = await fetch('http://localhost:8080/api/tasks');
    const todos = await data.json();

    const columns = todos.reduce((acc, todo) => {
        if (!acc.get(todo.state)) {
            acc.set(todo.id, {
                id: todo.state,
                todos: []
            })
        }

        acc.get(todo.id)!.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            name: todo.name,
            state: todo.state
            // ...acc(json.image && { image: JSON.parse(json.image) })
        })
        console.log(acc);
        return acc;

    }, new Map<TypedColumn, Column>)
};