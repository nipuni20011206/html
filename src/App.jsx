import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';       // Adjust path
import Countries from './pages/Countries'; // Adjust path
import Favourites from './pages/Favourites'; // Adjust path
//import Profile from './pages/Profile';   // Adjust path (Create this component)
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import Navbar from './components/NavBar';
import Signup from './pages/Signup';
import LoginPage from './pages/Login';
import CountryDetails from './pages/Details';
import { Toaster } from 'react-hot-toast';
import Profile from './pages/Profile';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider> {/* Wrap everything with AuthProvider */}
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          {/* Add padding matching navbar height */}
          <main className="flex-grow pt-16">
          <Toaster
           position="top-center" // Default position
           reverseOrder={false}
           toastOptions={{
             // You can set global defaults here if needed
             // className: '',
             // duration: 5000,
             // style: { ... },
           }}
        />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/countries" element={<Countries />} />
              <Route path="/country-details/:code" element={<CountryDetails />} /> {/* Example details route */}
              <Route path="/favourites" element={<Favourites />} />
              {/* <Route path="/profile" element={<Profile />} /> Example profile route */}
              <Route path="/sign-in" element={<LoginPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/sign-up" element={<Signup />} />
              {/* Add other routes here */}
            </Routes>
          </main>
          {/* Optional Footer */}
          <Footer/>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;