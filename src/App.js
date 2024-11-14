// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './components/Layout/PrivateRoute';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import CarList from './components/Cars/CarList';
import CarDetail from './components/Cars/CarDetail';
import CarForm from './components/Cars/CarForm';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/cars" element={<CarList />} />
                        <Route path="/cars/new" element={<CarForm />} />
                        <Route path="/cars/:id/edit" element={<CarForm />} />
                        <Route path="/cars/:id" element={<CarDetail />} />
                    </Route>
                    <Route path="/" element={<h1>Welcome to Car Management App</h1>} />
                    <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;