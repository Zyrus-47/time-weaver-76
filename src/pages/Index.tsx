import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  Building, 
  BarChart3, 
  Download,
  CheckCircle,
  Zap,
  Shield,
  Smartphone
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-education-blue" />,
      title: "Smart Scheduling",
      description: "AI-powered algorithm creates conflict-free timetables automatically"
    },
    {
      icon: <Users className="h-8 w-8 text-education-green" />,
      title: "Faculty Management", 
      description: "Track workloads, leaves, and availability seamlessly"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-education-purple" />,
      title: "Analytics Dashboard",
      description: "Visualize faculty workload and classroom utilization"
    },
    {
      icon: <Download className="h-8 w-8 text-education-orange" />,
      title: "Export Options",
      description: "Download timetables as PDF or CSV formats"
    }
  ];

  const benefits = [
    "Automated conflict resolution",
    "Drag-and-drop customization", 
    "Faculty workload optimization",
    "Multiple export formats",
    "Cloud-based storage",
    "Mobile responsive design"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <Badge className="mb-6 px-4 py-2 bg-gradient-primary text-white">
              <Zap className="h-4 w-4 mr-2" />
              Intelligent Scheduling
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Create Perfect
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Timetables Instantly
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your institution's scheduling with our AI-powered timetable generator. 
              Handle complex requirements, avoid conflicts, and optimize resources effortlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 px-8 py-6 text-lg">
                <Link to="/create">
                  <Calendar className="mr-2 h-5 w-5" />
                  Create Timetable
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-primary rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-success rounded-full opacity-10 blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose TimeTable Pro?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for educational institutions with advanced features 
              that make scheduling simple and efficient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-all duration-300 bg-gradient-card">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Everything You Need for 
                <span className="bg-gradient-success bg-clip-text text-transparent block">
                  Perfect Scheduling
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our comprehensive solution handles all aspects of timetable creation, 
                from basic scheduling to complex constraints and special requirements.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-education-green flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button asChild size="lg" className="bg-gradient-success hover:opacity-90">
                <Link to="/create">
                  Start Creating Now
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <Card className="shadow-elevated bg-gradient-card p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Multi-Campus Support</h4>
                      <p className="text-sm text-muted-foreground">Handle multiple locations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Real-time Updates</h4>
                      <p className="text-sm text-muted-foreground">Instant schedule modifications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-education-purple rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Secure & Reliable</h4>
                      <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-education-orange rounded-lg flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Mobile Friendly</h4>
                      <p className="text-sm text-muted-foreground">Access anywhere, anytime</p>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-primary rounded-full opacity-20 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-success rounded-full opacity-20 blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Revolutionize Your Scheduling?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of educational institutions already using TimeTable Pro 
            to create perfect schedules in minutes, not hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="px-8 py-6 text-lg">
              <Link to="/create">
                <Calendar className="mr-2 h-5 w-5" />
                Create Your First Timetable
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-primary">
              <Link to="/about">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
