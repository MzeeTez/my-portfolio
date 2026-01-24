import Window from '@/components/desktop/Window';
import { Folder, FileText, Image, Github, Linkedin, Mail } from 'lucide-react';

const FinderApp = () => {
  const sidebarItems = [
    { icon: Folder, label: 'Applications' },
    { icon: Folder, label: 'Desktop' },
    { icon: Folder, label: 'Documents' },
    { icon: Folder, label: 'Downloads' },
  ];

  return (
    <Window id="finder" title="About Me — Finder" width={800} height={520}>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-48 bg-secondary/50 border-r border-border p-2">
          <p className="text-xs font-semibold text-muted-foreground mb-2 px-2">Favorites</p>
          {sidebarItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer"
            >
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Profile Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-primary-foreground">
              AK
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Aditya Kumar Singh</h1>
              <p className="text-primary font-medium">Android Developer</p>
              <p className="text-muted-foreground text-sm mt-1">Kolkata, West Bengal, India</p>
              <div className="flex gap-3 mt-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="mailto:adityaaa232004@gmail.com"
                  className="p-2 rounded-lg bg-secondary hover:bg-accent transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-lg">About.txt</h2>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 text-sm leading-relaxed text-foreground/90">
              <p>
                Motivated and detail-oriented developer with strong skills in Android development 
                (Java/XML), Flutter (Dart), and core programming fundamentals. Experienced in 
                building full-stack mobile applications with Firebase, real-time IoT integration, 
                and map-based services (OSM).
              </p>
              <p className="mt-3">
                Completed an internship at Jadavpur University, contributing to an EV-to-EV charging 
                system and market research in the EV sector. Adept at creating practical, user-focused 
                solutions and continuously improving technical capabilities.
              </p>
            </div>

            {/* Education */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Image className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg">Education</h2>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="font-medium">B.Tech in Information Technology</p>
                  <p className="text-sm text-muted-foreground">Institute of Engineering and Management • GPA: 8+ • 2023 - Present</p>
                </div>
                <div>
                  <p className="font-medium">AISSCE (XII CBSE)</p>
                  <p className="text-sm text-muted-foreground">B.D. Memorial International • 80% • 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default FinderApp;
