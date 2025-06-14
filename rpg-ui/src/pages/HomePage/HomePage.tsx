import { Play, BookOpen, Users, Package } from 'lucide-react';

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
      <section className="bg-gradient-to-b from-card to-background py-16 md:py-24 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
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
                <Link
                  to="/adventures"
                  className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Browse Adventures
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-accent transition-colors"
                >
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/adventures"
                  className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Explore Adventures
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-accent transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-muted/10 to-background">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Everything You Need to Run Great Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Ready-to-Run Adventures</h3>
              <p className="text-muted-foreground">
                Well-tested adventures that actually work at the table. Fantasy, horror, sci-fi, 
                historical, and modern settings that you can start running tonight. 
                {isAuthenticated ? " Your full premium library awaits." : " Sign up for the complete collection."}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Package className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Asset Library</h3>
              <p className="text-muted-foreground">
                Build your collection of characters, creatures, items, and locations. 
                Organize everything exactly how your group needs it. 
                {isAuthenticated ? " Create unlimited assets and share with your players." : " Sign up to build your personal collection."}
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                <Users className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Campaign Tools</h3>
              <p className="text-muted-foreground">
                Connect your adventures and assets into cohesive campaigns. 
                Track what matters, organize your sessions, keep your story flowing. 
                {isAuthenticated ? " Manage all your active campaigns in one place." : " Sign up to build and manage custom campaigns."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Genre Variety Section */}
      <section className="py-16 md:py-20 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Every Genre, Every Style
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            25 years of GMing means adventures for every group and every mood. 
            From quick one-shots to epic campaigns.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['Fantasy', 'Horror', 'Science Fiction', 'Historical', 'Modern World', 'Mystery'].map((genre, index) => (
              <div 
                key={genre} 
                className={`p-4 rounded-lg border transition-colors hover:border-accent/50 ${
                  index % 2 === 0 ? 'bg-background border-border' : 'bg-muted/30 border-muted'
                }`}
              >
                <span className="font-medium text-foreground">{genre}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-muted/10 to-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Made by the Community, for the Community
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Built by someone who's been running games for decades and knows what actually 
            works at the table. Every feature solves real problems that come up during play, 
            not theoretical ones.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
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
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/adventures"
                  className="inline-flex items-center px-8 py-4 border border-border text-foreground font-medium rounded-lg hover:bg-accent transition-colors"
                >
                  Browse Adventures
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/adventures"
                  className="inline-flex items-center px-8 py-4 border border-border text-foreground font-medium rounded-lg hover:bg-accent transition-colors"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Preview Adventures
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}