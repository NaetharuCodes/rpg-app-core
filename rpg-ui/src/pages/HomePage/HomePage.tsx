import { Play, BookOpen, Users, Package, Dice6 } from "lucide-react";
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

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      {/* Hero Section */}
      <Hero>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Making RPGs Easier to Run
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Jump into ready-to-run adventures or build your own. Simple D6 gets
          you playing in minutes, or bring your favorite system for deeper
          mechanics. Built by GMs, for the way you actually play.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Button onClick={() => navigate(`/adventures/`)} variant="accent">
                Browse Adventures
              </Button>
              <Button onClick={() => navigate(`/rules/`)} variant="accent">
                Simple D6 Rules
              </Button>
            </>
          ) : (
            <>
              <Button
                as="link"
                href="/adventures"
                variant="accent"
                leftIcon={Play}
              >
                Explore Adventures
              </Button>
              <Button as="link" href="/login" variant="secondary">
                Get Started
              </Button>
            </>
          )}
        </div>
      </Hero>
      {/* Cyberpunk Theme Section */}
      <CyberpunkSection />

      {/* Why I Built This Section */}
      <Section align="center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          Adventures in a Dark Dystopian Future
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Venture out into the night. Fight against the power of corporations.
          Find a way to break free from the cycle of control and manipulation.
          Discover the dark secrets and true powers that make the world turn.
        </p>
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg p-8">
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            Create Adventures and Campaigns in a Dystopian Future.
          </h3>
          <p className="text-lg text-muted-foreground">
            Inspired by classic distopian fiction from Brave New World to
            Neuromancer, 1984 to Childhood's End. Create your own stories in a
            gritty world of cheap chrome and neon-stars.
          </p>
        </div>
      </Section>

      <CosmicHorrorSection />

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
