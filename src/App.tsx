import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CVProvider } from './context/CVContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ImportPage from './pages/ImportPage';
import DashboardPage from './pages/DashboardPage';
import EditPage from './pages/EditPage';
import SettingsPage from './pages/SettingsPage';
import LetterGeneratorPage from './pages/LetterGeneratorPage';
import ProfilesPage from './pages/ProfilesPage';
import JobSearchPage from './pages/JobSearchPage';

function App() {
  return (
    <CVProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/edit/:cvId" element={<EditPage />} />
            <Route path="/edit" element={<EditPage />} />
            <Route path="/letter-generator" element={<LetterGeneratorPage />} />
            <Route path="/profiles" element={<ProfilesPage />} />
            <Route path="/job-search" element={<JobSearchPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </Router>
    </CVProvider>
  );
}

export default App;
