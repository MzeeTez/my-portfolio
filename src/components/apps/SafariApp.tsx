import Window from '@/components/desktop/Window';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Share, Plus } from 'lucide-react';

const projects = [
  {
    name: 'Auctora',
    description: 'Real-time bidding app with E-commerce features, live bidding rooms, and checkout system.',
    tech: ['Flutter', 'Dart', 'Firebase'],
    date: 'Sept 2025',
  },
  {
    name: 'EVX',
    description: 'EV-to-EV charging app connecting donors and acceptors with real-time map integration.',
    tech: ['Java', 'XML', 'Firebase', 'OSM'],
    date: 'May 2025',
  },
  {
    name: 'AutoUpKeep',
    description: 'Machine monitoring app with IoT integration, visualizations, and predictive analytics.',
    tech: ['Java', 'XML', 'Android Studio'],
    date: 'Aug 2025',
  },
  {
    name: 'IEM-Ride',
    description: 'Ride booking and car seat sharing app with payment integration.',
    tech: ['Java', 'XML', 'Firebase', 'OSM'],
    date: 'Sept 2025',
  },
];

const SafariApp = () => {
  return (
    <Window id="safari" title="Safari — Projects" width={900} height={600}>
      <div className="h-full flex flex-col">
        {/* Safari Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border-b border-border">
          <button className="p-1.5 rounded hover:bg-accent transition-colors">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 rounded hover:bg-accent transition-colors">
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </button>
          
          {/* URL Bar */}
          <div className="flex-1 flex items-center gap-2 bg-background rounded-lg px-3 py-1.5 mx-2">
            <Lock className="w-3 h-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">aditya.dev/projects</span>
          </div>
          
          <button className="p-1.5 rounded hover:bg-accent transition-colors">
            <Share className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 rounded hover:bg-accent transition-colors">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto bg-background">
          <h1 className="text-2xl font-bold mb-6">My Projects</h1>
          
          <div className="grid grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.name}
                className="group p-5 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <span className="text-xs text-muted-foreground">{project.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Window>
  );
};

export default SafariApp;
