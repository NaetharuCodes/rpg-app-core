import type { Meta, StoryObj } from '@storybook/react';
import { Sword, Zap, Skull, Search, Clock, Building, Leaf, Droplets, Heart, Sun } from 'lucide-react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible badge component with genre-specific colors, multiple styles, and icon support. Perfect for categorizing RPG content by genre, difficulty, or other attributes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'fantasy', 'scifi', 'horror', 'mystery', 'historical', 'modern', 'green', 'cyan', 'pink', 'yellow'],
      description: 'Color variant of the badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the badge',
    },
    styleVariant: {
      control: 'select',
      options: ['subtle', 'solid', 'outline'],
      description: 'Style variant of the badge',
    },
    icon: {
      control: false,
      description: 'Optional Lucide icon to display',
    },
    children: {
      control: 'text',
      description: 'Badge content/label',
    },
  },
  args: {
    children: 'Badge',
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// Basic variants
export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Default',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

// Genre variants
export const Fantasy: Story = {
  args: {
    variant: 'fantasy',
    children: 'Fantasy',
  },
};

export const SciFi: Story = {
  args: {
    variant: 'scifi',
    children: 'Science Fiction',
  },
};

export const Horror: Story = {
  args: {
    variant: 'horror',
    children: 'Horror',
  },
};

export const Mystery: Story = {
  args: {
    variant: 'mystery',
    children: 'Mystery',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    variant: 'fantasy',
    children: 'Small Badge',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    variant: 'fantasy',
    children: 'Medium Badge',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    variant: 'fantasy',
    children: 'Large Badge',
  },
};

// With icons
export const WithIcon: Story = {
  args: {
    variant: 'fantasy',
    icon: Sword,
    children: 'Fantasy Adventure',
  },
};

export const SciFiWithIcon: Story = {
  args: {
    variant: 'scifi',
    icon: Zap,
    children: 'Cyberpunk',
  },
};

export const HorrorWithIcon: Story = {
  args: {
    variant: 'horror',
    icon: Skull,
    children: 'Zombie Apocalypse',
  },
};

// Style variants
export const SubtleStyle: Story = {
  args: {
    variant: 'fantasy',
    styleVariant: 'subtle',
    children: 'Subtle Style',
  },
};

export const SolidStyle: Story = {
  args: {
    variant: 'fantasy',
    styleVariant: 'solid',
    children: 'Solid Style',
  },
};

export const OutlineStyle: Story = {
  args: {
    variant: 'fantasy',
    styleVariant: 'outline',
    children: 'Outline Style',
  },
};

// Genre showcase (like HomePage)
export const GenreShowcase: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <Badge variant="fantasy">Fantasy</Badge>
      <Badge variant="horror">Horror</Badge>
      <Badge variant="scifi">Science Fiction</Badge>
      <Badge variant="historical">Historical</Badge>
      <Badge variant="modern">Modern World</Badge>
      <Badge variant="mystery">Mystery</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Genre badges as they might appear on the HomePage or content cards.',
      },
    },
  },
};

// All colors
export const AllColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="fantasy">Fantasy</Badge>
      <Badge variant="scifi">Sci-Fi</Badge>
      <Badge variant="horror">Horror</Badge>
      <Badge variant="mystery">Mystery</Badge>
      <Badge variant="historical">Historical</Badge>
      <Badge variant="modern">Modern</Badge>
      <Badge variant="green">Green</Badge>
      <Badge variant="cyan">Cyan</Badge>
      <Badge variant="pink">Pink</Badge>
      <Badge variant="yellow">Yellow</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available color variants in the Badge component.',
      },
    },
  },
};

// Style comparison
export const StyleComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <span className="w-16 text-sm text-muted-foreground">Subtle:</span>
        <Badge variant="fantasy" styleVariant="subtle">Fantasy</Badge>
        <Badge variant="scifi" styleVariant="subtle">Sci-Fi</Badge>
        <Badge variant="horror" styleVariant="subtle">Horror</Badge>
      </div>
      <div className="flex gap-4 items-center">
        <span className="w-16 text-sm text-muted-foreground">Solid:</span>
        <Badge variant="fantasy" styleVariant="solid">Fantasy</Badge>
        <Badge variant="scifi" styleVariant="solid">Sci-Fi</Badge>
        <Badge variant="horror" styleVariant="solid">Horror</Badge>
      </div>
      <div className="flex gap-4 items-center">
        <span className="w-16 text-sm text-muted-foreground">Outline:</span>
        <Badge variant="fantasy" styleVariant="outline">Fantasy</Badge>
        <Badge variant="scifi" styleVariant="outline">Sci-Fi</Badge>
        <Badge variant="horror" styleVariant="outline">Horror</Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of the three style variants: subtle (default), solid, and outline.',
      },
    },
  },
};

// Size comparison
export const SizeComparison: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Badge variant="fantasy" size="sm">Small</Badge>
      <Badge variant="fantasy" size="md">Medium</Badge>
      <Badge variant="fantasy" size="lg">Large</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available sizes.',
      },
    },
  },
};

// RPG content examples
export const RPGContentExamples: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Adventure badges */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-muted-foreground">Adventure Tags</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="fantasy" icon={Sword}>Epic Fantasy</Badge>
          <Badge variant="scifi" icon={Zap}>Space Opera</Badge>
          <Badge variant="horror" icon={Skull}>Survival Horror</Badge>
          <Badge variant="mystery" icon={Search}>Detective Story</Badge>
        </div>
      </div>

      {/* Difficulty/Level badges */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-muted-foreground">Difficulty Levels</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="green" styleVariant="solid" size="sm">Beginner</Badge>
          <Badge variant="yellow" styleVariant="solid" size="sm">Intermediate</Badge>
          <Badge variant="destructive" styleVariant="solid" size="sm">Advanced</Badge>
        </div>
      </div>

      {/* Content type badges */}
      <div>
        <h4 className="text-sm font-medium mb-2 text-muted-foreground">Content Types</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="cyan" styleVariant="outline" icon={Clock}>One-Shot</Badge>
          <Badge variant="green" styleVariant="outline" icon={Building}>Campaign</Badge>
          <Badge variant="pink" styleVariant="outline" icon={Heart}>Romance</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of how badges might be used throughout the RPG application for categorizing different types of content.',
      },
    },
  },
};