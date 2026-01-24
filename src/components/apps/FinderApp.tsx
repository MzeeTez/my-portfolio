import { useState } from 'react';
import Window from '@/components/desktop/Window';
import { 
  Folder, Github, Linkedin, Mail, 
  MapPin, GraduationCap, Briefcase, Code2, 
  Smartphone, Layers, Zap, Car, Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FinderApp = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const sidebarItems = [
    { id: 'overview', icon: Folder, label: 'Overview', color: 'text-blue-400' },
    { id: 'projects', icon: Briefcase, label: 'Projects', color: 'text-purple-400' },
    { id: 'skills', icon: Code2, label: 'Tech Stack', color: 'text-emerald-400' },
    { id: 'education', icon: GraduationCap, label: 'Education', color: 'text-orange-400' },
  ];

  const projects = [
    {
      title: 'Auctora',
      desc: 'Real-time bidding & e-commerce app',
      icon: Smartphone,
      tech: ['Flutter', 'Firebase', 'Dart'],
      color: 'bg-orange-500/20 text-orange-200'
    },
    {
      title: 'EVX',
      desc: 'Peer-to-peer EV charging network',
      icon: Zap,
      tech: ['Java', 'XML', 'IoT'],
      color: 'bg-green-500/20 text-green-200'
    },
    {
      title: 'IEM-Ride',
      desc: 'Carpooling app with OSM integration',
      icon: Car,
      tech: ['Android SDK', 'OpenStreetMaps'],
      color: 'bg-blue-500/20 text-blue-200'
    },
    {
      title: 'Machine Monitor',
      desc: 'IoT industrial monitoring system',
      icon: Monitor,
      tech: ['Java', 'IoT', 'Graphs'],
      color: 'bg-gray-500/20 text-gray-200'
    }
  ];

  const skills = [
    "Android Development", "Flutter & Dart", "Java/XML", 
    "Firebase", "Supabase", "SQL", "Git & GitHub", "IoT Integration"
  ];

  return (
    <Window id="finder" title="Aditya — Portfolio" width={900} height={600}>
      {/* Increased opacity (95%) and darker background for better readability */}
      <div className="flex h-full bg-[#0f0f10]/95 text-gray-100 font-sans">
        
        {/* --- Sidebar --- */}
        <div className="w-56 bg-[#18181b] border-r border-white/10 flex flex-col pt-4 pb-4">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Favorites</p>
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-white' : item.color}`} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Simplified "Open to Work" Badge */}
          <div className="px-4 mt-auto">
             <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20 flex items-center justify-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-sm font-bold text-green-400">Open to Work</span>
             </div>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="flex-1 overflow-y-auto bg-[#09090b]">
           {/* Top Header */}
           <div className="sticky top-0 z-10 bg-[#09090b]/90 backdrop-blur-md border-b border-white/10 px-8 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                 <Monitor className="w-4 h-4" />
                 <span>Aditya's MacBook</span>
                 <span className="text-gray-600">/</span>
                 <span className="text-white font-medium capitalize">{activeTab}</span>
              </div>
              <div className="flex gap-2">
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10 text-gray-300 hover:text-white">
                    <Github className="w-4 h-4" onClick={() => window.open('https://github.com/MzeeTez', '_blank')} />
                 </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10 text-gray-300 hover:text-white">
                    <Linkedin className="w-4 h-4" onClick={() => window.open('https://linkedin.com', '_blank')} />
                 </Button>
              </div>
           </div>

           <div className="p-8 max-w-4xl mx-auto space-y-10">
              
              {/* Profile Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-8">
                 <div className="flex gap-6 items-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-blue-900/20">
                       AK
                    </div>
                    <div className="space-y-1">
                       <h1 className="text-3xl font-bold text-white tracking-tight">Aditya Kumar Singh</h1>
                       <div className="flex items-center gap-2 text-blue-300 font-medium">
                          <Code2 className="w-4 h-4" />
                          <span>Android Developer</span>
                       </div>
                       <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <MapPin className="w-3 h-3" />
                          <span>Kolkata, India</span>
                       </div>
                    </div>
                 </div>
                 <Button size="sm" className="bg-white text-black hover:bg-gray-200 font-medium" onClick={() => window.open('mailto:adityaaa232004@gmail.com')}>
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Me
                 </Button>
              </div>

              {/* DYNAMIC CONTENT */}
              
              {/* 1. Projects */}
              {(activeTab === 'overview' || activeTab === 'projects') && (
                 <div className="space-y-5 animate-in fade-in duration-500">
                    <div className="flex items-center justify-between">
                       <h2 className="text-xl font-bold text-white">Featured Projects</h2>
                       {activeTab === 'overview' && (
                          <button onClick={() => setActiveTab('projects')} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All</button>
                       )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {projects.map((project, idx) => (
                          <div key={idx} className="group bg-[#18181b] hover:bg-[#202024] border border-white/10 rounded-xl p-5 transition-all hover:border-white/20 cursor-default shadow-sm">
                             <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg ${project.color}`}>
                                   <project.icon className="w-6 h-6" />
                                </div>
                                <Github className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors cursor-pointer" />
                             </div>
                             <h3 className="font-bold text-lg text-white mb-2">{project.title}</h3>
                             <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">{project.desc}</p>
                             <div className="flex flex-wrap gap-2">
                                {project.tech.map(t => (
                                   <span key={t} className="px-2.5 py-1 rounded-md bg-black/40 border border-white/10 text-xs font-medium text-gray-300">
                                      {t}
                                   </span>
                                ))}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}

              {/* 2. Skills & About */}
              {(activeTab === 'overview' || activeTab === 'skills') && (
                 <div className="space-y-5 animate-in fade-in duration-700">
                    <h2 className="text-xl font-bold text-white">Technical Skills</h2>
                    <div className="bg-[#18181b] border border-white/10 rounded-xl p-6">
                       <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => (
                             <Badge key={skill} variant="secondary" className="bg-[#27272a] hover:bg-[#3f3f46] text-gray-100 border border-white/5 py-1.5 px-3 text-sm font-normal">
                                {skill}
                             </Badge>
                          ))}
                       </div>
                    </div>
                    
                    {activeTab === 'skills' && (
                       <div className="bg-[#18181b] border border-white/10 rounded-xl p-6 mt-6">
                          <h3 className="text-base font-bold text-white mb-3">About Me</h3>
                          <p className="text-gray-300 leading-relaxed">
                             I am a B.Tech student in Information Technology with a deep passion for mobile development. 
                             My journey involves building full-stack applications using <strong className="text-white">Flutter</strong> and native <strong className="text-white">Android (Java/XML)</strong>. 
                             I have hands-on experience with IoT integrations, real-time database management, and map-based services.
                          </p>
                       </div>
                    )}
                 </div>
              )}

              {/* 3. Education */}
              {(activeTab === 'overview' || activeTab === 'education') && (
                 <div className="space-y-5 animate-in fade-in duration-700">
                    <h2 className="text-xl font-bold text-white">Education</h2>
                    <div className="bg-[#18181b] border border-white/10 rounded-xl overflow-hidden">
                       <div className="p-5 border-b border-white/5 hover:bg-[#202024] transition-colors">
                          <div className="flex justify-between items-start mb-2">
                             <div>
                                <h3 className="font-bold text-white text-lg">B.Tech in Information Technology</h3>
                                <p className="text-gray-400">Institute of Engineering and Management</p>
                             </div>
                             <Badge className="bg-green-900/30 text-green-400 hover:bg-green-900/50 border-green-800">GPA: 8.0+</Badge>
                          </div>
                          <p className="text-sm text-gray-500">2023 — Present</p>
                       </div>
                       
                       <div className="p-5 hover:bg-[#202024] transition-colors">
                          <div className="flex justify-between items-start mb-2">
                             <div>
                                <h3 className="font-bold text-white text-lg">Class XII (CBSE)</h3>
                                <p className="text-gray-400">B.D. Memorial International</p>
                             </div>
                             <span className="text-gray-400 font-mono font-medium">80%</span>
                          </div>
                          <p className="text-sm text-gray-500">2023</p>
                       </div>
                    </div>
                 </div>
              )}

           </div>
        </div>
      </div>
    </Window>
  );
};

export default FinderApp;