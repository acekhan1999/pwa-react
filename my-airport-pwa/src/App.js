import React from 'react';
import './App.css'; // Optional styling if you like

function App() {
  return (
    <div className="App">
      <header>
        <h1>My Airport PWA</h1>
        <p>Welcome to the Airport Info Portal!</p>
      </header>
      
      <section>
        <h2>Today’s Flights</h2>
        <ul>
          <li>Flight AA123 - Destination: New York - On Time</li>
          <li>Flight BA456 - Destination: London - Delayed</li>
          <li>Flight CA789 - Destination: Tokyo - Boarding</li>
        </ul>
      </section>
    </div>
  );
}

export default App;
