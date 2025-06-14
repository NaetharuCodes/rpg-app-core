import type { Meta, StoryObj } from '@storybook/react';
import { BookOpen, Users, Package, Play, Settings, Map, Heart, Star } from 'lucide-react';
import { Card, CardHeader, CardContent, CardIcon } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible card component system with header, content, and icon subcomponents. Perfect for feature cards, content cards, and more.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'ghost', 'feature'],
      description: 'Visual style variant of the card',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Internal padding of the card',
    },
    hover: {
      control: 'select',
      options: ['none', 'lift', 'scale'],
      description: 'Hover effect for the card',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// Basic variants
export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold">Default Card</h3>
        </CardHeader>
        <CardContent>
          This is a basic card with border and background.
        </CardContent>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold">Elevated Card</h3>
        </CardHeader>
        <CardContent>
          This card has a subtle shadow for elevation.
        </CardContent>
      </>
    ),
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold">Ghost Card</h3>
        </CardHeader>
        <CardContent>
          This card has a transparent background.
        </CardContent>
      </>
    ),
  },
};

export const Feature: Story = {
  args: {
    variant: 'feature',
    className: 'text-center group',
    children: (
      <>
        <CardIcon icon={BookOpen} variant="gradient" />
        <CardHeader>
          <h3 className="text-xl font-semibold">Feature Card</h3>
        </CardHeader>
        <CardContent>
          This is a feature card with an icon, perfect for showcasing key features.
        </CardContent>
      </>
    ),
  },
};

// With different padding
export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold">Small Padding</h3>
        </CardHeader>
        <CardContent>
          This card uses small padding.
        </CardContent>
      </>
    ),
  },
};

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold">Large Padding</h3>
        </CardHeader>
        <CardContent>
          This card uses large padding for a more spacious feel.
        </CardContent>
      </>
    ),
  },
};

// With hover effects
export const HoverLift: Story = {
  args: {
    variant: 'elevated',
    hover: 'lift',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold">Hover to Lift</h3>
        </CardHeader>
        <CardContent>
          This card lifts up when you hover over it.
        </CardContent>
      </>
    ),
  },
};

export const HoverScale: Story = {
  args: {
    variant: 'default',
    hover: 'scale',
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold">Hover to Scale</h3>
        </CardHeader>
        <CardContent>
          This card scales slightly when you hover over it.
        </CardContent>
      </>
    ),
  }
};

// Icon variants
export const IconVariants: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card variant="feature" className="text-center group">
        <CardIcon icon={Settings} variant="default" />
        <CardHeader>
          <h3 className="text-lg font-semibold">Default Icon</h3>
        </CardHeader>
        <CardContent>
          Card with default icon styling.
        </CardContent>
      </Card>
      
      <Card variant="feature" className="text-center group">
        <CardIcon icon={Heart} variant="gradient" />
        <CardHeader>
          <h3 className="text-lg font-semibold">Gradient Icon</h3>
        </CardHeader>
        <CardContent>
          Card with gradient icon background.
        </CardContent>
      </Card>
      
      <Card variant="feature" className="text-center group">
        <CardIcon icon={Star} variant="solid" />
        <CardHeader>
          <h3 className="text-lg font-semibold">Solid Icon</h3>
        </CardHeader>
        <CardContent>
          Card with solid icon background.
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different icon variants: default (muted), gradient (accent gradient), and solid (accent).',
      },
    },
  },
};

// RPG Feature Cards (like HomePage)
export const RPGFeatureCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card variant="feature" className="text-center group">
        <CardIcon icon={BookOpen} variant="gradient" />
        <CardHeader>
          <h3 className="text-xl font-semibold text-foreground mb-3">Ready-to-Run Adventures</h3>
        </CardHeader>
        <CardContent>
          Well-tested adventures that actually work at the table. Fantasy, horror, sci-fi, 
          historical, and modern settings that you can start running tonight.
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
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Recreation of the feature cards from the HomePage, showing how to use the Card components for marketing/feature content.',
      },
    },
  },
};

// Content cards
export const ContentCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card variant="elevated" hover="lift">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Play className="h-5 w-5 text-accent" />
            <span className="text-sm text-muted-foreground">Adventure</span>
          </div>
          <h3 className="text-lg font-semibold">The Dragon's Lair</h3>
        </CardHeader>
        <CardContent>
          A classic dungeon crawl adventure for 3-5 players. Explore ancient ruins, 
          battle fearsome creatures, and claim legendary treasure.
        </CardContent>
      </Card>
      
      <Card variant="elevated" hover="lift">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Map className="h-5 w-5 text-accent" />
            <span className="text-sm text-muted-foreground">Campaign</span>
          </div>
          <h3 className="text-lg font-semibold">Kingdoms of Valeria</h3>
        </CardHeader>
        <CardContent>
          An epic campaign spanning multiple kingdoms. Political intrigue, 
          ancient magic, and the fate of nations hang in the balance.
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of content cards that might be used throughout the app to display adventures, campaigns, etc.',
      },
    },
  },
};

// Simple layout examples
export const LayoutExamples: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Minimal card */}
      <Card variant="ghost" padding="sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <Settings className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <h4 className="font-medium">Quick Setting</h4>
            <p className="text-sm text-muted-foreground">Minimal card layout</p>
          </div>
        </div>
      </Card>

      {/* Stats card */}
      <Card variant="default" className="text-center">
        <CardHeader>
          <h3 className="text-2xl font-bold text-primary">42</h3>
          <p className="text-sm text-muted-foreground">Active Adventures</p>
        </CardHeader>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various layout patterns using the Card components for different content types.',
      },
    },
  },
};