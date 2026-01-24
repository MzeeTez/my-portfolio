import { motion } from 'framer-motion';
import { User, Code, Briefcase, Mail, Terminal, Github, Linkedin } from 'lucide-react';

const skills = [
  { category: 'Languages', items: ['C', 'Java', 'Python', 'XML', 'Dart'] },
  { category: 'Frameworks', items: ['Flutter', 'Android SDK', 'Java Collections'] },
  { category: 'Databases', items: ['SQLite', 'Firebase', 'Supabase', 'MySQL'] },
  { category: 'Tools', items: ['Git', 'GitHub', 'Android Studio', 'VS Code'] },
];

const projects = [
  { name: 'Auctora', description: 'Real-time bidding app with E-commerce features' },
  { name: 'EVX', description: 'EV-to-EV charging app with map integration' },
  { name: 'AutoUpKeep', description: 'Machine monitoring with IoT and analytics' },
  { name: 'IEM-Ride', description: 'Ride booking and car seat sharing app' },
];

const MobileView = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    // Added 'h-screen overflow-y-auto' to enable scrolling within this view
    // even if body has overflow:hidden
    <main className="fixed inset-0 z-50 h-screen w-full overflow-y-auto bg-background p-4 pb-20 scroll-smooth">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-md mx-auto space-y-4"
      >
        {/* Profile Card */}
        <motion.section
          variants={itemVariants}
          className="glass rounded-2xl p-6 text-center"
          aria-label="Profile Information"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-lg">
            AK
          </div>
          <h1 className="text-xl font-bold tracking-tight">Aditya Kumar Singh</h1>
          <p className="text-primary font-medium">Android Developer</p>
          <p className="text-muted-foreground text-sm">Kolkata, India</p>
          
          <nav className="flex justify-center gap-4 mt-4" aria-label="Social Links">
            <a 
              href="https://github.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="mailto:adityaaa232004@gmail.com" 
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
              aria-label="Send Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </nav>
        </motion.section>

        {/* About Widget */}
        <motion.section variants={itemVariants} className="glass rounded-2xl p-5" aria-labelledby="about-heading">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 id="about-heading" className="font-semibold">About</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed text-left">
            Motivated developer with strong skills in Android development and Flutter. 
            Experienced in building full-stack mobile applications with Firebase and IoT integration.
          </p>
        </motion.section>

        {/* Skills Widget */}
        <motion.section variants={itemVariants} className="glass rounded-2xl p-5" aria-labelledby="skills-heading">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 id="skills-heading" className="font-semibold">Skills</h2>
          </div>
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.category}>
                <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">{skill.category}</h3>
                <ul className="flex flex-wrap gap-1.5 list-none m-0 p-0">
                  {skill.items.map((item) => (
                    <li
                      key={item}
                      className="px-2.5 py-1 text-xs rounded-md bg-secondary text-secondary-foreground font-medium"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Projects Widget */}
        <motion.section variants={itemVariants} className="glass rounded-2xl p-5" aria-labelledby="projects-heading">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 id="projects-heading" className="font-semibold">Projects</h2>
          </div>
          <div className="space-y-3">
            {projects.map((project) => (
              <article key={project.name} className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                <h3 className="font-medium text-sm mb-1">{project.name}</h3>
                <p className="text-xs text-muted-foreground">{project.description}</p>
              </article>
            ))}
          </div>
        </motion.section>

        {/* Contact Widget */}
        <motion.section variants={itemVariants} className="glass rounded-2xl p-5" aria-labelledby="contact-heading">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
            <h2 id="contact-heading" className="font-semibold">Contact</h2>
          </div>
          <a
            href="mailto:adityaaa232004@gmail.com"
            className="flex items-center justify-center w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Send Email to Aditya"
          >
            Send Email
          </a>
        </motion.section>
        
        {/* Safe Area Spacer for bottom navigation if needed */}
        <div className="h-4" aria-hidden="true" />
      </motion.div>
    </main>
  );
};

export default MobileView;