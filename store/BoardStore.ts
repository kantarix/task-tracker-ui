import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import { create } from 'zustand'

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

    searchString: string;
    setSearchString: (searchString: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>()
  },
  searchString: "",
  setSearchString: (searchString) => set ({ searchString }),

  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  updateTodoInDB: async(todo, columnId) => {
    var url = new URL("http://localhost:8080/api/tasks");
    url.searchParams.set('task_id', todo.id);
    url.searchParams.set('name', todo.name);
    url.searchParams.set('description', todo.description);
    url.searchParams.set('state', columnId);

    const res = await fetch(url.toString(), {
      method: 'PUT',
    })
  },
}))