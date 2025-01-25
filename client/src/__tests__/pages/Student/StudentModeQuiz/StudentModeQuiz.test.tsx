import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import StudentModeQuiz from 'src/components/StudentModeQuiz/StudentModeQuiz';
import { BaseQuestion, parse } from 'gift-pegjs';
import { QuestionType } from 'src/Types/QuestionType';

const mockGiftQuestions = parse(
    `::Sample Question 1:: Sample Question 1 {=Option A ~Option B}
    
    ::Sample Question 2:: Sample Question 2 {T}`);

const mockQuestions: QuestionType[] = mockGiftQuestions.map((question, index) => {
    if (question.type !== "Category")
        question.id = (index + 1).toString();
    const newMockQuestion = question;
    return {question : newMockQuestion as BaseQuestion};
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

        expect(mockSubmitAnswer).toHaveBeenCalledWith('Option A', 1);
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

});

