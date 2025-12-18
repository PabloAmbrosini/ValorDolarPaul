import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen.tsx';
import MonthlyScreen from './components/MonthlyScreen.tsx';
import QueryScreen from './components/QueryScreen.tsx';

type Screen = 'HOME' | 'MONTHLY' | 'QUERY';

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
    // Simple state to force re-mounting and trigger animations if needed, 
    // though the key prop on the conditional rendering is often enough.

    const handleNavigate = (screen: string) => {
        setCurrentScreen(screen as Screen);
    };

    return (
        <div className="bg-[#0b1118] text-white min-h-screen flex justify-center font-sans">
            <div className="w-full max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden relative min-h-screen border-x border-slate-800/50">
                {currentScreen === 'HOME' && <HomeScreen onNavigate={handleNavigate} />}
                {currentScreen === 'MONTHLY' && <MonthlyScreen onNavigate={handleNavigate} />}
                {currentScreen === 'QUERY' && <QueryScreen onNavigate={handleNavigate} />}
            </div>
        </div>
    );
};

export default App;