import { Text } from 'components/ui/Text';
import { useState } from 'react';

export type MessageType = {
  type: 'success' | 'error';
  message: string | null;
};

export const useMessage = () => {
  const [message, setMessage] = useState<MessageType | null>(null);

  const showSuccess = (text: string) => {
    setMessage({ type: 'success', message: text });
    
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const showError = (text: string) => {
    setMessage({ type: 'error', message: text });
  };

  const clearMessage = () => {
    setMessage(null);
  };

  const MessageComponent = () => {
    if (!message) return null;

    return (
      <Text
        className={`mb-3 text-center ${
          message.type === 'success' ? 'text-green-500' : 'text-red-500'
        }`}>
        {message.message}
      </Text>
    );
  };

  return {
    message,
    setMessage,
    showSuccess,
    showError,
    clearMessage,
    MessageComponent
  };
};
