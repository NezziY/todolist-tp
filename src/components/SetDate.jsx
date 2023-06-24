import { useState, useEffect } from 'react';


const SetDate = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);
  

  const formattedDate = date.toLocaleString('es', {
    day: 'numeric',
    weekday: 'long',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      <p className='text-3xl font-bold'>Planeador de Tareas</p>
        <div className='text-xl capitalize'>{formattedDate}</div>
    </div>
  );
};

export default SetDate;