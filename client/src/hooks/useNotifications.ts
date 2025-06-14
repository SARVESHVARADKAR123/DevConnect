import { useState } from 'react';

export const useNotifications = () => {
  const [message, setMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return { message, notify };
};