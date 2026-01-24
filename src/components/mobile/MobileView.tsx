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
    <div className="min-h-screen bg-background p-4 pb-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-md mx-auto space-y-4"
      >
        {/* Profile Card */}
        <motion.div
          variants={itemVariants}
          className="glass rounded-2xl p-6 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
            AK
          </div>
          <h1 className="text-xl font-bold">Aditya Kumar Singh</h1>
          <p className="text-primary font-medium">Android Developer</p>
          <p className="text-muted-foreground text-sm">Kolkata, India</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="https://github.com" className="p-2 rounded-lg bg-secondary">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" className="p-2 rounded-lg bg-secondary">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:adityaaa232004@gmail.com" className="p-2 rounded-lg bg-secondary">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* About Widget */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">About</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Motivated developer with strong skills in Android development and Flutter. 
            Experienced in building full-stack mobile applications with Firebase and IoT integration.
          </p>
        </motion.div>

        {/* Skills Widget */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Skills</h2>
          </div>
          <div className="space-y-3">
            {skills.map((skill) => (
              <div key={skill.category}>
                <p className="text-xs text-muted-foreground mb-1">{skill.category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-1 text-xs rounded-md bg-secondary text-secondary-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Projects Widget */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Projects</h2>
          </div>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.name} className="p-3 rounded-lg bg-secondary/50">
                <h3 className="font-medium text-sm">{project.name}</h3>
                <p className="text-xs text-muted-foreground">{project.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Widget */}
        <motion.div variants={itemVariants} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Contact</h2>
          </div>
          <a
            href="mailto:adityaaa232004@gmail.com"
            className="block w-full py-3 text-center rounded-lg bg-primary text-primary-foreground font-medium text-sm"
          >
            Send Email
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MobileView;
