import React from 'react';
import Grid from './components/grid/grid';
import PlayerCounter from './components/player.counter/player.counter';
import HistoryTimeline from './components/history/history.timeline';
import Timer from './components/timer/timer';
import { WebSocketProvider } from './hooks/use.web.socket.hook';
import { GridProvider } from './hooks/use.grid.hook';
import { PlayerProvider } from './hooks/use.player.hook';

function App() {
  return (
    <WebSocketProvider>
      <PlayerProvider>
        <GridProvider>
          <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
              <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Multiplayer Grid
                </h1>
                <p className="text-gray-600">
                  Collaborate with other players in real-time
                </p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <PlayerCounter />
                      <Timer />
                    </div>
                    <Grid />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Update History
                    </h2>
                    <HistoryTimeline />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GridProvider>
      </PlayerProvider>
    </WebSocketProvider>
  );
}

export default App;