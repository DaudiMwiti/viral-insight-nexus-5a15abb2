
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { BarChart3, LineChart, PieChart, TrendingUp, Heart, Globe } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const handleEnterDashboard = () => {
    navigate('/dashboard');
  };

  // Container animation for staggered children
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Animation for individual elements
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const features = [
    {
      title: "Multi-platform Analysis",
      description: "Track performance across Twitter, Reddit, LinkedIn, and more",
      icon: <Globe className="h-10 w-10 text-primary" />,
    },
    {
      title: "Thread Generation",
      description: "AI-powered content generation optimized for each platform",
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
    },
    {
      title: "Sentiment Trends",
      description: "Understand audience reactions and emotional responses",
      icon: <Heart className="h-10 w-10 text-primary" />,
    },
    {
      title: "Performance Metrics",
      description: "Engagement statistics and growth analytics",
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Viral Insight Nexus</h2>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={handleEnterDashboard}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        className="flex-grow flex flex-col md:flex-row items-center container mx-auto px-4 py-12 md:py-24"
        initial="hidden"
        animate="show"
        variants={containerAnimation}
      >
        <motion.div 
          className="md:w-1/2 space-y-6 text-center md:text-left"
          variants={itemAnimation}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="block">AI-powered</span> 
            <span className="block text-primary">insights</span> 
            <span className="block">for social media</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto md:mx-0">
            Comprehensive analytics and insight generation across multiple platforms to grow your audience.
          </p>
          <div className="pt-4">
            <Button 
              size="lg" 
              onClick={handleEnterDashboard}
              className="text-lg px-8 py-6 font-medium"
            >
              Enter Dashboard
            </Button>
          </div>
        </motion.div>

        <motion.div 
          className="mt-12 md:mt-0 md:w-1/2 flex justify-center"
          variants={itemAnimation}
        >
          <div className="relative w-full max-w-lg">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="backdrop-blur-sm bg-background/80 border">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <LineChart className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">Trend Analysis</p>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm bg-background/80 border">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <PieChart className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">Market Share</p>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm bg-background/80 border">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">Performance</p>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm bg-background/80 border">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">Comparison</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-16 bg-muted/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Key Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Leverage AI-powered analytics to understand your audience and optimize your social media presence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-card p-6 rounded-lg shadow-sm border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index + 0.7, duration: 0.5 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Platform Tabs */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Supported Platforms</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get insights across all major social media platforms in one dashboard
          </p>
        </div>

        <Tabs defaultValue="twitter" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="twitter">Twitter</TabsTrigger>
            <TabsTrigger value="reddit">Reddit</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="web">Web</TabsTrigger>
          </TabsList>
          <TabsContent value="twitter" className="mt-6 p-6 bg-card rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Twitter Analytics</h3>
            <p className="text-muted-foreground mb-4">
              Comprehensive Twitter engagement metrics, sentiment analysis, and content optimization
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Thread generation optimized for Twitter's algorithm</li>
              <li>Engagement tracking and audience growth metrics</li>
              <li>Hashtag effectiveness and trend analysis</li>
            </ul>
          </TabsContent>
          <TabsContent value="reddit" className="mt-6 p-6 bg-card rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Reddit Analytics</h3>
            <p className="text-muted-foreground mb-4">
              Subreddit performance tracking, content analysis, and community engagement metrics
            </p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Subreddit-specific content recommendations</li>
              <li>Upvote and comment engagement tracking</li>
              <li>Community sentiment and topic interest analysis</li>
            </ul>
          </TabsContent>
          {/* Other platform tabs would have similar content structure */}
          <TabsContent value="linkedin" className="mt-6 p-6 bg-card rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">LinkedIn Analytics</h3>
            <p className="text-muted-foreground">Professional network insights and business engagement metrics</p>
          </TabsContent>
          <TabsContent value="instagram" className="mt-6 p-6 bg-card rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Instagram Analytics</h3>
            <p className="text-muted-foreground">Visual content performance and audience engagement metrics</p>
          </TabsContent>
          <TabsContent value="youtube" className="mt-6 p-6 bg-card rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">YouTube Analytics</h3>
            <p className="text-muted-foreground">Video performance metrics and audience retention insights</p>
          </TabsContent>
          <TabsContent value="web" className="mt-6 p-6 bg-card rounded-lg border">
            <h3 className="text-xl font-semibold mb-2">Web Analytics</h3>
            <p className="text-muted-foreground">Website traffic, conversion, and user behavior metrics</p>
          </TabsContent>
        </Tabs>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">
                © 2025 Viral Insight Nexus. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground">Powered by CrewAI + Groq</p>
              <Separator orientation="vertical" className="h-4" />
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
