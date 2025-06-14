import type { Meta, StoryObj } from '@storybook/react';
import { Play, BookOpen, ArrowRight } from 'lucide-react';
import { Hero } from './Hero';
import { Button } from '../Button/Button';

const meta: Meta<typeof Hero> = {
  title: 'Layout/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A flexible hero section component with various background styles, sizes, and alignment options. Perfect for landing pages, feature introductions, and call-to-action sections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'solid', 'muted', 'accent'],
      description: 'Background style variant of the hero',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Vertical size/padding of the hero',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment within the hero',
    },
    container: {
      control: 'boolean',
      description: 'Whether to apply container styling',
    },
    bordered: {
      control: 'boolean',
      description: 'Whether to add bottom border',
    },
  },
  args: {
    children: (
      <>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Hero Section Title
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          This is a sample hero section that demonstrates the component's flexibility 
          and styling options.
        </p>
      </>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

// Basic variants
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md',
    align: 'center',
  },
};

export const Solid: Story = {
  args: {
    variant: 'solid',
    children: (
      <>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Solid Background Hero
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          This hero uses a solid card background instead of a gradient.
        </p>
      </>
    ),
  },
};

export const Muted: Story = {
  args: {
    variant: 'muted',
    children: (
      <>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Muted Background Hero
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          This hero uses a muted background for a subtle appearance.
        </p>
      </>
    ),
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
    children: (
      <>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Accent Background Hero
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          This hero uses an accent gradient background for emphasis.
        </p>
      </>
    ),
  },
};

// Size variants
export const Small: Story = {
  args: {
    size: 'sm',
    children: (
      <>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Small Hero Section
        </h1>
        <p className="text-lg text-muted-foreground">
          A more compact hero section with reduced padding.
        </p>
      </>
    ),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        <h1 className="text-5xl md:text-7xl font-bold mb-8">
          Large Hero Section
        </h1>
        <p className="text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto">
          A spacious hero section with generous padding, perfect for making a big impact.
        </p>
      </>
    ),
  },
};

// Alignment variants
export const LeftAligned: Story = {
  args: {
    align: 'left',
    children: (
      <>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Left Aligned Hero
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
          This hero section is left-aligned, which works well for more traditional layouts 
          or when you want to break away from the typical centered hero pattern.
        </p>
      </>
    ),
  },
};

// With CTA buttons (like HomePage)
export const WithCTAButtons: Story = {
  args: {
    children: (
      <>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Making it easier than ever to get into tabletop gaming
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Solve the GM shortage with ready-to-run adventures and robust tools. 
          Built by the community, for the community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="accent" leftIcon={Play}>
            Explore Adventures
          </Button>
          <Button variant="secondary">
            Get Started
          </Button>
        </div>
      </>
    ),
  },
};

// Product feature hero
export const ProductFeature: Story = {
  args: {
    variant: 'accent',
    size: 'lg',
    children: (
      <>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Ready-to-Run Adventures
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">
          Jump into well-crafted adventures that actually work at the table. 
          25 years of real-world gaming experience, designed for any system you prefer.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" leftIcon={BookOpen} size="lg">
            Browse Library
          </Button>
          <Button variant="secondary" rightIcon={ArrowRight} size="lg">
            Learn More
          </Button>
        </div>
      </>
    ),
  },
};

// Minimal hero
export const Minimal: Story = {
  args: {
    variant: 'solid',
    size: 'sm',
    bordered: false,
    children: (
      <>
        <h1 className="text-3xl font-bold mb-4">
          Simple & Clean
        </h1>
        <p className="text-muted-foreground">
          A minimal hero section without border, perfect for internal pages.
        </p>
      </>
    ),
  },
};

// No container (custom layout)
export const NoContainer: Story = {
  args: {
    container: false,
    variant: 'gradient',
    children: (
      <div className="max-w-4xl mx-auto px-4 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Custom Layout Hero
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              This hero doesn't use the default container, allowing for custom layouts 
              like this two-column design.
            </p>
            <Button variant="accent" leftIcon={Play}>
              Get Started
            </Button>
          </div>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Image/Content Area</span>
          </div>
        </div>
      </div>
    ),
  },
};

// Homepage recreation
export const HomepageRecreation: Story = {
  args: {
    variant: 'default',
    size: 'md',
    children: (
      <>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Making it easier than ever to get into tabletop gaming
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Solve the GM shortage with ready-to-run adventures and robust tools. 
          Built by the community, for the community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="accent" leftIcon={Play}>
            Explore Adventures
          </Button>
          <Button variant="secondary">
            Get Started
          </Button>
        </div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Recreation of the hero section from your HomePage, showing how the Hero component would replace the existing hardcoded section.',
      },
    },
  },
};