import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../../../pages/Teacher/Dashboard/Dashboard';
import { act } from 'react';

// const localStorageMock = (() => {
//   let store: Record<string, string> = {};
//   return {
//     getItem: (key: string) => store[key] || null,
//     setItem: (key: string, value: string) => (store[key] = value.toString()),
//     clear: () => (store = {}),
//   };
// })();
// Object.defineProperty(window, 'localStorage', { value: localStorageMock });

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// NOTE: these tests are for an old version that kept quizzes in local storage and had no login

describe.skip('Dashboard Component', () => {
  // beforeEach(() => {
  //   localStorage.setItem('quizzes', JSON.stringify([]));
  // });

  test('renders Dashboard with default state', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Tableau de bord/i)).toBeInTheDocument();
  });

  test.skip('adds a quiz and checks if it is displayed', () => {
    const mockQuizzes = [
      {
        id: '1',
        title: 'Sample Quiz',
        questions: ['Question 1?', 'Question 2?'],
      },
    ];
    localStorage.setItem('quizzes', JSON.stringify(mockQuizzes));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Sample Quiz/i)).toBeInTheDocument();
  });

  test.skip('opens ImportModal when "Importer" button is clicked', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    act(() => {
      fireEvent.click(screen.getByText(/Importer/i));
    });

    expect(screen.getByText(/Importation de quiz/i)).toBeInTheDocument();
  });

});
