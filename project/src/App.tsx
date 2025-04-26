import React, { useState } from 'react';
import { GameHub } from './components/GameHub';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GameContextProvider } from './context/GameContext';

function App() {
  return (
    <GameContextProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 to-purple-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <GameHub />
        </main>
        <Footer />
      </div>
    </GameContextProvider>
  );
}

export default App;