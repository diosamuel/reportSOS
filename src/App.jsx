import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Record from './pages/Record';
import Maps from './pages/Maps';
import Result from './pages/Result';
import Camera from './pages/Camera';
import Admin from './pages/admin/Index';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/record" element={<Record />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/result" element={<Result />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
