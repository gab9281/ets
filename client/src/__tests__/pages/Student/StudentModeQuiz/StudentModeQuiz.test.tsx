import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { parse } from 'gift-pegjs';
import { MemoryRouter } from 'react-router-dom';
import { QuestionType } from '../../../../Types/QuestionType';
import StudentModeQuiz from '../../../../components/StudentModeQuiz/StudentModeQuiz';

const mockGiftQuestions = parse(
    `::Sample Question 1:: Sample Question 1 {=Option A ~Option B}
    
    ::Sample Question 2:: Sample Question 2 {T}`);

const mockQuestions: QuestionType[] = mockGiftQuestions.map((question, index) => {
    question.id = (index + 1).toString();
    const newMockQuestion: QuestionType = {
        question: question,
    };
    return newMockQuestion;
});

const mockSubmitAnswer = jest.fn();
const mockDisconnectWebSocket = jest.fn();

beforeEach(() => {
    render(
        <MemoryRouter>
            <StudentModeQuiz
                questions={mockQuestions}
                submitAnswer={mockSubmitAnswer}
                disconnectWebSocket={mockDisconnectWebSocket}
            />
        </MemoryRouter>);
});

describe('StudentModeQuiz', () => {
    test('renders the initial question', async () => {
        expect(screen.getByText('Sample Question 1')).toBeInTheDocument();
        expect(screen.getByText('Option A')).toBeInTheDocument();
        expect(screen.getByText('Option B')).toBeInTheDocument();
        expect(screen.getByText('Quitter')).toBeInTheDocument();
    });

    test('handles answer submission text', async () => {
        act(() => {
            fireEvent.click(screen.getByText('Option A'));
        });
        act(() => {
            fireEvent.click(screen.getByText('Répondre'));
        });

        expect(mockSubmitAnswer).toHaveBeenCalledWith('Option A', '1');
    });

    test('handles quit button click', async () => {
        act(() => {
            fireEvent.click(screen.getByText('Quitter'));
        });

        expect(mockDisconnectWebSocket).toHaveBeenCalled();
    });

    test('navigates to the next question', async () => {
        act(() => {
            fireEvent.click(screen.getByText('Option A'));
        });
        act(() => {
            fireEvent.click(screen.getByText('Répondre'));
        });        
        act(() => {
            fireEvent.click(screen.getByText('Question suivante'));
        });

        const sampleQuestionElements = screen.queryAllByText(/Sample question 2/i);
        expect(sampleQuestionElements.length).toBeGreaterThan(0);
        expect(screen.getByText('V')).toBeInTheDocument();

    });

    test('navigates to the previous question', async () => {

        act(() => {
            fireEvent.click(screen.getByText('Option A'));
        });
        act(() => {
            fireEvent.click(screen.getByText('Répondre'));
        });        
        act(() => {
            fireEvent.click(screen.getByText('Question précédente'));
        });

        expect(screen.getByText('Sample Question 1')).toBeInTheDocument();
        expect(screen.getByText('Option B')).toBeInTheDocument();
    });

});

