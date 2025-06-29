import { Play, BookOpen, Users, Package, Map } from "lucide-react";
import { Button } from "@/components/Button/Button";
import {
  Card,
  CardHeader,
  CardContent,
  CardIcon,
} from "@/components/Card/Card";
import { Badge } from "@/components/Badge/Badge";
import { Hero } from "@/components/Hero/Hero";
import { Section } from "@/components/Section/Section";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { CyberpunkSection } from "@/components/Sections/CyberpunkSection/CyberpunkSection";
import { CosmicHorrorSection } from "@/components/Sections/HorrorSection/CosmicHorrorSection";
import { FantasySection } from "@/components/Sections/FantasySection/FantasySection";

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <Hero variant="default" className="relative overflow-hidden">
        {/* Content container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6">
            <div className="space-y-6 text-left lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent mb-6">
                Everything You Need to GM
              </h1>
              <div className="grid grid-cols-1 gap-3 text-lg text-muted-foreground mb-8">
                <div className="flex items-center gap-3">
                  <Play className="h-5 w-5 text-accent" />
                  <span>Jump into tested adventures</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-accent" />
                  <span>Build with thousands of assets</span>
                </div>
                <div className="flex items-center gap-3">
                  <Map className="h-5 w-5 text-accent" />
                  <span>Create entire worlds</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={() => navigate(`/adventures/`)}
                    variant="accent"
                    leftIcon={Play}
                    size="lg"
                  >
                    Start Your First Adventure
                  </Button>
                  <Button
                    onClick={() => navigate(`/rules/`)}
                    variant="secondary"
                    size="lg"
                  >
                    Try Simple D6 Rules
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as="link"
                    href="/adventures"
                    variant="accent"
                    leftIcon={Play}
                    size="lg"
                  >
                    Start Your First Adventure
                  </Button>
                  <Button as="link" href="/rules" variant="secondary" size="lg">
                    Try Simple D6 Rules
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right side - Character showcase */}
          {/* Right side - Character showcase */}
          <div className="relative h-96 lg:h-[500px]">
            {/* Horror character - top left */}
            <div className="absolute top-0 left-0 w-32 h-44 lg:w-40 lg:h-56 rounded-lg overflow-hidden shadow-xl border-2 border-border/20 transform rotate-12 hover:rotate-6 hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <img
                src="https://imagedelivery.net/eg6Xqa-jIrYvZBm8oCXnhg/7474a62d-874f-45fe-191c-a9f07dc40100/XLPortrait"
                alt="Horror Adventure"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Sci-fi scene - center */}
            <div className="absolute top-12 right-8 w-36 h-48 lg:w-44 lg:h-60 rounded-lg overflow-hidden shadow-xl border-2 border-border/20 transform -rotate-6 hover:rotate-0 hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <img
                src="https://imagedelivery.net/eg6Xqa-jIrYvZBm8oCXnhg/ddac5605-015e-4dc3-d294-e4921fcfa300/XLPortrait"
                alt="Sci-Fi Adventure"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Cyberpunk character - bottom */}
            <div className="absolute bottom-0 left-12 w-28 h-40 lg:w-36 lg:h-48 rounded-lg overflow-hidden shadow-xl border-2 border-border/20 transform rotate-6 hover:rotate-12 hover:shadow-2xl hover:scale-105 transition-all duration-500">
              <img
                src="https://imagedelivery.net/eg6Xqa-jIrYvZBm8oCXnhg/8ff8e4d8-15e1-4f60-8bde-c24a0e827200/XLPortrait"
                alt="Cyberpunk Adventure"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </Hero>
      {/* Cyberpunk Theme Section */}
      <CyberpunkSection />
      <CosmicHorrorSection />
      <FantasySection />

      {/* Features Section */}
      <Section background="accent" size="lg">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Tools I Think You'll Love
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card variant="feature" className="text-center group">
            <CardIcon icon={BookOpen} variant="gradient" />
            <CardHeader>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Ready-to-Run Adventures
              </h3>
            </CardHeader>
            <CardContent>
              A wide range of adventures based on games I've run over the past
              ~25 years. Grab one of these and start playing in minutes. From
              Science fiction action on alien worlds, to mystery detective
              stories in dark fantasy cities.
              {isAuthenticated
                ? " Your full collection is waiting."
                : " Take a look and see what speaks to you."}
            </CardContent>
          </Card>

          <Card variant="feature" className="text-center group">
            <CardIcon icon={Package} variant="gradient" />
            <CardHeader>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Asset Library
              </h3>
            </CardHeader>
            <CardContent>
              Build your personal collection of characters, creatures,
              locations, and items. Organize them however makes sense for your
              world and your style.
              {isAuthenticated
                ? " Create as many as you want."
                : " Start building your world."}
            </CardContent>
          </Card>

          <Card variant="feature" className="text-center group">
            <CardIcon icon={Users} variant="gradient" />
            <CardHeader>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Campaign Tools
              </h3>
            </CardHeader>
            <CardContent>
              Connect your adventures into ongoing stories. Keep track of what
              matters to your group, organize your sessions the way that works
              for you. No rigid structure - just tools that adapt to how you
              actually run games.
              {isAuthenticated
                ? " Manage all your campaigns in one place."
                : " See how it fits your style."}
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Genre Variety Section */}
      <Section
        background="card"
        align="center"
        className="border-y border-border"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Every Genre, Every Style
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          25 years of GMing means adventures for every group and every mood.
          From quick one-shots to epic campaigns.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Badge variant="fantasy" size="lg" className="justify-center">
            Fantasy
          </Badge>
          <Badge variant="horror" size="lg" className="justify-center">
            Horror
          </Badge>
          <Badge variant="scifi" size="lg" className="justify-center">
            Science Fiction
          </Badge>
          <Badge variant="historical" size="lg" className="justify-center">
            Historical
          </Badge>
          <Badge variant="modern" size="lg" className="justify-center">
            Modern World
          </Badge>
          <Badge variant="mystery" size="lg" className="justify-center">
            Mystery
          </Badge>
        </div>
      </Section>

      {/* Community Section */}
      <Section background="accent" align="center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Made by the Community, for the Community
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Built by someone who's been running games for decades and knows what
          actually works at the table. Every feature solves real problems that
          come up during play, not theoretical ones.
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
            : "Join the community and get access to everything you need to become a confident GM."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            href="/adventures"
            variant="secondary"
            size="lg"
            onClick={() => navigate(`/assets/`)}
          >
            Go to Assets
          </Button>
          <Button
            href="/adventures"
            variant="secondary"
            size="lg"
            onClick={() => navigate(`/adventures/`)}
          >
            Browse Adventures
          </Button>
        </div>
      </Section>
    </div>
  );
}
