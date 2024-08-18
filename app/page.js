'use client';

import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I am DewaAI. How can I assist your feelings today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleIconClick = (emotion) => {
    let prompt = '';
    switch (emotion) {
      case 'sad':
        prompt = "You seem to be feeling sad. Would you like to tell me more?";
        break;
      case 'happy':
        prompt = "You seem to be feeling happy! That's great to hear! What's making you feel this way?";
        break;
      case 'angry':
        prompt = "It looks like you're feeling angry. Do you want to talk about what's bothering you?";
        break;
      // Add more cases for different emotions
      default:
        prompt = 'How are you feeling today?';
    }

    setMessages((messages) => [
      ...messages,
      { role: 'assistant', content: prompt }
    ]);
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    const currentMessage = message;
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: currentMessage }
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: currentMessage }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const assistantContent = data.content;

      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: assistantContent }
      ]);

    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I apologize but I encountered an error. Please try again later :)" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box
      width="100vw"
      height="120vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      sx={{ backgroundColor: '#80CBC4' }}
    >
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={4}
      >
        <Stack
          direction={'column'}
          width="500px"
          height="600px"
          borderRadius={3}
          boxShadow={3}
          bgcolor="white"
          p={2}
          spacing={3}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h6" color='#80CBC4'>DewaAI</Typography>
          </Box>

          {/* Emotion Icons */}
          <Stack
            direction={'row'}
            justifyContent="space-around"
            alignItems="center"
            mb={2}
          >
            <img 
              src="/icons/sad-icon.JPEG" 
              alt="Sad" 
              style={{ cursor: 'pointer', width: '40px', height: '40px' }} 
              onClick={() => handleIconClick('sad')}
            />
            <img 
              src="/icons/happy-icon.JPEG" 
              alt="Happy" 
              style={{ cursor: 'pointer', width: '40px', height: '40px' }} 
              onClick={() => handleIconClick('happy')}
            />
            <img 
              src="/icons/angry-icon.JPEG" 
              alt="Angry" 
              style={{ cursor: 'pointer', width: '40px', height: '40px' }} 
              onClick={() => handleIconClick('angry')}
            />
            {/* Add more icons for other emotions */}
          </Stack>

          <Stack
            direction={'column'}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  sx={{
                    bgcolor: message.role === 'assistant' ? '#BDBDBD' : '#BDBDBD',
                    color: 'white',
                    borderRadius: 16,
                    p: 3,
                  }}
                >
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} style={{ margin: 0 }}>{line}</p>
                  ))}
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <TextField
              label="Message"
              bgcolor="white"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#80CBC4',
                  },
                  '&:hover fieldset': {
                    borderColor: '#BDBDBD',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#BDBDBD',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#80CBC4',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#BDBDBD',
                },
                '& .MuiInputBase-input': {
                  color: 'black',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={isLoading}
              sx={{
                bgcolor: '#80CBC4',
                '&:hover': {
                  bgcolor: '#BDBDBD',
                },
              }}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
