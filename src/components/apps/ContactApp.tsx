import Window from '@/components/desktop/Window';
import { Mail, MapPin, Github, Linkedin, ExternalLink, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContactApp = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'adityaaa232004@gmail.com',
      action: () => window.open('mailto:adityaaa232004@gmail.com'),
      color: 'bg-red-500',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Aditya Kumar Singh',
      action: () => window.open('https://www.linkedin.com/in/aditya-kumar-singh-20061728b/', '_blank'),
      color: 'bg-blue-600',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'MzeeTez',
      action: () => window.open('https://github.com/MzeeTez', '_blank'),
      color: 'bg-gray-800',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Kolkata, West Bengal, India',
      action: null, // Just display
      color: 'bg-green-500',
    },
  ];

  return (
    <Window id="contact" title="Contact Me" width={600} height={500}>
      <div className="h-full flex flex-col p-6 bg-background/95 backdrop-blur-sm">
        
        {/* Header Profile Section */}
        <div className="flex flex-col items-center mb-8 animate-in slide-in-from-top-4 duration-500">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-1 mb-4 shadow-lg">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
               <User className="w-12 h-12 text-muted-foreground" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Aditya Kumar Singh</h2>
          <p className="text-muted-foreground font-medium">Android Developer</p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactInfo.map((item, i) => (
            <div 
              key={item.label}
              className="group p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300 flex items-center gap-4 cursor-default animate-in zoom-in-50"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`p-3 rounded-lg ${item.color} bg-opacity-10 text-white shrink-0 shadow-sm`}>
                <item.icon className={`w-5 h-5 ${item.color.replace('bg-', 'text-')}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.label}</p>
                <p className="text-sm font-semibold truncate" title={item.value}>{item.value}</p>
              </div>

              {item.action && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={item.action}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-auto pt-6 text-center">
            <p className="text-xs text-muted-foreground">
                Always open to new opportunities and collaborations.
            </p>
        </div>

      </div>
    </Window>
  );
};

export default ContactApp;