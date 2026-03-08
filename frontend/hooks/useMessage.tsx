import { useState } from 'react';

export type MessageType = {
  type: 'success' | 'error';
  message: string | null;
};

export const useMessage = () => {
  const [message, setMessage] = useState<MessageType | null>(null);

  const showSuccess = (text: string) => {
    setMessage({ type: 'success', message: text });
  };

  const showError = (text: string) => {
    setMessage({ type: 'error', message: text });
  };

  const clearMessage = () => {
    setMessage(null);
  };

  return {
    message,
    setMessage,
    showSuccess,
    showError,
    clearMessage,
  };
};