import { Play, BookOpen, Users, Package } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { Card, CardHeader, CardContent, CardIcon } from '@/components/Card/Card';
import { Badge } from '@/components/Badge/Badge';
import { Hero } from '@/components/Hero/Hero';
import { Section } from '@/components/Section/Section';

// Mock Link component for artifact demo
const Link = ({ to, className, children, ...props }: any) => (
  <a href={to} className={className} {...props}>{children}</a>
);

export function HomePage() {
  // Mock auth state - replace with real auth context later
  const isAuthenticated = false;

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <Hero>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Making it easier than ever to get into tabletop gaming
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Solve the GM shortage with ready-to-run adventures and robust tools. 
          Built by the community, for the community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Button as="link" href="/adventures" variant="accent" leftIcon={Play}>
                Browse Adventures
              </Button>
              <Button as="link" href="/dashboard" variant="secondary">
                Go to Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button as="link" href="/adventures" variant="accent" leftIcon={Play}>
                Explore Adventures
              </Button>
              <Button as="link" href="/login" variant="secondary">
                Get Started
              </Button>
            </>
          )}
        </div>
      </Hero>

      {/* Problem/Solution Section */}
      <Section align="center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          The GM Problem
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Running great tabletop games shouldn't be overwhelming. Finding good Game Masters 
          shouldn't be impossible. Too many amazing gaming experiences never happen because 
          no one wants to tackle the complexity of GMing.
        </p>
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-8">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            We Make It Simple
          </h3>
          <p className="text-lg text-muted-foreground">
            Jump into compact, well-crafted adventures that actually work at the table. 
            Use our tools to build exactly what your group needs. Draw from 25 years of 
            real-world gaming experience, designed for SimpleD6 or any system you prefer.
          </p>
        </div>
      </Section>

      {/* Features Section */}
      <Section background="accent" size="lg">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Everything You Need to Run Great Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card variant="feature" className="text-center group">
            <CardIcon icon={BookOpen} variant="gradient" />
            <CardHeader>
              <h3 className="text-xl font-semibold text-foreground mb-3">Ready-to-Run Adventures</h3>
            </CardHeader>
            <CardContent>
              Well-tested adventures that actually work at the table. Fantasy, horror, sci-fi, 
              historical, and modern settings that you can start running tonight. 
              {isAuthenticated ? " Your full premium library awaits." : " Sign up for the complete collection."}
            </CardContent>
          </Card>
          
          <Card variant="feature" className="text-center group">
            <CardIcon icon={Package} variant="gradient" />
            <CardHeader>
              <h3 className="text-xl font-semibold text-foreground mb-3">Asset Library</h3>
            </CardHeader>
            <CardContent>
              Build your collection of characters, creatures, items, and locations. 
              Organize everything exactly how your group needs it. 
              {isAuthenticated ? " Create unlimited assets and share with your players." : " Sign up to build your personal collection."}
            </CardContent>
          </Card>
          
          <Card variant="feature" className="text-center group">
            <CardIcon icon={Users} variant="gradient" />
            <CardHeader>
              <h3 className="text-xl font-semibold text-foreground mb-3">Campaign Tools</h3>
            </CardHeader>
            <CardContent>
              Connect your adventures and assets into cohesive campaigns. 
              Track what matters, organize your sessions, keep your story flowing. 
              {isAuthenticated ? " Manage all your active campaigns in one place." : " Sign up to build and manage custom campaigns."}
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Genre Variety Section */}
      <Section background="card" align="center" className="border-y border-border">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Every Genre, Every Style
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          25 years of GMing means adventures for every group and every mood. 
          From quick one-shots to epic campaigns.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Badge variant="fantasy" size="lg" className="justify-center">Fantasy</Badge>
          <Badge variant="horror" size="lg" className="justify-center">Horror</Badge>
          <Badge variant="scifi" size="lg" className="justify-center">Science Fiction</Badge>
          <Badge variant="historical" size="lg" className="justify-center">Historical</Badge>
          <Badge variant="modern" size="lg" className="justify-center">Modern World</Badge>
          <Badge variant="mystery" size="lg" className="justify-center">Mystery</Badge>
        </div>
      </Section>

      {/* Community Section */}
      <Section background="accent" align="center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Made by the Community, for the Community
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Built by someone who's been running games for decades and knows what actually 
          works at the table. Every feature solves real problems that come up during play, 
          not theoretical ones.
        </p>
      </Section>

      {/* CTA Section */}
      <Section align="center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Ready to Start Running Great Games?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          {isAuthenticated 
            ? "Welcome back! Check out your dashboard or browse new adventures."
            : "Join the community and get access to everything you need to become a confident GM."
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Button as="link" href="/dashboard" variant="primary" size="lg">
                Go to Dashboard
              </Button>
              <Button as="link" href="/adventures" variant="secondary" size="lg">
                Browse Adventures
              </Button>
            </>
          ) : (
            <>
              <Button as="link" href="/login" variant="accent" size="lg">
                Get Started
              </Button>
              <Button as="link" href="/adventures" variant="secondary" leftIcon={BookOpen} size="lg">
                Preview Adventures
              </Button>
            </>
          )}
        </div>
      </Section>
    </div>
  );
}