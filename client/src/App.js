import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Home />}/>
        </Routes>
      </div>
    </Router>
  );
}
