import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { QuestionType } from '../../../../Types/QuestionType';
import StudentModeQuiz from '../../../../components/StudentModeQuiz/StudentModeQuiz';

const mockQuestions: QuestionType[] = [
    {
        question: {
            id: '1',
            type: 'MC',
            stem: { format: 'plain', text: 'Sample Question 1' },
            title: 'Sample Question 1',
            hasEmbeddedAnswers: false,
            globalFeedback: null,
            choices: [
                { text: { format: 'plain', text: 'Option A' }, isCorrect: true, weight: 1, feedback: null },
                { text: { format: 'plain', text: 'Option B' }, isCorrect: false, weight: 0, feedback: null },
            ],
        },
    },
    {
        question: {
            id: '2',
            type: 'TF',
            stem: { format: 'plain', text: 'Sample Question 2' },
            isTrue: true,
            incorrectFeedback: null,
            correctFeedback: null,
            title: 'Question 2',
            hasEmbeddedAnswers: false,
            globalFeedback: null,
        },
    },
];

const mockSubmitAnswer = jest.fn();
const mockDisconnectWebSocket = jest.fn();

describe('StudentModeQuiz', () => {
    test('renders the initial question', async () => {
        render(
            <MemoryRouter>
                <StudentModeQuiz
                    questions={mockQuestions}
                    submitAnswer={mockSubmitAnswer}
                    disconnectWebSocket={mockDisconnectWebSocket}
                />
            </MemoryRouter>
        );

        // wait for the question to be rendered
        await waitFor(() => {
            expect(screen.getByText('Sample Question 1')).toBeInTheDocument();
            expect(screen.getByText('Option A')).toBeInTheDocument();
            expect(screen.getByText('Option B')).toBeInTheDocument();
            expect(screen.getByText('Quitter')).toBeInTheDocument();
        });

    });

    test('handles answer submission text', async () => {

        render(
            <MemoryRouter>
                <StudentModeQuiz
                questions={mockQuestions}
                submitAnswer={mockSubmitAnswer}
                disconnectWebSocket={mockDisconnectWebSocket}
                />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Option A'));
        fireEvent.click(screen.getByText('Répondre'));

        await waitFor(() => {
            expect(mockSubmitAnswer).toHaveBeenCalledWith('Option A', '1');
        });
    });

    test('handles quit button click', async () => {
        render(
            <MemoryRouter>
                <StudentModeQuiz
                    questions={mockQuestions}
                    submitAnswer={mockSubmitAnswer}
                    disconnectWebSocket={mockDisconnectWebSocket}
                />
            </MemoryRouter>);
        fireEvent.click(screen.getByText('Quitter'));

        await waitFor(() => {
            expect(mockDisconnectWebSocket).toHaveBeenCalled();
        });
    });

    test('navigates to the next question', async () => {
        render(
            <MemoryRouter>
                <StudentModeQuiz
                    questions={mockQuestions}
                    submitAnswer={mockSubmitAnswer}
                    disconnectWebSocket={mockDisconnectWebSocket}
                />
            </MemoryRouter>);

        fireEvent.click(screen.getByText('Option A'));
        fireEvent.click(screen.getByText('Répondre'));
        fireEvent.click(screen.getByText('Question suivante'));

        await waitFor(() => {
            const sampleQuestionElements = screen.queryAllByText(/Sample question 2/i);
            expect(sampleQuestionElements.length).toBeGreaterThan(0);
            expect(screen.getByText('V')).toBeInTheDocument();
        });

    });

    test('navigates to the previous question', async () => {

        render(
            <MemoryRouter>
                <StudentModeQuiz
                    questions={mockQuestions}
                    submitAnswer={mockSubmitAnswer}
                    disconnectWebSocket={mockDisconnectWebSocket}
                />
            </MemoryRouter>);

        fireEvent.click(screen.getByText('Option A'));
        fireEvent.click(screen.getByText('Répondre'));
        fireEvent.click(screen.getByText('Question précédente'));

        await waitFor(() => {
            expect(screen.getByText('Sample Question 1')).toBeInTheDocument();
            expect(screen.getByText('Option B')).toBeInTheDocument();
        });
    });

});

