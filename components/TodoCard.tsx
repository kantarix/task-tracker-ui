'use client'

import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { 
    DraggableProvidedDragHandleProps, 
    DraggableProvidedDraggableProps 
} from "react-beautiful-dnd";

type Props = {
    todo: Todo;
    index: number;
    id: TypedColumn;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
    todo,
    index,
    id,
    innerRef,
    draggableProps,
    dragHandleProps,
}: Props) {
    const [setNewTaskType, setNewTaskNameInput, setNewTaskDescInput, setTaskId] = useBoardStore((state) => [
        state.setNewTaskType,
        state.setNewTaskNameInput,
        state.setNewTaskDescInput,
        state.setTaskId,
    ]);
    const deleteTask = useBoardStore((state) => state.deleteTask);
    const openModal = useModalStore((state) => state.openModal);
    
    const handleEditTodo = () => {
        setTaskId(Number(todo.id));
        setNewTaskNameInput(todo.name);
        setNewTaskDescInput(todo.description);
        setNewTaskType(id);
        openModal();
    }

  return (
    <div
        className="bg-white rounded-md space-y-2 drop-shadow-md pr-5"
        {...draggableProps} 
        {...dragHandleProps} 
        ref={innerRef}
        >
            <div className="flex justify-between items-center">
                <div onClick={handleEditTodo} className="flex w-full h-full p-5">
                    <p>{todo.name}</p>
                </div>
                <button onClick={() => deleteTask(index, todo, id)} className="text-red-500 hover:text-red-600">
                    <XCircleIcon className="ml-5 h-8 w-8" />
                </button>
            </div>

    </div>
    );
}

export default TodoCard