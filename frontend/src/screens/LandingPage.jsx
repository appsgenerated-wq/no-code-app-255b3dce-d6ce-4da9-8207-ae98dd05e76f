import React, { useState } from 'react';
import config from '../constants.js';
import { RocketLaunchIcon, MoonIcon } from '@heroicons/react/24/solid';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onSignup(name, email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
              Newton's Moon Cookies
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto md:mx-0">
              Freshly baked in zero-gravity, delivered at the speed of light. The best cookies this side of the Milky Way.
            </p>
            <div className="mt-8 flex justify-center md:justify-start space-x-4">
                <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <RocketLaunchIcon className="-ml-1 mr-3 h-5 w-5" />
                    Admin Panel
                </a>
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700">
            <div className="flex justify-center mb-6">
              <button onClick={() => setIsLogin(true)} className={`px-4 py-2 text-sm font-medium rounded-l-lg ${isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Log In</button>
              <button onClick={() => setIsLogin(false)} className={`px-4 py-2 text-sm font-medium rounded-r-lg ${!isLogin ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}>Sign Up</button>
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">{isLogin ? 'Welcome Back, Stargazer' : 'Join the Crew'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-700 text-white w-full px-4 py-2 rounded-md border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Your Name" required />
                </div>
              )}
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-700 text-white w-full px-4 py-2 rounded-md border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Email Address" required />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-700 text-white w-full px-4 py-2 rounded-md border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Password" required />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors">{isLogin ? 'Log In' : 'Create Account'}</button>
            </form>
            <div className="mt-4 text-center">
                <button onClick={() => onLogin('newton@moon.inc', 'password123')} className="text-sm text-indigo-400 hover:text-indigo-300">Try Astronaut Demo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
