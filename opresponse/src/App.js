import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import './index.css';

import SetupScreen from './components/SetupScreen';
import MapView from './components/MapView';
import Sidebar from './components/Sidebar';
import ReportModal from './components/ReportModal';

import { DISASTERS } from './utils/constants';
import { generateAgents, moveTowardsCenter } from './utils/helpers';

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function App() {
  const [currentScreen, setCurrentScreen] = useState('setup'); // 'setup' | 'simulation'
  const [disaster, setDisaster] = useState(null);
  const [severity, setSeverity] = useState('Medium');
  const [timeStepIndex, setTimeStepIndex] = useState(0); // 0, 1, 2, 3
  const [agents, setAgents] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const handleLaunch = (disasterId, selectedSeverity) => {
    const selectedDisaster = DISASTERS.find(d => d.id === disasterId);
    setDisaster(selectedDisaster);
    setSeverity(selectedSeverity);
    
    // Generate initial agents around the disaster center
    const newAgents = generateAgents(selectedDisaster.lat, selectedDisaster.lng);
    setAgents(newAgents);
    
    setCurrentScreen('simulation');
    setTimeStepIndex(0);
    setShowReport(false);
  };

  const handleReset = () => {
    setCurrentScreen('setup');
    setDisaster(null);
    setAgents([]);
    setTimeStepIndex(0);
    setShowReport(false);
  };

  const nextTimeStep = () => {
    if (timeStepIndex >= 3) return;
    const nextStepIdx = timeStepIndex + 1;
    
    setAgents(prevAgents => prevAgents.map(agent => {
      let newStatus = agent.status;
      let newScore = agent.score;
      let newLat = agent.lat;
      let newLng = agent.lng;

      // Update statuses based on Time Step Logic
      if (nextStepIdx === 1) { // T+6hr
        switch(agent.type) {
          case 'Army':
          case 'NDRF':
          case 'Local Police':
            newStatus = 'Moving';
            break;
          case 'Doctors':
          case 'Supply Chain':
            newStatus = 'Standby';
            break;
          case 'Civilians':
            newStatus = Math.random() < 0.5 ? 'Blocked' : 'Standby';
            break;
          default: break;
        }
      } else if (nextStepIdx === 2) { // T+24hr
        switch(agent.type) {
          case 'Army':
          case 'NDRF':
          case 'Local Police':
            newStatus = 'On Ground';
            break;
          case 'Doctors':
            newStatus = 'Moving';
            break;
          case 'Supply Chain':
            newStatus = severity === 'High' ? 'Blocked' : 'Moving';
            break;
          case 'Civilians':
            if (newStatus !== 'Blocked') newStatus = 'Moving';
            break;
          default: break;
        }
      } else if (nextStepIdx === 3) { // T+72hr
        switch(agent.type) {
          case 'Army':
            newStatus = 'Completed';
            newScore = randInt(80, 95);
            break;
          case 'NDRF':
            newStatus = 'Completed';
            newScore = randInt(75, 90);
            break;
          case 'Local Police':
            newStatus = 'Completed';
            newScore = randInt(70, 88);
            break;
          case 'Doctors':
            newStatus = 'On Ground';
            newScore = randInt(65, 85);
            break;
          case 'Supply Chain':
            newScore = newStatus === 'Blocked' ? randInt(40, 60) : randInt(70, 85);
            newStatus = 'Completed';
            break;
          case 'Civilians':
            newScore = newStatus === 'Blocked' ? randInt(30, 55) : randInt(60, 80);
            newStatus = 'Completed';
            break;
          default: break;
        }
      }

      // Movement logic
      // If they are not blocked or standby, they move closer to the center
      const isMoving = newStatus === 'Moving' || newStatus === 'On Ground' || newStatus === 'Completed';
      
      if (isMoving && disaster) {
        const { lat, lng } = moveTowardsCenter(newLat, newLng, disaster.lat, disaster.lng);
        newLat = lat;
        newLng = lng;
      }

      return { ...agent, status: newStatus, score: newScore, lat: newLat, lng: newLng };
    }));

    setTimeStepIndex(nextStepIdx);
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#0a0f1e] text-white">
      {currentScreen === 'setup' && (
        <SetupScreen onLaunch={handleLaunch} />
      )}

      {currentScreen === 'simulation' && (
        <div className="flex-1 flex flex-row h-full w-full">
          <Sidebar 
            timeStepIndex={timeStepIndex} 
            agents={agents} 
            nextStep={nextTimeStep} 
            generateReport={() => setShowReport(true)}
            onReset={handleReset}
          />
          <MapView 
            disaster={disaster} 
            agents={agents} 
            severity={severity} 
          />
        </div>
      )}

      {showReport && (
        <ReportModal agents={agents} onClose={() => setShowReport(false)} />
      )}
    </div>
  );
}

export default App;
