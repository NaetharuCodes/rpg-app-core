import type { Meta, StoryObj } from '@storybook/react';
import { Section } from './Section';

const meta: Meta<typeof Section> = {
  title: 'Layout/Section',
  component: Section,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A flexible section wrapper component with consistent spacing, sizing, and background options. Perfect for organizing page content with proper containers and spacing.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Maximum width of the section content',
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Vertical padding of the section',
    },
    background: {
      control: 'select',
      options: ['none', 'card', 'muted', 'gradient', 'accent'],
      description: 'Background style of the section',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment within the section',
    },
    container: {
      control: 'boolean',
      description: 'Whether to apply container styling (mx-auto px-4 md:px-6)',
    },
  },
  args: {
    children: (
      <>
        <h2 className="text-3xl font-bold mb-4">Section Title</h2>
        <p className="text-lg text-muted-foreground">
          This is sample content for the section component. It demonstrates how the section 
          wrapper handles content with proper spacing and alignment.
        </p>
      </>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Section>;

// Basic variants
export const Default: Story = {
  args: {
    size: 'md',
    spacing: 'md',
    background: 'none',
    align: 'left',
  },
};

export const Centered: Story = {
  args: {
    align: 'center',
    children: (
      <>
        <h2 className="text-3xl font-bold mb-4">Centered Section</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          This section demonstrates center alignment, perfect for hero sections, 
          feature introductions, or any content that benefits from centered layout.
        </p>
      </>
    ),
  },
};

// Size variants
export const SmallSize: Story = {
  args: {
    size: 'sm',
    align: 'center',
    children: (
      <>
        <h2 className="text-2xl font-bold mb-4">Small Width Section</h2>
        <p className="text-muted-foreground">
          This section uses the small size variant (max-w-2xl), perfect for 
          focused content like blog posts or detailed explanations.
        </p>
      </>
    ),
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        <h2 className="text-3xl font-bold mb-6">Large Width Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold mb-2">Feature 1</h3>
            <p className="text-sm text-muted-foreground">Description of feature one</p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold mb-2">Feature 2</h3>
            <p className="text-sm text-muted-foreground">Description of feature two</p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold mb-2">Feature 3</h3>
            <p className="text-sm text-muted-foreground">Description of feature three</p>
          </div>
        </div>
      </>
    ),
  },
};

// Background variants
export const CardBackground: Story = {
  args: {
    background: 'card',
    align: 'center',
    children: (
      <>
        <h2 className="text-3xl font-bold mb-4">Card Background</h2>
        <p className="text-lg text-muted-foreground">
          This section uses a card background, great for distinguishing content areas.
        </p>
      </>
    ),
  },
};

export const MutedBackground: Story = {
  args: {
    background: 'muted',
    align: 'center',
    children: (
      <>
        <h2 className="text-3xl font-bold mb-4">Muted Background</h2>
        <p className="text-lg text-muted-foreground">
          This section uses a subtle muted background, perfect for alternating sections.
        </p>
      </>
    ),
  },
};

export const GradientBackground: Story = {
  args: {
    background: 'gradient',
    align: 'center',
    children: (
      <>
        <h2 className="text-3xl font-bold mb-4">Gradient Background</h2>
        <p className="text-lg text-muted-foreground">
          This section uses a gradient background from card to background.
        </p>
      </>
    ),
  },
};

export const AccentBackground: Story = {
  args: {
    background: 'accent',
    align: 'center',
    children: (
      <>
        <h2 className="text-3xl font-bold mb-4">Accent Background</h2>
        <p className="text-lg text-muted-foreground">
          This section uses a subtle accent gradient background.
        </p>
      </>
    ),
  },
};

// Spacing variants
export const SmallSpacing: Story = {
  args: {
    spacing: 'sm',
    background: 'muted',
    align: 'center',
    children: (
      <>
        <h3 className="text-xl font-bold mb-2">Small Spacing</h3>
        <p className="text-muted-foreground">Compact section with minimal padding.</p>
      </>
    ),
  },
};

export const LargeSpacing: Story = {
  args: {
    spacing: 'lg',
    background: 'gradient',
    align: 'center',
    children: (
      <>
        <h2 className="text-4xl font-bold mb-6">Large Spacing</h2>
        <p className="text-xl text-muted-foreground">
          Spacious section with generous padding, perfect for important content.
        </p>
      </>
    ),
  },
};

// No container
export const NoContainer: Story = {
  args: {
    container: false,
    background: 'card',
    spacing: 'md',
    children: (
      <div className="px-4">
        <h2 className="text-3xl font-bold mb-4">No Container</h2>
        <p className="text-lg text-muted-foreground">
          This section has container=false, so you can apply your own container styling.
        </p>
      </div>
    ),
  },
};

// Multiple sections (like HomePage)
export const MultipleSections: Story = {
  render: () => (
    <div>
      <Section background="gradient" align="center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Hero Section</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          This demonstrates how multiple sections work together to create a complete page layout.
        </p>
      </Section>
      
      <Section background="none" size="lg">
        <h2 className="text-3xl font-bold text-center mb-12">Features Section</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">Feature 1</h3>
            <p className="text-muted-foreground">Description of the first feature</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">Feature 2</h3>
            <p className="text-muted-foreground">Description of the second feature</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">Feature 3</h3>
            <p className="text-muted-foreground">Description of the third feature</p>
          </div>
        </div>
      </Section>
      
      <Section background="muted" align="center">
        <h2 className="text-3xl font-bold mb-6">Call to Action</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Ready to get started? Join thousands of satisfied users.
        </p>
        <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          Get Started
        </button>
      </Section>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of how multiple sections work together to create a complete page layout, similar to your HomePage structure.',
      },
    },
  },
};