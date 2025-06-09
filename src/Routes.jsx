import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages components
import SelectionUpIn from './pages/SelectionUpIn';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import HomePage from './pages/Homepage';
import Journal from "./pages/Journal";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/*<Route path="/" element={<SelectionUpIn />} /> {/* начальная страница
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />*/}
        <Route path="/" element={<HomePage />} />
        <Route path="/Journal/:id" element={<Journal />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;