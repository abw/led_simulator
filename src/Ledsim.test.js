import React from 'react';
import { render } from '@testing-library/react';
import Ledsim from './Ledsim';

test('renders header link', () => {
  const { getByText } = render(<Ledsim />);
  const headElement = getByText(/by Andy Wardley/i);
  expect(headElement).toBeInTheDocument();
});
