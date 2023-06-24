import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";

const ListTask = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [closed, setClosed] = useState([]);

  useEffect(() => {
    setTodos(tasks.filter((task) => task.status === "todo"));
    setInProgress(tasks.filter((task) => task.status === "inprogress"));
    setClosed(tasks.filter((task) => task.status === "closed"));
  }, [tasks]);

  const statuses = ["todo", "inprogress", "closed"];

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // Si no hay destino o el destino es igual al origen, no se realiza ninguna acción
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const sourceColumn = getColumnById(source.droppableId);
    const destinationColumn = getColumnById(destination.droppableId);

    const sourceTasks = getColumnTasks(sourceColumn);
    const destinationTasks = getColumnTasks(destinationColumn);

    const [movedTask] = sourceTasks.splice(source.index, 1);
    destinationTasks.splice(destination.index, 0, movedTask);

    updateColumnTasks(sourceColumn, sourceTasks);
    updateColumnTasks(destinationColumn, destinationTasks);
  };

  const getColumnById = (id) => {
    if (id === "todo") {
      return "todo";
    } else if (id === "inprogress") {
      return "inprogress";
    } else if (id === "closed") {
      return "closed";
    }
  };

  const getColumnTasks = (column) => {
    if (column === "todo") {
      return todos;
    } else if (column === "inprogress") {
      return inProgress;
    } else if (column === "closed") {
      return closed;
    }
  };

  const updateColumnTasks = (column, updatedTasks) => {
    if (column === "todo") {
      setTodos(updatedTasks);
    } else if (column === "inprogress") {
      setInProgress(updatedTasks);
    } else if (column === "closed") {
      setClosed(updatedTasks);
    }
  };

  return (
    <div className="flex gap-16">
      <DragDropContext onDragEnd={onDragEnd}>
        {statuses.map((status, index) => (
          <Section
            key={index}
            status={status}
            tasks={tasks}
            setTasks={setTasks}
            todos={todos}
            inProgress={inProgress}
            closed={closed}
          />
        ))}
      </DragDropContext>
    </div>
  );
};

const Section = ({ status, tasks, setTasks, todos, inProgress, closed }) => {
  let text = "Pendientes";
  let bg = "bg-red-400";
  let tasksToMap = todos;

  if (status === "inprogress") {
    text = "En Proceso";
    bg = "bg-orange-400";
    tasksToMap = inProgress;
  }

  if (status === "closed") {
    text = "Finalizadas";
    bg = "bg-lime-600";
    tasksToMap = closed;
  }

  return (
    <div className={`w-64 h-96 min-h-96 rounded-md p-2 bg-neutral-300`}>
      <Header text={text} bg={bg} count={tasksToMap.length} />
      <Droppable droppableId={status}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {tasksToMap.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task
                      task={task}
                      tasks={tasks}
                      setTasks={setTasks}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

const Header = ({ text, bg, count }) => {
  return (
    <div className={`${bg} flex items-center justify-between h-12 px-4 rounded-md uppercase text-sm text-white`}>
      {text}
      <div className="ml-2 bg-white w-5 h-5 text-black rounded-full flex  justify-center">
        {count}
      </div>
    </div>
  );
};

const Task = ({ task, tasks, setTasks }) => {
  const handleRemove = (id) => {
    const fTasks = tasks.filter((t) => {
      return t.id !== id;
    });

    localStorage.setItem("tasks", JSON.stringify(fTasks));
    setTasks(fTasks);

    toast("Tarea Borrada", { icon: "👻" });
  };

  return (
    <div className={`relative p-4 bg-white rounded md mt-8 shadow-md cursor-grab`}>
      <p>{task.name}</p>
      <button className="absolute bottom-1  right-1 text-neutral-400" onClick={() => handleRemove(task.id)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>
  );
};

export default ListTask;
