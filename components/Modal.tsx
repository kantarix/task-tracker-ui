'use client'
import { FormEvent, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useModalStore } from '@/store/ModalStore'
import { useBoardStore } from '@/store/BoardStore';
import TaskTypeRadioGroup from './TaskTypeRadioGroup';

function Modal() {
    const [addTask, newTaskNameInput, setNewTaskNameInput, newTaskDescInput, setNewTaskDescInput, newTaskType, taskId, updateTodoInDB] = useBoardStore((state) => [
        state.addTask,
        state.newTaskNameInput,
        state.setNewTaskNameInput,
        state.newTaskDescInput,
        state.setNewTaskDescInput,
        state.newTaskType,
        state.taskId,
        state.updateTodoInDB,
    ]);

    const [isOpen, closeModal] = useModalStore((state) => [
        state.isOpen,
        state.closeModal,
    ]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newTaskNameInput) return;

        if (taskId != -1) {
            updateTodoInDB({
                id: taskId.toString(),
                created_at: new Date(),
                name: newTaskNameInput,
                description: newTaskDescInput,
                state: newTaskType
            }, newTaskType);
        } else {
            addTask(newTaskNameInput, newTaskDescInput, newTaskType);
        }

        
        closeModal();
    }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="form" onSubmit={handleSubmit} className="relative z-10" onClose={closeModal}>
        <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900 pb-2"
                        >
                            Task
                        </Dialog.Title>

                    <div className='w-full py-2'>
                        <div className="mt-2">
                            <input 
                                type="text"
                                value={newTaskNameInput}
                                onChange={(e) => setNewTaskNameInput(e.target.value)}
                                placeholder="Enter task name here..."
                                className="w-full border border-gray-300 rounded-md outline-none p-5"
                            />
                        </div>
                        <div className="mt-2">
                            <input 
                                type="text"
                                value={newTaskDescInput}
                                onChange={(e) => setNewTaskDescInput(e.target.value)}
                                placeholder="Enter task description here..."
                                className="w-full border border-gray-300 rounded-md outline-none p-5 font-thin"
                            />
                        </div>
                    </div>

                    {taskId === -1 ? <TaskTypeRadioGroup /> : null }

                    <div>
                        <button
                            type="submit"
                            disabled={!newTaskNameInput}
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2
                            text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2
                            focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300
                            disabled:cursor-not-allowed"
                        >
                            Save Task
                        </button>
                    </div>
                    </Dialog.Panel>
                </Transition.Child>
            </div>
        </div>
        
      </Dialog>
    </Transition>
  );
}

export default Modal;