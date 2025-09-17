import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Clock, Users, Calendar, Target, Zap } from 'lucide-react';
import teamMember1 from '@/assets/team-member-1.jpg';
import teamMember2 from '@/assets/team-member-2.jpg';
import teamMember3 from '@/assets/team-member-3.jpg';
import teamMember4 from '@/assets/team-member-4.jpg';
import teamMember5 from '@/assets/team-member-5.jpg';
import teamMember6 from '@/assets/team-member-6.jpg';

const About = () => {
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-education-blue" />,
      title: "Smart Scheduling",
      description: "Advanced algorithms ensure optimal time allocation and conflict resolution."
    },
    {
      icon: <Users className="h-8 w-8 text-education-green" />,
      title: "Faculty Management", 
      description: "Track faculty workloads, leaves, and availability for better planning."
    },
    {
      icon: <Calendar className="h-8 w-8 text-education-purple" />,
      title: "Flexible Planning",
      description: "Handle special events, workshops, and custom scheduling requirements."
    },
    {
      icon: <Target className="h-8 w-8 text-education-orange" />,
      title: "Priority Handling",
      description: "Set subject priorities and ensure important classes are never missed."
    },
    {
      icon: <Zap className="h-8 w-8 text-education-red" />,
      title: "Real-time Updates",
      description: "Drag-and-drop interface for instant timetable modifications."
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      title: "Educational Focus",
      description: "Built specifically for educational institutions and training centers."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">ChronoClass</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            ChronoClass is a comprehensive solution for educational institutions to create, 
            manage, and optimize their class schedules with intelligent automation and 
            user-friendly interfaces.
          </p>
        </div>

        {/* Meet The Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet The Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 shadow-card">
                <img 
                  src={teamMember1} 
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 shadow-card">
                <img 
                  src={teamMember2} 
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 shadow-card">
                <img 
                  src={teamMember3} 
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 shadow-card">
                <img 
                  src={teamMember4} 
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 shadow-card">
                <img 
                  src={teamMember5} 
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 shadow-card">
                <img 
                  src={teamMember6} 
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose ChronoClass?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-300 bg-gradient-card backdrop-blur border border-white/10">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center shadow">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Input Your Data</h3>
              <p className="text-muted-foreground">
                Enter your subjects, faculty, classrooms, and scheduling preferences
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-success rounded-full flex items-center justify-center shadow">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate Schedule</h3>
              <p className="text-muted-foreground">
                Our smart algorithm creates an optimized timetable automatically
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-education-purple rounded-full flex items-center justify-center shadow">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customize & Export</h3>
              <p className="text-muted-foreground">
                Fine-tune your schedule and export to PDF or CSV format
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="shadow-elevated bg-gradient-primary">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Transform Your Scheduling?
              </h2>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Join thousands of educational institutions already using ChronoClass 
                to streamline their scheduling process.
              </p>
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors shadow">
                Start Creating Timetables
              </button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;