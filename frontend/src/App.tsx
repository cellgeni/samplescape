import React from 'react';
import './App.css';
import 'antd/dist/reset.css'; // Ant Design styles
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Home from './components/Home';
import About from './components/About';
import Samples from './components/samples/Samples';
import Studies from './components/studies/Studies';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Layout with Menu */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="studies" element={<Studies />} />
          <Route path="samples" element={<Samples />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

