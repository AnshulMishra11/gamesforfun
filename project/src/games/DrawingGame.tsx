import React, { useState, useRef, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import { RotateCcw, Home, Send, Save, Trash2 } from 'lucide-react';

export const DrawingGame: React.FC = () => {
  const { setActiveGame } = useGameContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [username, setUsername] = useState('');
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(true);
  const [randomWord, setRandomWord] = useState('');
  const [isDrawer, setIsDrawer] = useState(false);
  
  const colors = ['#000000', '#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff00ff', '#00ffff', '#ff9900'];
  const sizes = [2, 5, 10, 15, 20];
  
  const words = [
    'cat', 'dog', 'house', 'tree', 'car', 'sun', 'moon', 'star', 
    'fish', 'flower', 'book', 'chair', 'table', 'computer', 'phone',
    'bicycle', 'banana', 'apple', 'pizza', 'soccer', 'basketball'
  ];
  
  const returnToHome = () => {
    setActiveGame(null);
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawer) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    
    const rect = canvas.getBoundingClientRect();
    const x = e instanceof MouseEvent ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = e instanceof MouseEvent ? e.clientY - rect.top : e.touches[0].clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawer) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    let x: number, y: number;
    
    if (e instanceof MouseEvent) {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    } else {
      // TouchEvent
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const newMessage = `${username}: ${currentMessage}`;
    setMessages([...messages, newMessage]);
    
    // Check if the message is correct (simulated guessing)
    if (!isDrawer && currentMessage.toLowerCase().includes(randomWord.toLowerCase())) {
      setMessages([...messages, newMessage, '🎉 System: Correct guess! The word was "' + randomWord + '"']);
      setTimeout(() => {
        switchRoles();
      }, 2000);
    }
    
    setCurrentMessage('');
  };
  
  const handleUsernameSubmit = (name: string) => {
    setUsername(name || 'Player');
    setShowUsernamePrompt(false);
    startGame();
  };
  
  const startGame = () => {
    clearCanvas();
    selectRandomWord();
    simulateJoinedPlayers();
  };
  
  const selectRandomWord = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setRandomWord(word);
    setIsDrawer(true);
    setMessages([...messages, '🎮 System: You are drawing! The word is "' + word + '"']);
  };
  
  const simulateJoinedPlayers = () => {
    const botPlayers = ['Alex', 'Taylor', 'Jamie'];
    setMessages([
      '🎮 System: Welcome to the Drawing Challenge!',
      '🎮 System: ' + botPlayers.join(', ') + ' joined the game.'
    ]);
  };
  
  const switchRoles = () => {
    setIsDrawer(!isDrawer);
    clearCanvas();
    
    if (!isDrawer) {
      // Now becoming the drawer
      selectRandomWord();
    } else {
      // Now becoming a guesser
      const newWord = words[Math.floor(Math.random() * words.length)];
      setRandomWord(newWord);
      setMessages([...messages, '🎮 System: Now you are guessing! Someone else is drawing.']);
      simulateDrawing();
    }
  };
  
  const simulateDrawing = () => {
    // This would simulate another player drawing when you're guessing
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Simple drawing simulation
    setTimeout(() => {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 5;
      ctx.beginPath();
      
      if (randomWord === 'sun') {
        // Draw a simple sun
        ctx.arc(300, 200, 50, 0, Math.PI * 2);
        ctx.stroke();
        // Draw rays
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          ctx.beginPath();
          ctx.moveTo(300 + 50 * Math.cos(angle), 200 + 50 * Math.sin(angle));
          ctx.lineTo(300 + 80 * Math.cos(angle), 200 + 80 * Math.sin(angle));
          ctx.stroke();
        }
      } else if (randomWord === 'house') {
        // Draw a simple house
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.lineTo(400, 200);
        ctx.lineTo(400, 300);
        ctx.lineTo(200, 300);
        ctx.closePath();
        ctx.stroke();
        // Roof
        ctx.beginPath();
        ctx.moveTo(200, 200);
        ctx.lineTo(300, 150);
        ctx.lineTo(400, 200);
        ctx.stroke();
        // Door
        ctx.strokeRect(275, 250, 50, 50);
      } else {
        // Generic scribble for other words
        ctx.beginPath();
        ctx.moveTo(100, 200);
        for (let i = 0; i < 10; i++) {
          ctx.lineTo(100 + i * 50, 200 + Math.sin(i) * 50);
        }
        ctx.stroke();
      }
      
      // Simulate bot guesses after some time
      setTimeout(() => {
        const botGuess = Math.random() > 0.7; // 30% chance a bot will guess correctly
        if (botGuess) {
          const botName = ['Alex', 'Taylor', 'Jamie'][Math.floor(Math.random() * 3)];
          setMessages(prev => [...prev, `${botName}: Is it a ${randomWord}?`]);
          setMessages(prev => [...prev, `🎉 System: ${botName} guessed correctly!`]);
          setTimeout(switchRoles, 2000);
        } else {
          simulateWrongGuesses();
        }
      }, 5000);
    }, 1000);
  };
  
  const simulateWrongGuesses = () => {
    const wrongGuesses = [
      'Is it a boat?',
      'Looks like a tree to me',
      'Maybe a car?',
      'I think it\'s a bird!'
    ];
    
    const botNames = ['Alex', 'Taylor', 'Jamie'];
    
    // Simulate a bot making a wrong guess
    const botName = botNames[Math.floor(Math.random() * botNames.length)];
    const wrongGuess = wrongGuesses[Math.floor(Math.random() * wrongGuesses.length)];
    
    setMessages(prev => [...prev, `${botName}: ${wrongGuess}`]);
  };
  
  useEffect(() => {
    // Initialize canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Fill with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={returnToHome}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <Home size={16} /> Home
        </button>
        <h2 className="text-2xl font-bold text-center text-indigo-700">Drawing Challenge</h2>
        <button 
          onClick={clearCanvas}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
          disabled={!isDrawer}
        >
          <Trash2 size={16} /> Clear
        </button>
      </div>
      
      {showUsernamePrompt ? (
        <div className="text-center p-6 mb-4 bg-indigo-50 rounded-lg">
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Enter Your Name</h3>
          <input
            type="text"
            placeholder="Your name"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit(username)}
          />
          <button
            onClick={() => handleUsernameSubmit(username)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden border-2 border-indigo-300 mb-4">
              {isDrawer && (
                <div className="bg-indigo-100 p-2 text-center">
                  <p className="font-bold text-indigo-800">Your word: <span className="text-pink-600">{randomWord}</span></p>
                </div>
              )}
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              ></canvas>
            </div>
            
            {isDrawer && (
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-2 mr-4">
                  <span className="text-sm font-medium">Color:</span>
                  <div className="flex gap-1">
                    {colors.map((c) => (
                      <button
                        key={c}
                        className={`w-6 h-6 rounded-full ${color === c ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                      ></button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Brush size:</span>
                  <div className="flex gap-1">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${brushSize === s ? 'bg-indigo-100 border-indigo-500' : 'border-gray-300'}`}
                        onClick={() => setBrushSize(s)}
                      >
                        <div 
                          className="rounded-full bg-black" 
                          style={{ width: `${s}px`, height: `${s}px` }}
                        ></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg border-2 border-indigo-300 overflow-hidden flex flex-col h-[500px]">
            <div className="bg-indigo-600 text-white p-2">
              <h3 className="font-bold">Chat</h3>
            </div>
            
            <div className="flex-grow p-3 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`mb-2 p-2 rounded ${message.startsWith('🎮') || message.startsWith('🎉') ? 'bg-indigo-50 text-indigo-800' : 'bg-gray-100'}`}>
                  {message}
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 p-2 flex">
              <input
                type="text"
                placeholder={isDrawer ? "Can't guess while drawing..." : "Type your guess..."}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isDrawer}
              />
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r disabled:bg-indigo-300"
                onClick={sendMessage}
                disabled={isDrawer || !currentMessage.trim()}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-center text-gray-600 text-sm">
        {isDrawer ? (
          <p>You are drawing. Others are trying to guess your word!</p>
        ) : (
          <p>Try to guess what's being drawn in the chat!</p>
        )}
      </div>
    </div>
  );
};