import React, { useState } from 'react';
import MiniHero from '../components/Layout/MiniHero';
import { Mail, User, Lock } from 'lucide-react';

export default function Account({ onLoginSuccess, initialIsLogin = true }) {
  const [isLogin, setIsLogin] = useState(initialIsLogin);

  React.useEffect(() => {
    setIsLogin(initialIsLogin);
  }, [initialIsLogin]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === '') return;
    onLoginSuccess({
      username: username,
      email: email,
      followers: 0,
      following: 0,
      respects: 0
    });
  };

  return (
    <div className="w-full bg-white text-gray-800 pb-8 pt-0 font-sans">
      <MiniHero 
        title="Maker Community Portal" 
        subtitle="Log in or create an account to share projects, follow creators, and access custom firmware files."
      />
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto my-8 p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-black mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-gray-500">
            {isLogin ? 'Access your Swift Sign developer dashboard' : 'Join the makers community'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <div className="relative">
                <input 
                  type="email" 
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block px-4 pb-3 pt-4 w-full text-sm text-black bg-white rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-[#0fafb8] focus:border-[#0fafb8] peer"
                  placeholder="Enter your email"
                  autoComplete="off"
                  required
                />
                <label 
                  htmlFor="email" 
                  className="absolute text-sm text-gray-400 font-bold duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:text-[#0fafb8] left-2 cursor-text"
                >
                  Email Address
                </label>
              </div>
            </div>
          )}

          <div>
            <div className="relative">
              <input 
                type="text" 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block px-4 pb-3 pt-4 w-full text-sm text-black bg-white rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-[#0fafb8] focus:border-[#0fafb8] peer"
                placeholder="Enter your name"
                autoComplete="off"
                required
              />
              <label 
                htmlFor="username" 
                className="absolute text-sm text-gray-400 font-bold duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:text-[#0fafb8] left-2 cursor-text"
              >
                Username
              </label>
            </div>
          </div>

          <div>
            <div className="relative">
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block px-4 pb-3 pt-4 w-full text-sm text-black bg-white rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-[#0fafb8] focus:border-[#0fafb8] peer"
                placeholder="Enter your password"
                autoComplete="new-password"
                required
              />
              <label 
                htmlFor="password" 
                className="absolute text-sm text-gray-400 font-bold duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:text-[#0fafb8] left-2 cursor-text"
              >
                Password
              </label>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-[#0fafb8] hover:bg-[#0a7981] text-white text-sm font-bold rounded-xl shadow-sm transition cursor-pointer"
          >
            {isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#0fafb8] font-bold hover:underline cursor-pointer"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
