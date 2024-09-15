import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultipleChoiceQuestion from '../../../../components/Questions/MultipleChoiceQuestion/MultipleChoiceQuestion';

const questionStem = 'Question stem';
const sampleFeedback = 'Feedback';

describe('MultipleChoiceQuestion', () => {
    const mockHandleOnSubmitAnswer = jest.fn();
    const choices = [
        { feedback: null, isCorrect: true, text: { format: 'plain', text: 'Choice 1' } },
        { feedback: null, isCorrect: false, text: { format: 'plain', text: 'Choice 2' } }
    ];

    beforeEach(() => {
        render(
            <MultipleChoiceQuestion
                globalFeedback={sampleFeedback}
                choices={choices}
                handleOnSubmitAnswer={mockHandleOnSubmitAnswer} questionContent={{text: questionStem, format: 'plain'}}            />
        );
    });

    test('renders the question and choices', () => {
        expect(screen.getByText(questionStem)).toBeInTheDocument();
        choices.forEach((choice) => {
            expect(screen.getByText(choice.text.text)).toBeInTheDocument();
        });
    });

    test('does not submit when no answer is selected', () => {
        const submitButton = screen.getByText('Répondre');
        fireEvent.click(submitButton);
        expect(mockHandleOnSubmitAnswer).not.toHaveBeenCalled();
    });

    test('submits the selected answer', () => {
        const choiceButton = screen.getByText('Choice 1').closest('button');
        if (!choiceButton) throw new Error('Choice button not found');
        fireEvent.click(choiceButton);
        const submitButton = screen.getByText('Répondre');
        fireEvent.click(submitButton);
        expect(mockHandleOnSubmitAnswer).toHaveBeenCalledWith('Choice 1');
    });
});
