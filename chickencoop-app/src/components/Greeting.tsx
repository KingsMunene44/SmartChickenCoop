// src/components/Greeting.tsx

import { CalendarDays } from 'lucide-react';
import { useEffect, useState } from 'react';

const Greeting = () => {
  const [greeting, setGreeting] = useState('');
  const [date, setDate] = useState('');
  const [username, setUsername] = useState(''); // Will fetch from localStorage

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    let greet = '';

    if (hours < 12) greet = 'Good morning';
    else if (hours < 18) greet = 'Good afternoon';
    else greet = 'Good evening';

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const dateStr = now.toLocaleDateString(undefined, options);

    setGreeting(greet);
    setDate(dateStr);

    // Fetch username cleanly from localStorage and trim spaces
    const storedUser = localStorage.getItem('username');
    const cleanUser = storedUser && storedUser.trim() ? storedUser.trim() : '';
    setUsername(cleanUser);
  }, []);

  return (
    <div className="flex items-center gap-3 animate-fade-in">
      <CalendarDays className="w-8 h-8 text-blue-600" />
      <div>
        <h2 className="text-2xl font-semibold text-black-800">
          {greeting} {username || 'User'} 👋
        </h2>
        <p className="text-blue-950">{date}</p>
      </div>
    </div>
  );
};

export default Greeting;