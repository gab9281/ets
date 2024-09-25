// Importez le type UserType s'il n'est pas déjà importé
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentWaitPage from '../../../components/StudentWaitPage/StudentWaitPage';

describe('StudentWaitPage Component', () => {
    const mockUsers = [
        { id: '1', name: 'User1' },
        { id: '2', name: 'User2' },
        { id: '3', name: 'User3' },
      ];

      const mockProps = {
        users: mockUsers,
        launchQuiz: jest.fn(),
        roomName: 'Test Room',
        setQuizMode: jest.fn(),
      };

    test('renders StudentWaitPage with correct content', () => {
        render(<StudentWaitPage {...mockProps} />);

        //expect(screen.getByText(/Test Room/)).toBeInTheDocument();

        const launchButton = screen.getByRole('button', { name: /Lancer/i });
        expect(launchButton).toBeInTheDocument();

        mockUsers.forEach((user) => {
          expect(screen.getByText(user.name)).toBeInTheDocument();
        });
      });

      test('clicking on "Lancer" button opens LaunchQuizDialog', () => {
        render(<StudentWaitPage {...mockProps} />);

        fireEvent.click(screen.getByRole('button', { name: /Lancer/i }));

        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

})
