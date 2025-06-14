import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import { AppShell } from './AppShell';

test('AppShell renders navigation', () => {
  render(
    <BrowserRouter>
      <AppShell>
        <div>Test content</div>
      </AppShell>
    </BrowserRouter>
  );
  
  expect(screen.getAllByText('RPG Manager')).toHaveLength(2); // Both desktop and mobile
  expect(screen.getByText('Home')).toBeDefined();
  expect(screen.getByText('Test content')).toBeDefined();
});