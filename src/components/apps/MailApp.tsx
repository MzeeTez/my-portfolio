import { useState } from 'react';
import Window from '@/components/desktop/Window';
import { Send, Inbox, Star, FileText, Trash2 } from 'lucide-react';

const MailApp = () => {
  const [formData, setFormData] = useState({
    from: '',
    subject: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setFormData({ from: '', subject: '', message: '' });
  };

  const sidebarItems = [
    { icon: Inbox, label: 'Inbox', count: 3 },
    { icon: Star, label: 'Starred' },
    { icon: FileText, label: 'Drafts' },
    { icon: Send, label: 'Sent' },
    { icon: Trash2, label: 'Trash' },
  ];

  return (
    <Window id="mail" title="Mail — Contact" width={750} height={500}>
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-44 bg-secondary/30 border-r border-border p-2">
          <button className="w-full mb-3 py-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">
            Compose
          </button>
          {sidebarItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{item.label}</span>
              </div>
              {item.count && (
                <span className="text-xs text-muted-foreground">{item.count}</span>
              )}
            </div>
          ))}
        </div>

        {/* Compose Area */}
        <div className="flex-1 p-4">
          <div className="bg-card rounded-xl border border-border h-full p-4">
            <h2 className="text-lg font-semibold mb-4">New Message</h2>
            
            {sent ? (
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Send className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="font-medium text-green-600">Message Sent!</p>
                  <p className="text-sm text-muted-foreground">Thank you for reaching out.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">To:</label>
                  <input
                    type="text"
                    value="adityaaa232004@gmail.com"
                    disabled
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">From:</label>
                  <input
                    type="email"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Subject:</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Let's connect!"
                    required
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Message:</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message here..."
                    required
                    rows={4}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm resize-none focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Window>
  );
};

export default MailApp;
