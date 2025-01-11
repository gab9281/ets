// ShortAnswerQuestion.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShortAnswerQuestion from '../../../../components/Questions/ShortAnswerQuestion/ShortAnswerQuestion';

describe('ShortAnswerQuestion Component', () => {
    const mockHandleSubmitAnswer = jest.fn();
    const sampleStem = 'Sample question stem';

    const sampleProps = {
        questionTitle: 'Sample Question',
        choices: [
            {
                id: '1',
                feedback: {
                    format: 'text',
                    text: 'Correct answer feedback'
                },
                isCorrect: true,
                text: {
                    format: 'text',
                    text: 'Correct Answer'
                }
            },
            {
                id: '2',
                feedback: null,
                isCorrect: false,
                text: {
                    format: 'text',
                    text: 'Incorrect Answer'
                }
            }
        ],
        handleOnSubmitAnswer: mockHandleSubmitAnswer,
        showAnswer: false
    };

    beforeEach(() => {
        render(<ShortAnswerQuestion questionContent={{text: sampleStem, format: 'plain'}} {...sampleProps} />);
    });

    it('renders correctly', () => {
        expect(screen.getByText(sampleStem)).toBeInTheDocument();
        expect(screen.getByTestId('text-input')).toBeInTheDocument();
        expect(screen.getByText('Répondre')).toBeInTheDocument();
    });

    it('handles input change correctly', () => {
        const inputElement = screen.getByTestId('text-input') as HTMLInputElement;

        fireEvent.change(inputElement, { target: { value: 'User Input' } });

        expect(inputElement.value).toBe('User Input');
    });

    it('Submit button should be disable if nothing is entered', () => {
        const submitButton = screen.getByText('Répondre');

        expect(submitButton).toBeDisabled();
    });

    it('not submitted answer if nothing is entered', () => {
        const submitButton = screen.getByText('Répondre');

        fireEvent.click(submitButton);

        expect(mockHandleSubmitAnswer).not.toHaveBeenCalled();
    });

    it('submits answer correctly', () => {
        const inputElement = screen.getByTestId('text-input') as HTMLInputElement;
        const submitButton = screen.getByText('Répondre');

        fireEvent.change(inputElement, { target: { value: 'User Input' } });

        fireEvent.click(submitButton);

        expect(mockHandleSubmitAnswer).toHaveBeenCalledWith('User Input');
    });
});
