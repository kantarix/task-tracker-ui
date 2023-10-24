import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
    taskId: number;
    newTaskNameInput: string;
    newTaskDescInput: string;
    newTaskType: TypedColumn;

    searchString: string;
    setSearchString: (searchString: string) => void;

    addTask: (todoName: string, todoDesc: string, columnId: TypedColumn) => void;
    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;

    setTaskId: (input: number) => void;
    setNewTaskNameInput: (input: string) => void;
    setNewTaskDescInput: (input: string) => void;
    setNewTaskType: (columnId: TypedColumn) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>()
  },
  searchString: "",
  newTaskNameInput: "",
  newTaskDescInput: "",
  newTaskType: "TODO",
  taskId: -1,

  setSearchString: (searchString) => set ({ searchString }),

  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns);
    
    newColumns.get(id)?.todos.splice(taskIndex, 1);

    set({ board: { columns: newColumns } });

    const res = await fetch("http://localhost:8080/api/tasks/" + todo.id, {
      method: 'DELETE',
    });
  },

  setTaskId: (input: number) => set({ taskId: input }),

  setNewTaskNameInput: (input: string) => set({ newTaskNameInput: input }),

  setNewTaskDescInput: (input: string) => set({ newTaskDescInput: input }),

  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),

  updateTodoInDB: async(todo, columnId) => {
    set({ newTaskNameInput: "" });
    set({ newTaskDescInput: "" });
    set({ taskId: -1 });

    var url = new URL("http://localhost:8080/api/tasks");
    url.searchParams.set('task_id', todo.id);
    url.searchParams.set('name', todo.name);
    url.searchParams.set('description', todo.description);
    url.searchParams.set('state', columnId);

    const res = await fetch(url.toString(), {
      method: 'PUT',
    })

    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        id: todo.id,
        created_at: new Date(),
        name: todo.name,
        description: todo.description,
        state: columnId,
      };

      let todoEdit = newColumns.get(columnId)?.todos.find(todo => todo.id === newTodo.id);
      if (todoEdit) {
        todoEdit.name = newTodo.name;
        todoEdit.description = newTodo.description;
        todoEdit.state = newTodo.state;
      }
      
      return {
        board: {
          columns: newColumns,
        }
      }
    })
  },

  addTask: async (todoName: string, todoDesc: string, columnId: TypedColumn) => {
    var url = new URL("http://localhost:8080/api/tasks");
    url.searchParams.set('name', todoName);
    url.searchParams.set('description', todoDesc);
    url.searchParams.set('state', columnId);

    const res = await fetch(url.toString(), {
      method: 'PUT',
    });

    const todo = await res.json();
    const id = todo.id;
    const createdAt = todo.created_at;

    set({ newTaskNameInput: "" });
    set({ newTaskDescInput: "" });
    set({ taskId: -1 });

    set((state) => {
      const newColumns = new Map(state.board.columns);
      const newTodo: Todo = {
        id: id,
        created_at: createdAt,
        name: todoName,
        description: todoDesc,
        state: columnId,
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        }
      }
    })
  },

}))