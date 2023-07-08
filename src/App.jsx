import { useEffect } from 'react';
import {useState} from 'react';
import CreateTask from './components/CreateTask';
import ListTask from './components/ListTasks';
import SetDate from './components/SetDate';
import { Toaster } from 'react-hot-toast';


function App() {

    const [tasks, setTasks] = useState([]);

    console.log("tasks", tasks);

    useEffect(() => {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    }, []);

  return (
    <div className='pantalla-principal min-h-screen'>
      <Toaster />
        <div className='bg-neutral-400 min-w-[1024px] flex justify-around items-end h-32 py-8'>
          <SetDate />
          <CreateTask tasks={tasks} setTasks={setTasks} />
        </div>

        <div className='bg-neutral-200 min-w-[1024px] h-screen justify-center flex gap-16 pt-16'>
          
          <ListTask tasks={tasks} setTasks={setTasks}/>
        </div>
    </div>
    
  );
}

export default App;
