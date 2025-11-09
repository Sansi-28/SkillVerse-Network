import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { theme } from './theme';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import DiscoverPage from './pages/DiscoverPage';
import ListingDetailPage from './pages/ListingDetailPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import CreateListingPage from './pages/CreateListingPage';
import InboxPage from './pages/InboxPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/listing/:id" element={<ListingDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/create-listing" element={<CreateListingPage />} />
              <Route path="/inbox" element={<InboxPage />} />
            </Routes>
          </MainLayout>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;