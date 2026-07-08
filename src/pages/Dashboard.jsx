import React, { useState } from 'react';
import MiniHero from '../components/Layout/MiniHero';
import { Eye, Clock, XCircle, FileText, Share2, Award, Heart, ShieldAlert, Activity, User, Lock, Mail, CheckCircle } from 'lucide-react';

export default function Dashboard({ 
  user, 
  onLogout, 
  onLoginSuccess, 
  onUpdateUser,
  drafts = [], 
  wishlistItems = [],
  userProjects = [] // Pass published projects here to show in Activity
}) {
  const [activeTab, setActiveTab] = useState('My Projects');
  const [activeSubFilter, setActiveSubFilter] = useState('Published');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Modals State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState(user?.username || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPassword, setEditPassword] = useState('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState('');

  const tabs = ['My Projects', 'Notifications', 'My Activity'];
  const subFilters = [
    { name: 'Published', icon: Eye },
    { name: 'Need revision', icon: XCircle },
    { name: 'Pending review', icon: Clock },
    { name: 'Drafts', icon: FileText }
  ];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === '') return;
    onLoginSuccess?.({
      username: username,
      email: `${username.toLowerCase().replace(' ', '')}@example.com`,
      respects: 0
    });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    onUpdateUser?.({
      ...user,
      username: editName,
      email: editEmail,
      // Password handled securely in backend, omitted from local object
    });
    setIsEditingProfile(false);
    showToast('Profile updated successfully!');
  };

  const handlePublishDraft = () => {
    // Integrate your publish logic here
    showToast(`"${selectedDraft.title}" has been published!`);
    setSelectedDraft(null);
  };

  if (!user) {
    return (
      <div className="w-full bg-[#fafafa] text-gray-800 pb-12 font-sans min-h-screen">
        <MiniHero 
          title="Developer Dashboard" 
          subtitle="Manage your connected projects, view community feedback notifications, and track your recent activity."
        />
        <div className="max-w-[1536px] mx-auto px-4">
          <div className="max-w-md mx-auto my-12 p-8 bg-white rounded border border-gray-200 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">User Dashboard</h2>
              <p className="text-sm text-gray-500">Please sign in to access your metrics and project dashboard</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-b-2 bg-transparent border-gray-300 focus:border-[#0fafb8] py-2 text-sm outline-none font-medium text-black transition-colors"
                  placeholder="Enter your name"
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-2 bg-transparent border-gray-300 focus:border-[#0fafb8] py-2 text-sm outline-none font-medium text-black transition-colors"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 mt-4 bg-[#0fafb8] hover:bg-[#0a7981] text-white text-sm font-bold rounded shadow-sm transition cursor-pointer uppercase tracking-wider"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fafafa] text-gray-800 pb-12 pt-0 font-sans min-h-screen">
      <MiniHero 
        title="Developer Dashboard" 
        subtitle="Manage your connected projects, view community feedback notifications, and track your recent activity."
      />
      <div className="max-w-[1536px] mx-auto px-4 mt-8">
      
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-24 right-6 bg-black text-white px-5 py-3.5 rounded shadow-2xl font-bold z-50 flex items-center gap-3 animate-bounce">
            <CheckCircle className="h-5 w-5 text-[#0fafb8]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Banner Background */}
        <div className="w-full h-44 rounded bg-gradient-to-r from-teal-500/20 via-[#00979d]/20 to-teal-500/30 overflow-hidden relative border border-gray-200 mb-6 flex items-center justify-end p-6">
          <div className="absolute inset-0 bg-grid opacity-20"></div>
          <div className="text-right text-gray-400/50 text-xs font-mono select-none font-bold">
            SWIFT SIGN ELECTRONICS LAB LAB-7 v2.0.1<br/>
            SCHEMATIC DESIGN SHEET #1<br/>
            BATTERY CHARGER MODULE v1.2
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Left Column Profile Card */}
          <div className="md:col-span-1 bg-white p-6 rounded border border-gray-200 shadow-sm text-center relative -mt-16 z-10 flex flex-col items-center h-max">
            {/* Avatar circle */}
            <div className="h-28 w-28 rounded-full bg-[#00979d] border-4 border-white shadow-md flex items-center justify-center text-white font-bold text-4xl mb-4">
              {user.username.charAt(0).toUpperCase()}
            </div>

            <h2 className="text-xl font-bold text-black mb-1">
              {user.username}
            </h2>
            <p className="text-xs text-gray-500 mb-4">{user.email || 'No email added'}</p>

            <button 
              onClick={() => setIsEditingProfile(true)}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#00979d] border border-[#00979d]/30 hover:bg-teal-50 px-5 py-2.5 rounded transition cursor-pointer mb-8 uppercase tracking-wider"
            >
              Edit Profile <User className="h-3.5 w-3.5" />
            </button>

            {/* Cleaned Stats - Removed Followers/Following */}
            <div className="w-full flex justify-around border-t border-gray-100 pt-6 pb-2 text-xs font-bold text-gray-500">
              <div className="text-center">
                <p className="text-black font-extrabold text-base">{userProjects.length}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Projects</p>
              </div>
              <div className="text-center border-l border-gray-100 pl-8">
                <p className="text-black font-extrabold text-base">{user.respects || 0}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Respects</p>
              </div>
            </div>

            {/* Logout button */}
            <button 
              onClick={onLogout}
              className="mt-8 text-xs font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer uppercase tracking-wider"
            >
              Logout
            </button>
          </div>

          {/* Right Content Column */}
          <div className="md:col-span-3">
            
            {/* Tabs row */}
            <div className="flex border-b border-gray-200 gap-8 mb-6">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-bold transition cursor-pointer relative ${isActive ? 'text-[#00979d]' : 'text-gray-500 hover:text-[#00979d]'}`}
                  >
                    {tab}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00979d] rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab content rendering */}
            {activeTab === 'My Projects' && (
              <div>
                {/* Sub filters */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {subFilters.map((sf) => {
                    const isActive = activeSubFilter === sf.name;
                    const Icon = sf.icon;
                    return (
                      <button
                        key={sf.name}
                        onClick={() => setActiveSubFilter(sf.name)}
                        className={`inline-flex items-center gap-2 border px-5 py-2 text-xs font-bold transition cursor-pointer rounded ${isActive ? 'border-[#00979d] bg-teal-50 text-[#00979d]' : 'border-gray-200 bg-white text-gray-500 hover:border-[#00979d] hover:text-[#00979d]'}`}
                      >
                        <Icon className="h-4 w-4" />
                        {sf.name}
                      </button>
                    );
                  })}
                </div>

                {/* Central Display Area */}
                {activeSubFilter === 'Published' && (
                  userProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userProjects.map((project, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded p-5 shadow-sm flex flex-col gap-2 items-start text-left hover:border-[#00979d] transition cursor-pointer">
                          <span className="text-[10px] font-extrabold bg-[#00979d]/10 text-[#00979d] px-2.5 py-1 rounded uppercase tracking-wider">Published</span>
                          <h4 className="font-bold text-black line-clamp-1 mt-1">{project.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{project.tagline || 'No description provided.'}</p>
                          <div className="flex items-center gap-4 mt-3 text-[11px] font-bold text-gray-400">
                            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5"/> {project.views || 0}</span>
                            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5"/> {project.respects || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-16 bg-white border border-gray-200 rounded text-center min-h-[300px]">
                      <div className="w-48 h-32 mb-8 flex items-center justify-center relative opacity-60">
                        <svg viewBox="0 0 200 120" className="w-full h-full text-[#00979d]">
                          <rect x="20" y="30" width="80" height="55" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2"/>
                          <rect x="15" y="45" width="10" height="15" fill="#cbd5e1" stroke="#64748b"/>
                          <rect x="50" y="45" width="22" height="22" rx="2" fill="#64748b"/>
                          <line x1="25" y1="36" x2="95" y2="36" stroke="#475569" strokeWidth="3" strokeDasharray="3,1"/>
                          <line x1="25" y1="79" x2="95" y2="79" stroke="#475569" strokeWidth="3" strokeDasharray="3,1"/>
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm font-medium max-w-sm">
                        No published projects found. Click "Add Project" to share your first custom guide.
                      </p>
                    </div>
                  )
                )}
                
                {activeSubFilter === 'Drafts' && (
                  drafts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {drafts.map((draft, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedDraft(draft)}
                          className="bg-white border border-gray-200 rounded p-5 shadow-sm flex flex-col gap-2 items-start text-left hover:border-[#00979d] transition cursor-pointer group"
                        >
                          <div className="flex justify-between w-full items-center mb-1">
                            <span className="text-[10px] font-extrabold bg-gray-100 text-gray-500 px-2.5 py-1 rounded uppercase tracking-wider">Draft</span>
                            <span className="text-xs font-bold text-[#00979d] opacity-0 group-hover:opacity-100 transition">Preview &rarr;</span>
                          </div>
                          <h4 className="font-bold text-black line-clamp-1">{draft.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{draft.description || 'No description provided.'}</p>
                          <p className="text-[10px] font-bold text-gray-400 mt-2">Saved on: {draft.date}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white border border-gray-200 rounded text-gray-400 text-sm font-medium">
                      No drafts saved yet.
                    </div>
                  )
                )}

                {(activeSubFilter === 'Need revision' || activeSubFilter === 'Pending review') && (
                  <div className="text-center py-20 bg-white border border-gray-200 rounded text-gray-400 text-sm font-medium">
                    No items in this section.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="bg-white rounded p-12 border border-gray-200 flex flex-col items-center justify-center text-center min-h-[300px]">
                <ShieldAlert className="h-12 w-12 text-gray-300 mb-4" />
                <p className="font-bold text-black text-lg mb-1">No New Notifications</p>
                <p className="text-sm font-medium text-gray-500">We will alert you when users comment or respect your projects.</p>
              </div>
            )}

            {activeTab === 'My Activity' && (
              <div className="bg-white rounded p-8 border border-gray-200 min-h-[300px]">
                <h3 className="font-extrabold text-black mb-8 flex items-center gap-3 text-lg border-b border-gray-100 pb-4">
                  <Activity className="w-5 h-5 text-[#00979d]"/> Recent Activity
                </h3>
                
                <div className="space-y-8">
                  {/* Track Published Projects */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Your Publications</h4>
                    {userProjects.length > 0 ? (
                      <ul className="space-y-3 border-l-2 border-[#00979d]/30 ml-2 pl-4">
                        {userProjects.map((proj, idx) => (
                          <li key={idx} className="text-sm font-medium text-gray-700">
                            You published <span className="font-bold text-black">"{proj.title}"</span> 
                            <span className="text-xs text-gray-400 ml-2 italic">{proj.date || 'Recently'}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 font-medium">You haven't published any projects yet.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Wishlist ({wishlistItems.length})</h4>
                    {wishlistItems.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {wishlistItems.map((item, idx) => (
                          <div key={idx} className="bg-[#fafafa] p-3 border border-gray-200 rounded flex items-start gap-4">
                            <div className="w-16 h-12 rounded overflow-hidden shrink-0 bg-gray-100 border border-gray-200">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-center">
                              <p className="text-sm font-bold text-black line-clamp-1">{item.title}</p>
                              <p className="text-xs text-gray-500 font-medium mt-1">By {item.author}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 font-medium">You haven't added any projects to your wishlist yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* === MODALS === */}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-extrabold text-black text-lg">Edit Profile</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-gray-400 hover:text-black cursor-pointer transition">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><User className="w-3.5 h-3.5"/> Full Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm font-bold text-black outline-none focus:border-[#00979d]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Mail className="w-3.5 h-3.5"/> Email Address</label>
                <input 
                  type="email" 
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm font-bold text-black outline-none focus:border-[#00979d]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Lock className="w-3.5 h-3.5"/> New Password</label>
                <input 
                  type="password" 
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm font-bold text-black outline-none focus:border-[#00979d]"
                  placeholder="Leave blank to keep current"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditingProfile(false)} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-[#00979d] hover:bg-[#007b80] rounded transition cursor-pointer shadow-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Draft Preview / Publish Modal */}
      {selectedDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-extrabold bg-gray-200 text-gray-600 px-2.5 py-1 rounded uppercase tracking-wider">Draft Preview</span>
                <h3 className="font-extrabold text-black text-lg line-clamp-1">{selectedDraft.title}</h3>
              </div>
              <button onClick={() => setSelectedDraft(null)} className="text-gray-400 hover:text-black cursor-pointer transition">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto bg-[#fafafa]">
              <div className="bg-white border border-gray-200 rounded p-6 shadow-sm">
                <h1 className="text-3xl font-extrabold text-black mb-3">{selectedDraft.title}</h1>
                <p className="text-gray-500 font-medium text-lg mb-8 leading-relaxed">{selectedDraft.description}</p>
                
                <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</h4>
                    <p className="font-bold text-gray-800">{selectedDraft.category || 'Uncategorized'}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Difficulty</h4>
                    <p className="font-bold text-gray-800">{selectedDraft.difficulty || 'Easy'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
              <button onClick={() => setSelectedDraft(null)} className="px-6 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition cursor-pointer">Keep Editing</button>
              <button onClick={handlePublishDraft} className="px-8 py-3 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded transition cursor-pointer shadow-sm flex items-center gap-2">Publish Now <Upload className="w-4 h-4"/></button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}