import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Eye, Timer, Shuffle } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: UserPlus,
      title: "Easy Enrollment",
      description: "Simple form to enroll users with all necessary details and document upload.",
    },
    {
      icon: Eye,
      title: "View & Manage",
      description: "See all enrolled users in an organized table with powerful filtering options.",
    },
    {
      icon: Shuffle,
      title: "Group Randomization",
      description: "Automatically distribute users into groups with a single click.",
    },
    {
      icon: Timer,
      title: "Built-in Timer",
      description: "Set and track countdown timers for your enrollment sessions.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to EnrollHub
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A modern platform for managing enrollments, organizing groups, and tracking progress with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/enroll">
              <Button size="lg" className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-5 w-5" />
                Start Enrollment
              </Button>
            </Link>
            <Link to="/view">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Eye className="mr-2 h-5 w-5" />
                View Enrollments
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our platform today and experience seamless enrollment management.
          </p>
          <Link to="/enroll">
            <Button size="lg">
              Enroll Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
