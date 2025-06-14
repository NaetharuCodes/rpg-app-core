import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { AppShell } from './AppShell';

const meta: Meta<typeof AppShell> = {
  title: 'Layout/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main application shell with responsive sidebar navigation and top bar.',
      },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div style={{ height: '100vh' }}>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
  argTypes: {
    children: {
      control: false,
      description: 'The main content to render inside the shell',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

// Sample content components for the stories
const SampleHomePage = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-4">Welcome to RPG Manager</h1>
    <p className="text-lg text-muted-foreground mb-6">
      Your ultimate tool for managing RPG adventures, characters, and campaigns.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="p-6 border border-border rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Quick Stats</h3>
        <p className="text-muted-foreground">3 Active Campaigns</p>
        <p className="text-muted-foreground">12 Characters Created</p>
        <p className="text-muted-foreground">25 Assets Library</p>
      </div>
      <div className="p-6 border border-border rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Recent Activity</h3>
        <p className="text-muted-foreground">Updated "Dragon's Quest"</p>
        <p className="text-muted-foreground">Created new character</p>
        <p className="text-muted-foreground">Added magic sword item</p>
      </div>
      <div className="p-6 border border-border rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Featured Content</h3>
        <p className="text-muted-foreground">Check out the new Simple D6 rules</p>
        <p className="text-muted-foreground">Explore sample adventures</p>
      </div>
    </div>
  </div>
);

const SampleAssetsPage = () => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Assets Library</h1>
      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
        Create Asset
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="p-4 border border-border rounded-lg text-center">
        <h3 className="font-semibold">Characters</h3>
        <p className="text-2xl font-bold text-primary">8</p>
      </div>
      <div className="p-4 border border-border rounded-lg text-center">
        <h3 className="font-semibold">Creatures</h3>
        <p className="text-2xl font-bold text-primary">12</p>
      </div>
      <div className="p-4 border border-border rounded-lg text-center">
        <h3 className="font-semibold">Items</h3>
        <p className="text-2xl font-bold text-primary">15</p>
      </div>
      <div className="p-4 border border-border rounded-lg text-center">
        <h3 className="font-semibold">Locations</h3>
        <p className="text-2xl font-bold text-primary">6</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="p-4 border border-border rounded-lg">
          <div className="w-full h-32 bg-muted rounded mb-3"></div>
          <h3 className="font-semibold">Sample Asset {i}</h3>
          <p className="text-sm text-muted-foreground">Character • Level 5 Warrior</p>
        </div>
      ))}
    </div>
  </div>
);

export const Default: Story = {
  args: {
    children: <SampleHomePage />,
  },
};

export const AssetsPage: Story = {
  args: {
    children: <SampleAssetsPage />,
  },
};

export const EmptyContent: Story = {
  args: {
    children: (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Empty State</h2>
          <p className="text-muted-foreground">This shows how the shell looks with minimal content.</p>
        </div>
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    children: (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Long Scrolling Content</h1>
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} className="mb-4 p-4 border border-border rounded-lg">
            <h3 className="text-lg font-semibold">Content Block {i + 1}</h3>
            <p className="text-muted-foreground">
              This is a sample content block to test scrolling behavior within the app shell. 
              The sidebar should remain fixed while this content scrolls.
            </p>
          </div>
        ))}
      </div>
    ),
  },
};