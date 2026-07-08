import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle,
  Check,
  Upload,
  X,
  Info
} from 'lucide-react';
import MiniHero from '../components/Layout/MiniHero';

// MOCK DATABASE: Only these users can be added as contributors
const REGISTERED_USERS = ['hardik_chadda', 'bilal_tariq', 'admin', 'maker_pro'];

export default function AddProject({ currentUser, onRedirectToLogin, onAddProject, onSaveDraft, onPreview }) {
  // Form State
  const [title, setTitle] = useState('');
  const [pitch, setPitch] = useState('');
  const [tags, setTags] = useState('');
  const [skillLevel, setSkillLevel] = useState('Easy');

  const [team, setTeam] = useState([]);
  const [devices, setDevices] = useState([]);
  const [hardware, setHardware] = useState([]);
  const [software, setSoftware] = useState([]);
  const [description, setDescription] = useState('');
  
  // Code Section State
  const [codeLang, setCodeLang] = useState('C++');
  const [codeType, setCodeType] = useState('text'); // text, file, zip
  const [codeContent, setCodeContent] = useState('');
  const [codeFile, setCodeFile] = useState(null);

  const [appLabFile, setAppLabFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [documentation, setDocumentation] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);

  // Checkbox states for empty sections
  const [notAuthor, setNotAuthor] = useState(false);
  const [noTools, setNoTools] = useState(false);
  const [noApp, setNoApp] = useState(false);
  const [noFiles, setNoFiles] = useState(false);
  const [noDocs, setNoDocs] = useState(false);

  // Input Toggles
  const [showTeamInput, setShowTeamInput] = useState(false);
  const [showDeviceInput, setShowDeviceInput] = useState(false);
  const [showHardwareInput, setShowHardwareInput] = useState(false);
  const [showSoftwareInput, setShowSoftwareInput] = useState(false);
  const [showDescInput, setShowDescInput] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showAppInput, setShowAppInput] = useState(false);
  const [showFileInput, setShowFileInput] = useState(false);
  const [showDocInput, setShowDocInput] = useState(false);

  // Temporary Inputs & Errors
  const [tempTeam, setTempTeam] = useState('');
  const [teamError, setTeamError] = useState('');
  const [tempDevice, setTempDevice] = useState('');
  const [tempHardware, setTempHardware] = useState('');
  const [tempSoftware, setTempSoftware] = useState('');

  // Validation Logic
  const isIntroComplete = title.trim().length > 0 && pitch.trim().length > 0 && tags !== '';
  const isTeamComplete = notAuthor || team.length > 0 || (currentUser && currentUser.username);
  const isDevicesComplete = devices.length > 0;
  const isHardwareComplete = noTools || hardware.length > 0;
  const isSoftwareComplete = software.length > 0;
  const isDescriptionComplete = description.trim().length > 0;
  const isCodeComplete = (codeType === 'text' && codeContent.trim().length > 0) || (codeType !== 'text' && codeFile !== null);
  const isAppLabComplete = noApp || appLabFile !== null;
  const isFilesComplete = noFiles || files.length > 0;
  const isDocsComplete = noDocs || documentation.trim().length > 0;

  const canPublish = isIntroComplete && isTeamComplete && isDevicesComplete && 
                     isHardwareComplete && isSoftwareComplete && isDescriptionComplete && 
                     isCodeComplete && isAppLabComplete && isFilesComplete && isDocsComplete;

  // Generic List Add/Remove Handlers
  const handleAddItem = (setter, list, item, setTemp, setToggle) => {
    if (item.trim()) {
      setter([...list, item.trim()]);
      setTemp('');
      setToggle(false);
    }
  };

  const handleRemoveItem = (setter, list, index) => {
    setter(list.filter((_, i) => i !== index));
  };

  // Dedicated Contributor Validation
  const handleAddMember = () => {
    const username = tempTeam.trim().toLowerCase();
    if (!username) return;

    if (REGISTERED_USERS.includes(username)) {
      setTeam([...team, tempTeam.trim()]);
      setTempTeam('');
      setShowTeamInput(false);
      setTeamError('');
    } else {
      setTeamError('User not found. They must be a registered MakerHub member.');
    }
  };

  const handleFileChange = (e, setter, isList = false, list = []) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isList) {
        setter([...list, file.name]);
      } else {
        setter(file.name);
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      setTitle(''); setPitch(''); setTags(''); setSkillLevel('Easy');
      setTeam([]); setDevices([]); setHardware([]); setSoftware([]);
      setDescription(''); setCodeContent(''); setCodeFile(null);
      setAppLabFile(null); setFiles([]); setDocumentation('');
      setShowTeamInput(false); setShowDeviceInput(false); setShowHardwareInput(false);
      setShowSoftwareInput(false); setShowDescInput(false); setShowCodeInput(false);
      setShowAppInput(false); setShowFileInput(false); setShowDocInput(false);
      setNotAuthor(false); setNoTools(false); setNoApp(false); setNoFiles(false); setNoDocs(false);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!currentUser || !canPublish) return;

    const newProject = {
      id: Date.now(),
      title: title || 'Untitled Project',
      tagline: pitch || 'No tagline provided.',
      author: currentUser.username,
      category: tags || 'Electronics',
      product: "FYP Projects", 
      type: "Tutorial",
      difficulty: skillLevel,
      views: 0,
      comments: 0,
      likes: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      license: "MIT",
      respects: 0,
      badges: ["Community Guide", tags],
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80",
      intro: pitch,
      devices: devices.length ? devices : ['Basic Components'],
      software: software.length ? software : ['Arduino IDE'],
      description: description,
      code: codeType === 'text' ? codeContent : `Code attached: ${codeFile}`,
      appLab: appLabFile ? `App Lab: ${appLabFile}` : "No app provided",
      files: files.length ? files : [],
      teamMembers: team 
    };

    onAddProject?.(newProject);

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      handleDelete(); 
    }, 3000);
  };

  if (!currentUser) {
    return (
      <div className="w-full pb-12 pt-0 font-sans bg-[#fafafa] text-black min-h-screen">
        <MiniHero 
          title="Create New Project" 
          subtitle="Publish your custom hardware schematics, firmware code, and reference designs."
        />
        <div className="max-w-[1536px] mx-auto px-4">
          <div className="max-w-xl mx-auto my-12 p-8 bg-white border border-gray-200 rounded-lg shadow-sm text-center flex flex-col items-center gap-5">
            <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-black">Access Denied</h2>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Only registered and logged-in developers can upload project tutorials. Please sign in or register an account.
            </p>
            <button 
              type="button"
              onClick={onRedirectToLogin}
              className="px-6 py-3 bg-[#0fafb8] hover:bg-[#0a7981] text-white text-sm font-bold rounded shadow-sm transition cursor-pointer mt-2"
            >
              Go to Account Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full bg-[#fafafa] text-black pb-12 font-sans min-h-screen">
      <MiniHero 
        title="Project Hub Editor" 
        subtitle="Draft your project and share it with the community."
      />

      <div className="max-w-[1536px] mx-auto px-4 mt-8">
        
        {isSuccess && (
          <div className="fixed top-24 right-6 bg-black text-white px-5 py-3.5 rounded shadow-2xl font-bold z-50 flex items-center gap-3 animate-bounce">
            <CheckCircle className="h-5 w-5 text-[#0fafb8]" />
            <span>Project published successfully! Redirecting...</span>
          </div>
        )}

        <div className="flex justify-end gap-3 mb-6">
          <button type="button" onClick={handleDelete} className="text-red-500 font-bold text-xs px-4 py-2 hover:bg-red-50 rounded transition cursor-pointer uppercase tracking-wide">
            Delete
          </button>
          <button 
            type="button" 
            onClick={() => {
              const draftProj = {
                id: Date.now(),
                title: title || 'Untitled Draft',
                tagline: pitch || '',
                author: currentUser.username,
                category: tags || 'Electronics',
                product: "FYP Projects",
                type: "Tutorial",
                difficulty: skillLevel,
                views: 0,
                comments: 0,
                likes: 0,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                license: "MIT",
                respects: 0,
                badges: ["Draft"],
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80",
                intro: pitch,
                devices: devices,
                software: software,
                description: description,
                code: codeType === 'text' ? codeContent : `Code attached: ${codeFile}`,
                appLab: appLabFile ? `App Lab: ${appLabFile}` : "No app provided",
                files: files,
                teamMembers: team 
              };
              onSaveDraft?.(draftProj);
              alert('Draft saved successfully! You can view it in your dashboard.');
            }}
            className="text-gray-600 font-bold text-xs px-4 py-2 hover:bg-gray-100 rounded transition cursor-pointer uppercase tracking-wide"
          >
            Save Draft
          </button>
          <button 
            type="button" 
            onClick={() => {
              const previewProj = {
                id: Date.now(),
                title: title || 'Untitled Preview',
                tagline: pitch || '',
                author: currentUser.username,
                category: tags || 'Electronics',
                product: "FYP Projects",
                type: "Tutorial",
                difficulty: skillLevel,
                views: 0,
                comments: 0,
                likes: 0,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                license: "MIT",
                respects: 0,
                badges: ["Preview"],
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80",
                intro: pitch,
                devices: devices.length ? devices : ['Basic Components'],
                software: software.length ? software : ['Arduino IDE'],
                description: description || 'No description provided.',
                code: codeType === 'text' ? codeContent : `Code attached: ${codeFile}`,
                appLab: appLabFile ? `App Lab: ${appLabFile}` : "No app provided",
                files: files,
                teamMembers: team 
              };
              localStorage.setItem('swift-sign-preview-project', JSON.stringify(previewProj));
              window.open(window.location.origin + window.location.pathname + '#preview', '_blank');
            }}
            className="text-white bg-[#0fafb8] hover:bg-[#0a7981] font-bold text-xs px-6 py-2 rounded transition cursor-pointer uppercase tracking-wide"
          >
            Preview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {/* Intro Section - Very minimalist, borderless inputs */}
            <div id="section-intro" className="bg-white p-10 rounded border border-gray-200 scroll-mt-24">
              <div className="inline-block bg-gray-200 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-sm mb-6 uppercase tracking-wider">
                Draft
              </div>
              
              <input 
                type="text" 
                placeholder="Insert your project title, make it sound cool!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl sm:text-4xl font-bold text-black placeholder-gray-300 border-none outline-none focus:ring-0 mb-4 bg-transparent p-0"
              />
              
              <input 
                type="text" 
                placeholder="Here is your elevator pitch. Describe your project in one short sentence"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                className="w-full text-lg text-gray-500 placeholder-gray-300 border-none outline-none focus:ring-0 mb-10 bg-transparent p-0"
              />

              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[200px] border-b border-gray-200 pb-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category (Required)</label>
                  <select 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer p-0 border-none focus:ring-0"
                  >
                    <option value="" disabled>Select a category...</option>
                    <option value="IoT">IoT</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Home Automation">Home Automation</option>
                    <option value="Audio">Audio</option>
                    <option value="Display">Display</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[200px] border-b border-gray-200 pb-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skill level</label>
                  <select 
                    value={skillLevel} 
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer p-0 border-none focus:ring-0"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="mt-16 flex justify-center opacity-40">
                <img 
                  src="https://cdn.arduino.cc/projecthub/assets/img/illustrations/ph_hero_illustration.svg" 
                  alt="Illustration" 
                  className="max-w-full h-auto max-h-48 object-contain grayscale"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            </div>

            {/* The Team */}
            <SectionCard id="section-team" title="The Team" hasCheckbox checkboxLabel="I'm not this project's author" checkboxState={notAuthor} setCheckboxState={setNotAuthor}>
              {!notAuthor && currentUser && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#0fafb8] flex items-center justify-center text-white font-bold text-lg">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-black">{currentUser.username} <span className="text-gray-400">(Author)</span></span>
                </div>
              )}
              
              <ItemList list={team} onRemove={(idx) => handleRemoveItem(setTeam, team, idx)} />
              
              {showTeamInput ? (
                <InputRow 
                  value={tempTeam} 
                  onChange={(e) => { setTempTeam(e.target.value); setTeamError(''); }} 
                  onAdd={handleAddMember} 
                  onCancel={() => { setShowTeamInput(false); setTeamError(''); }} 
                  placeholder="Enter registered username..."
                  error={teamError}
                />
              ) : (
                <DashedButton onClick={() => setShowTeamInput(true)} label="Add a member" />
              )}
              
              <div className="mt-8 mb-4 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2 mb-4 text-gray-700">
                  <Info className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-bold">Work attribution</h4>
                </div>
                <DashedButton onClick={() => setShowTeamInput(true)} label="Add a contributor" />
              </div>
            </SectionCard>

            {/* Devices & Components */}
            <SectionCard id="section-devices" title="Devices & Components">
              <ItemList list={devices} onRemove={(idx) => handleRemoveItem(setDevices, devices, idx)} />
              {showDeviceInput ? (
                <InputRow 
                  value={tempDevice} 
                  onChange={(e) => setTempDevice(e.target.value)} 
                  onAdd={() => handleAddItem(setDevices, devices, tempDevice, setTempDevice, setShowDeviceInput)} 
                  onCancel={() => setShowDeviceInput(false)} 
                  placeholder="E.g. Arduino UNO Rev3"
                />
              ) : (
                <DashedButton onClick={() => setShowDeviceInput(true)} label="Select a component or supply" />
              )}
            </SectionCard>

            {/* Hardware & Tools */}
            <SectionCard id="section-hardware" title="Hardware & Tools" hasCheckbox checkboxLabel="No tools used in this project" checkboxState={noTools} setCheckboxState={setNoTools}>
              {!noTools && (
                <>
                  <ItemList list={hardware} onRemove={(idx) => handleRemoveItem(setHardware, hardware, idx)} />
                  {showHardwareInput ? (
                    <InputRow 
                      value={tempHardware} 
                      onChange={(e) => setTempHardware(e.target.value)} 
                      onAdd={() => handleAddItem(setHardware, hardware, tempHardware, setTempHardware, setShowHardwareInput)} 
                      onCancel={() => setShowHardwareInput(false)} 
                      placeholder="E.g. Soldering Iron"
                    />
                  ) : (
                    <DashedButton onClick={() => setShowHardwareInput(true)} label="Select a tool or machine" />
                  )}
                </>
              )}
            </SectionCard>

            {/* Software & Tools */}
            <SectionCard id="section-software" title="Software & Tools">
              <ItemList list={software} onRemove={(idx) => handleRemoveItem(setSoftware, software, idx)} />
              {showSoftwareInput ? (
                <InputRow 
                  value={tempSoftware} 
                  onChange={(e) => setTempSoftware(e.target.value)} 
                  onAdd={() => handleAddItem(setSoftware, software, tempSoftware, setTempSoftware, setShowSoftwareInput)} 
                  onCancel={() => setShowSoftwareInput(false)} 
                  placeholder="E.g. Arduino IDE"
                />
              ) : (
                <DashedButton onClick={() => setShowSoftwareInput(true)} label="Select an app or platform" />
              )}
            </SectionCard>

            {/* Project Description */}
            <SectionCard id="section-description" title="Project Description">
              {showDescInput ? (
                <div className="w-full animate-in fade-in duration-200">
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write your project details here. Markdown is supported."
                    className="w-full h-64 border border-[#0fafb8] focus:ring-1 focus:ring-[#0fafb8] rounded p-4 text-sm font-medium outline-none transition-shadow mb-3 bg-white"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowDescInput(false)} className="bg-[#0fafb8] hover:bg-[#0a7981] transition text-white px-6 py-2 rounded text-sm font-bold cursor-pointer">Done Editing</button>
                  </div>
                </div>
              ) : (
                <>
                  {description && <p className="mb-4 text-sm text-gray-800 leading-relaxed bg-gray-50 p-6 rounded border border-gray-100 whitespace-pre-wrap">{description}</p>}
                  <DashedButton onClick={() => setShowDescInput(true)} label={description ? "Edit this section" : "Add description"} />
                </>
              )}
            </SectionCard>

            {/* Code */}
            <SectionCard id="section-code" title="Code">
              {showCodeInput ? (
                <div className="w-full animate-in fade-in duration-200">
                  <div className="mb-6 flex flex-col gap-2 md:w-1/3">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Language</label>
                    <select 
                      value={codeLang} 
                      onChange={(e) => setCodeLang(e.target.value)}
                      className="border-b border-gray-300 bg-transparent py-2 text-sm font-bold outline-none focus:border-[#0fafb8] cursor-pointer"
                    >
                      <option value="C++">C/C++ (Arduino)</option>
                      <option value="Python">Python</option>
                      <option value="JavaScript">JavaScript</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-wrap gap-8 mb-6 text-sm font-medium text-gray-600">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#0fafb8] transition">
                      <input type="radio" className="accent-[#0fafb8] w-4 h-4" checked={codeType === 'text'} onChange={() => setCodeType('text')} /> Write Directly
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#0fafb8] transition">
                      <input type="radio" className="accent-[#0fafb8] w-4 h-4" checked={codeType === 'file'} onChange={() => setCodeType('file')} /> Upload File (.ino)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-[#0fafb8] transition">
                      <input type="radio" className="accent-[#0fafb8] w-4 h-4" checked={codeType === 'zip'} onChange={() => setCodeType('zip')} /> Upload ZIP
                    </label>
                  </div>

                  {codeType === 'text' ? (
                    <textarea 
                      value={codeContent}
                      onChange={(e) => setCodeContent(e.target.value)}
                      placeholder={`// Write your ${codeLang} code here...\nvoid setup() {\n\n}\n\nvoid loop() {\n\n}`}
                      className="w-full h-64 border border-[#0fafb8] rounded p-5 font-mono text-xs bg-[#f8f9fa] text-gray-800 outline-none focus:ring-1 focus:ring-[#0fafb8] mb-5"
                    />
                  ) : (
                    <div className="mb-5">
                      <StyledUploadZone 
                        label="Click to browse or drag code file here"
                        onChange={(e) => {
                          handleFileChange(e, setCodeFile);
                          setShowCodeInput(false); 
                        }} 
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    {codeType === 'text' && (
                      <button type="button" onClick={() => setShowCodeInput(false)} className="bg-[#0fafb8] hover:bg-[#0a7981] text-white px-6 py-2 rounded text-sm font-bold cursor-pointer transition">Save Code</button>
                    )}
                    <button type="button" onClick={() => setShowCodeInput(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded text-sm font-bold cursor-pointer transition">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  {codeType === 'text' && codeContent && <pre className="mb-4 text-xs bg-[#f8f9fa] text-gray-800 p-5 rounded border border-gray-200 overflow-x-auto font-mono">{codeContent}</pre>}
                  {codeType !== 'text' && codeFile && <div className="mb-4 p-4 border border-gray-200 rounded flex items-center"><p className="text-sm text-gray-700 font-medium flex items-center gap-3"><Upload className="w-5 h-5 text-[#0fafb8]"/> {codeFile}</p></div>}
                  <DashedButton onClick={() => setShowCodeInput(true)} label={codeContent || codeFile ? "Edit code" : "Add a link or embed code"} />
                </>
              )}
            </SectionCard>

            {/* Arduino App Lab */}
            <SectionCard id="section-app" title="Arduino App Lab" hasCheckbox checkboxLabel="No Arduino App to add in this project" checkboxState={noApp} setCheckboxState={setNoApp}>
              {!noApp && (
                <>
                  {appLabFile && <p className="mb-4 text-sm font-medium text-gray-700 flex items-center gap-3 border border-gray-200 p-4 rounded"><Upload className="w-5 h-5 text-[#0fafb8]"/> {appLabFile}</p>}
                  {showAppInput ? (
                    <div className="w-full flex flex-col gap-4 animate-in fade-in duration-200">
                      <StyledUploadZone 
                        accept=".zip"
                        label="Click to browse or drag .zip file here"
                        onChange={(e) => {
                          handleFileChange(e, setAppLabFile);
                          setShowAppInput(false);
                        }} 
                      />
                      <div className="flex justify-end">
                        <button type="button" onClick={() => setShowAppInput(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded text-sm font-bold cursor-pointer transition">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <DashedButton onClick={() => setShowAppInput(true)} label="Add Arduino App (.zip)" />
                  )}
                </>
              )}
            </SectionCard>

            {/* Downloadable files */}
            <SectionCard id="section-files" title="Downloadable files" hasCheckbox checkboxLabel="No files to add in this project" checkboxState={noFiles} setCheckboxState={setNoFiles}>
              {!noFiles && (
                <>
                  <ItemList list={files} onRemove={(idx) => handleRemoveItem(setFiles, files, idx)} />
                  {showFileInput ? (
                    <div className="w-full flex flex-col gap-4 animate-in fade-in duration-200 mb-2">
                      <StyledUploadZone 
                        label="Click to browse or drag file here"
                        onChange={(e) => {
                          handleFileChange(e, setFiles, true, files);
                          setShowFileInput(false);
                        }} 
                      />
                      <div className="flex justify-end">
                        <button type="button" onClick={() => setShowFileInput(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded text-sm font-bold cursor-pointer transition">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <DashedButton onClick={() => setShowFileInput(true)} label="Add a file" />
                  )}
                </>
              )}
            </SectionCard>

            {/* Documentation */}
            <SectionCard id="section-docs" title="Documentation" hasCheckbox checkboxLabel="No documentation to add" checkboxState={noDocs} setCheckboxState={setNoDocs}>
              {!noDocs && (
                <>
                  {documentation && <a href={documentation} target="_blank" rel="noreferrer" className="mb-4 text-sm font-medium text-[#0fafb8] hover:underline block border border-gray-200 p-4 rounded">{documentation}</a>}
                  {showDocInput ? (
                    <div className="w-full flex gap-3 animate-in fade-in duration-200">
                      <input 
                        type="url" 
                        value={documentation}
                        onChange={(e) => setDocumentation(e.target.value)}
                        placeholder="https://docs.example.com"
                        className="flex-1 border border-[#0fafb8] rounded px-4 py-2 text-sm font-medium outline-none text-black focus:ring-1 focus:ring-[#0fafb8]"
                      />
                      <button type="button" onClick={() => setShowDocInput(false)} className="bg-[#0fafb8] hover:bg-[#0a7981] transition text-white px-6 rounded text-sm font-bold cursor-pointer">Save URL</button>
                    </div>
                  ) : (
                    <DashedButton onClick={() => setShowDocInput(true)} label="Add a link or embed" />
                  )}
                </>
              )}
            </SectionCard>

          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded border border-gray-200 mb-6">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-black mb-2 text-lg">Project checklist</h3>
                  <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                    Add your content in these sections or bypass them using their checkboxes to publish.
                  </p>
                  <a href="#/" onClick={(e) => e.preventDefault()} className="text-xs font-bold text-[#0fafb8] hover:underline uppercase tracking-wider">Check content guidelines</a>
                </div>
                
                <div className="px-4 py-2">
                  <ChecklistItem label="Intro" isComplete={isIntroComplete} onClick={() => scrollToSection('section-intro')} />
                  <ChecklistItem label="The team" isComplete={isTeamComplete} onClick={() => scrollToSection('section-team')} />
                  <ChecklistItem label="Devices & Components" isComplete={isDevicesComplete} onClick={() => scrollToSection('section-devices')} />
                  <ChecklistItem label="Hardware & Tools" isComplete={isHardwareComplete} onClick={() => scrollToSection('section-hardware')} />
                  <ChecklistItem label="Software & Tools" isComplete={isSoftwareComplete} onClick={() => scrollToSection('section-software')} />
                  <ChecklistItem label="Project description" isComplete={isDescriptionComplete} onClick={() => scrollToSection('section-description')} />
                  <ChecklistItem label="Code" isComplete={isCodeComplete} onClick={() => scrollToSection('section-code')} />
                  <ChecklistItem label="Arduino App Lab" isComplete={isAppLabComplete} onClick={() => scrollToSection('section-app')} />
                  <ChecklistItem label="Downloadable files" isComplete={isFilesComplete} onClick={() => scrollToSection('section-files')} />
                  <ChecklistItem label="Documentation" isComplete={isDocsComplete} isLast onClick={() => scrollToSection('section-docs')} />
                </div>
              </div>

              <button 
                type="button"
                onClick={handlePublish}
                disabled={!canPublish}
                className={`w-full py-4 rounded font-bold text-sm uppercase tracking-wider transition
                  ${canPublish 
                    ? 'bg-[#0fafb8] hover:bg-[#0a7981] text-white cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                Go to Preview / Publish
              </button>
              
              {!canPublish && (
                <p className="text-center text-xs font-medium text-gray-500 mt-4 px-4">
                  Please satisfy all required sections in the checklist to publish.
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// === HELPER COMPONENTS EXTRACTED OUTSIDE MAIN RENDER ===

const SectionCard = ({ id, title, children, hasCheckbox, checkboxLabel, checkboxState, setCheckboxState }) => (
  <div id={id} className="bg-white p-8 rounded border border-gray-200 mb-6 relative scroll-mt-24">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 text-gray-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-serif italic">i</div>
        <h3 className="text-2xl font-bold text-black">{title}</h3>
      </div>
      {hasCheckbox && (
        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer absolute right-8 top-8 hover:text-black transition select-none">
          <input 
            type="checkbox" 
            className="rounded-sm border-gray-300 accent-[#0fafb8] w-4 h-4"
            checked={checkboxState}
            onChange={(e) => setCheckboxState(e.target.checked)}
          />
          {checkboxLabel}
        </label>
      )}
    </div>
    {children}
  </div>
);

const DashedButton = ({ onClick, label }) => (
  <button 
    type="button"
    onClick={onClick}
    className="w-full py-5 border-2 border-dashed border-gray-200 rounded hover:bg-gray-50 hover:border-[#0fafb8] transition text-[#0fafb8] font-bold text-sm uppercase tracking-wider flex items-center justify-center cursor-pointer"
  >
    {label}
  </button>
);

const StyledUploadZone = ({ onChange, accept, label }) => (
  <div className="relative w-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded bg-[#fafafa] hover:bg-gray-50 hover:border-[#0fafb8] transition cursor-pointer group">
    <input 
      type="file" 
      accept={accept}
      onChange={onChange} 
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      title=""
    />
    <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#0fafb8] mb-3 transition" />
    <span className="text-sm font-medium text-gray-600 group-hover:text-[#0fafb8] transition">{label}</span>
  </div>
);

const InputRow = ({ value, onChange, onAdd, onCancel, placeholder, error }) => (
  <div className="w-full animate-in fade-in duration-200">
    <div className="flex gap-3 w-full">
      <input 
        type="text" 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        className={`flex-1 border-b-2 bg-transparent ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-[#0fafb8]'} py-2 text-sm outline-none font-medium text-black transition-colors`}
      />
      <button type="button" onClick={onAdd} className="bg-[#0fafb8] text-white px-6 rounded text-sm font-bold cursor-pointer hover:bg-[#0a7981] transition">Add</button>
      <button type="button" onClick={onCancel} className="bg-gray-100 text-gray-600 px-6 rounded text-sm font-bold cursor-pointer hover:bg-gray-200 transition">Cancel</button>
    </div>
    {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
  </div>
);

const ItemList = ({ list, onRemove }) => (
  list.length > 0 && (
    <ul className="mb-6 space-y-2">
      {list.map((item, i) => (
        <li key={i} className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm text-gray-800 font-medium">
          <span>{item}</span>
          <button type="button" onClick={() => onRemove(i)} className="text-gray-400 hover:text-red-500 transition cursor-pointer p-1">
            <X className="w-4 h-4" />
          </button>
        </li>
      ))}
    </ul>
  )
);

const ChecklistItem = ({ label, isComplete, isLast, onClick }) => (
  <button 
    type="button"
    onClick={onClick}
    className={`w-full flex items-center justify-between py-3 ${!isLast ? 'border-b border-gray-100' : ''} cursor-pointer hover:bg-gray-50 transition px-2 rounded group`}
  >
    <span className={`text-sm font-medium text-left group-hover:text-[#0fafb8] transition ${isComplete ? 'text-gray-800' : 'text-gray-400'}`}>{label}</span>
    {isComplete ? (
      <CheckCircle className="w-5 h-5 text-[#0fafb8]" />
    ) : (
      <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-gray-300 transition" />
    )}
  </button>
);