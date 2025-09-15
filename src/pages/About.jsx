import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Clock, Users, Calendar, Target, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
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

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="shadow-elevated bg-gradient-card">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
                We believe that efficient scheduling is the backbone of quality education. 
                Our mission is to empower educational institutions with smart, automated 
                timetabling solutions that save time, reduce conflicts, and optimize 
                resource utilization.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose ChronoClass?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-300">
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
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Input Your Data</h3>
              <p className="text-muted-foreground">
                Enter your subjects, faculty, classrooms, and scheduling preferences
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-success rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Generate Schedule</h3>
              <p className="text-muted-foreground">
                Our smart algorithm creates an optimized timetable automatically
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-education-purple rounded-full flex items-center justify-center">
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
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors">
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