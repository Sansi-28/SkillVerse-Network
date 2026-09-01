import React, { Suspense } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { theme } from './theme';
import MainLayout from './layouts/MainLayout';

// Lazy load pages for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const SignInPage = React.lazy(() => import('./pages/SignInPage'));
const DiscoverPage = React.lazy(() => import('./pages/DiscoverPage'));
const ListingDetailPage = React.lazy(() => import('./pages/ListingDetailPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const CreateListingPage = React.lazy(() => import('./pages/CreateListingPage'));
const InboxPage = React.lazy(() => import('./pages/InboxPage'));
const VideoSessionPage = React.lazy(() => import('./pages/VideoSessionPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch on tab switch for better UX
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes cache
    },
  },
});

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
    <CircularProgress size={40} thickness={4} />
  </Box>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <MainLayout>
              <Suspense fallback={<LoadingFallback />}>
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
                  <Route path="/session/:roomId" element={<VideoSessionPage />} />
                </Routes>
              </Suspense>
            </MainLayout>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;