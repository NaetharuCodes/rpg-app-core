import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { Play, BookOpen, Download, ArrowRight, User, Settings } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component that supports multiple variants, sizes, icons, and can render as both button and link elements.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'ghost', 'destructive'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the button',
    },
    as: {
      control: 'select',
      options: ['button', 'link'],
      description: 'Render as button element or anchor link',
    },
    leftIcon: {
      control: false,
      description: 'Lucide icon to display on the left side',
    },
    rightIcon: {
      control: false,
      description: 'Lucide icon to display on the right side',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables interaction',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    children: {
      control: 'text',
      description: 'Button content/label',
    },
  },
  args: { 
    onClick: fn(),
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Basic variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
    children: 'Accent Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Item',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra Large Button',
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    variant: 'accent',
    leftIcon: Play,
    children: 'Start Adventure',
  },
};

export const WithRightIcon: Story = {
  args: {
    variant: 'secondary',
    rightIcon: ArrowRight,
    children: 'Continue',
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: 'primary',
    leftIcon: Download,
    rightIcon: ArrowRight,
    children: 'Download & Continue',
  },
};

// States
export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Saving...',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
};

// As link
export const AsLink: Story = {
  args: {
    as: 'link',
    href: '/adventures',
    variant: 'accent',
    leftIcon: BookOpen,
    children: 'Browse Adventures',
  },
};

// RPG-specific examples
export const RPGExamples: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button variant="accent" leftIcon={Play}>
        Start Game
      </Button>
      <Button variant="secondary" leftIcon={BookOpen}>
        View Rules
      </Button>
      <Button variant="primary" leftIcon={User}>
        Create Character
      </Button>
      <Button variant="ghost" leftIcon={Settings} size="sm">
        Settings
      </Button>
      <Button as="link" href="#" variant="accent" rightIcon={ArrowRight}>
        Join Campaign
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Examples of how the Button component might be used throughout the RPG application.',
      },
    },
  },
};

// Size comparison
export const SizeComparison: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button size="sm" variant="accent">Small</Button>
      <Button size="md" variant="accent">Medium</Button>
      <Button size="lg" variant="accent">Large</Button>
      <Button size="xl" variant="accent">Extra Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available button sizes.',
      },
    },
  },
};

// Variant comparison
export const VariantComparison: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available button variants.',
      },
    },
  },
};