import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import './App.css';

const vapi = new Vapi('84467ad3-a341-4406-b6f4-b8bf8b71a40c');

const SQUAD_IDS = {
  'Dental': '331b1819-ec40-494d-b41a-ac2f68893a26',
  'Real Estate': 'ee7b235c-d23f-4aa0-9bca-686978317220',
  'Med Spa': '124c080e-177f-4ac1-89a9-f593bbbd4fd6',
  'Plumbing': '836d2e64-79fe-45dd-945f-2245c0bf4925',
  'Roofing': 'ce76a524-8f67-41fd-9edb-b1a95d158bc5',
  'Hospital': '23a8176a-790e-4197-b021-f5e58c77808e'
};

const AGENT_IMAGES = {
  'Dental': '/dental-agent.png',
  'Real Estate': '/realestate-agent.png',
  'Med Spa': '/medspa-agent.png',
  'Plumbing': '/plumbing-agent.png',
  'Roofing': '/roofing-agent.png',
  'Hospital': '/dental-agent.png' // Temporary placeholder (Dentist image)
};

function App() {
  const [selectedAgent, setSelectedAgent] = useState('Dental');
  const [callStatus, setCallStatus] = useState('idle'); // idle, connecting, active
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [activeCall, setActiveCall] = useState(null);

  useEffect(() => {
    vapi.on('call-start', () => {
      console.log('Call started');
      setCallStatus('active');
    });

    vapi.on('call-end', () => {
      console.log('Call ended');
      setCallStatus('idle');
      setActiveCall(null);
      setVolumeLevel(0);
    });

    vapi.on('volume-level', (volume) => {
      setVolumeLevel(volume);
    });

    vapi.on('error', (e) => {
      console.error('Vapi Error:', e);
      setCallStatus('idle');
      setActiveCall(null);
    });
  }, []);

  const handleCall = async () => {
    if (callStatus === 'active' || callStatus === 'connecting') {
      vapi.stop();
      return;
    }

    const agentName = selectedAgent;
    const squadId = SQUAD_IDS[agentName];

    if (!squadId) {
      alert(`Please add a Squad ID for the ${agentName} Assistant in the code first!`);
      return;
    }

    setActiveCall(agentName);
    setCallStatus('connecting');

    try {
      await vapi.start(undefined, undefined, squadId);
    } catch (err) {
      console.error("Failed to start squad call:", err);
      setCallStatus('idle');
      setActiveCall(null);
    }
  };

  return (
    <div className="app-container">
      <header className="top-nav">
        <div className="logo">Future Theory Demo</div>
        <button className="demo-btn">Book My Free Demo</button>
      </header>

      <main className="main-layout">

        <div className="central-hub-wrapper">
          {/* LEFT COLUMN: AGENT SELECTOR */}
          <div className="agents-sidebar left-sidebar">
            <button
              className={`agent-selector-btn ${selectedAgent === 'Dental' ? 'active' : ''}`}
              onClick={() => setSelectedAgent('Dental')}
            >
              <div className="agent-icon-small">🦷</div>
              <span>Dental Assistant</span>
            </button>

            <button
              className={`agent-selector-btn ${selectedAgent === 'Med Spa' ? 'active' : ''}`}
              onClick={() => setSelectedAgent('Med Spa')}
            >
              <div className="agent-icon-small">✨</div>
              <span>Med Spa Assistant</span>
            </button>

            <button
              className={`agent-selector-btn ${selectedAgent === 'Real Estate' ? 'active' : ''}`}
              onClick={() => setSelectedAgent('Real Estate')}
            >
              <div className="agent-icon-small">🏠</div>
              <span>Real Estate Assistant</span>
            </button>
          </div>

          {/* CENTER: HERO IMAGE */}
          <div className="hero-image-container">
            {/* Reactive Ring around image */}
            {callStatus === 'active' && (
              <div
                className="volume-ring"
                style={{
                  transform: `scale(${1 + volumeLevel * 0.5})`,
                  opacity: 0.3 + volumeLevel
                }}
              ></div>
            )}

            <img
              src={AGENT_IMAGES[selectedAgent]}
              alt={selectedAgent}
              className="hero-img"
            />
          </div>

          {/* RIGHT COLUMN: NEW AGENT SELECTOR */}
          <div className="agents-sidebar right-sidebar">
            <button
              className={`agent-selector-btn right-btn ${selectedAgent === 'Plumbing' ? 'active' : ''}`}
              onClick={() => setSelectedAgent('Plumbing')}
            >
              <span>Plumbing Assistant</span>
              <div className="agent-icon-small">🪠</div>
            </button>

            <button
              className={`agent-selector-btn right-btn ${selectedAgent === 'Roofing' ? 'active' : ''}`}
              onClick={() => setSelectedAgent('Roofing')}
            >
              <span>Roofing Assistant</span>
              <div className="agent-icon-small">🏠</div>
            </button>

            <button
              className={`agent-selector-btn right-btn ${selectedAgent === 'Hospital' ? 'active' : ''}`}
              onClick={() => setSelectedAgent('Hospital')}
            >
              <span>Hospital Assistant</span>
              <div className="agent-icon-small">🏥</div>
            </button>
          </div>
        </div>

        {/* BOTTOM: CALL CONTROLS */}
        <div className="controls-area">
          <button
            className={`main-call-btn ${callStatus === 'active' ? 'hangup' : ''}`}
            onClick={handleCall}
          >
            {callStatus === 'connecting' ? 'Connecting...' :
              callStatus === 'active' ? 'End Call' : 'Try a Call'}
          </button>
        </div>

      </main>
    </div>
  );
}

export default App;
