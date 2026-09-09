import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login/Login';
import DashboardLayout, { DashboardHome } from './pages/Dashboard/DashboardHome';
import StudentList from './pages/Students/StudentList';
import RegisterStudent from './pages/Students/RegisterStudent';
import Courses from './pages/Courses/Courses';
import MarksEntry from './pages/Marks/MarksEntry';
import Results from './pages/Results/Results';
import Reports from './pages/Reports/Reports';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="students" element={<StudentList />} />
            <Route path="students/sajili" element={<RegisterStudent />} />
            <Route path="students/edit/:id" element={<RegisterStudent />} />
            <Route path="courses" element={<Courses />} />
            <Route path="marks" element={<MarksEntry />} />
            <Route path="results" element={<Results />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}