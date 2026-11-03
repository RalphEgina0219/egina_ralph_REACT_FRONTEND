import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the create post form', () => {
  render(<App />);
  expect(screen.getByText(/create post/i)).toBeInTheDocument();
});
