import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ParticipantList from './components/ParticipantList';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/participants" element={<ParticipantList />} />
        </Routes>
      </Router>
  );
}

export default App;
