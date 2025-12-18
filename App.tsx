import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen.tsx';
import MonthlyScreen from './components/MonthlyScreen.tsx';
import QueryScreen from './components/QueryScreen.tsx';

type Screen = 'HOME' | 'MONTHLY' | 'QUERY';

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');

    const handleNavigate = (screen: string) => {
        setCurrentScreen(screen as Screen);
    };

    return (
        <div className="bg-background-dark min-h-screen flex justify-center">
            <div className="w-full max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden relative min-h-screen">
                {currentScreen === 'HOME' && <HomeScreen onNavigate={handleNavigate} />}
                {currentScreen === 'MONTHLY' && <MonthlyScreen onNavigate={handleNavigate} />}
                {currentScreen === 'QUERY' && <QueryScreen onNavigate={handleNavigate} />}
            </div>
        </div>
    );
};

export default App;