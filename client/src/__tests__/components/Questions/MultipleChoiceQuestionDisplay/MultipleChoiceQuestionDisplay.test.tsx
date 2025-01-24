import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultipleChoiceQuestionDisplay from 'src/components/Questions/MultipleChoiceQuestionDisplay/MultipleChoiceQuestionDisplay';
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MultipleChoiceQuestion, parse } from 'gift-pegjs';

const questions = parse(
    `::Sample Question 1:: Question stem
    {
        =Choice 1
        ~Choice 2
    }`) as MultipleChoiceQuestion[];

const question = questions[0];

describe('MultipleChoiceQuestionDisplay', () => {
    const mockHandleOnSubmitAnswer = jest.fn();
    const sampleProps = {
        question: question,
        handleOnSubmitAnswer: mockHandleOnSubmitAnswer,
        showAnswer: false
    };

    const choices = question.choices;

    beforeEach(() => {
        render(
            <MemoryRouter>
                <MultipleChoiceQuestionDisplay
                  {...sampleProps}
                    />
            </MemoryRouter>);
    });

    test('renders the question and choices', () => {
        expect(screen.getByText(question.formattedStem.text)).toBeInTheDocument();
        choices.forEach((choice) => {
            expect(screen.getByText(choice.formattedText.text)).toBeInTheDocument();
        });
    });

    test('does not submit when no answer is selected', () => {
        const submitButton = screen.getByText('Répondre');
        act(() => {
            fireEvent.click(submitButton);
        });
        expect(mockHandleOnSubmitAnswer).not.toHaveBeenCalled();
    });

    test('submits the selected answer', () => {
        const choiceButton = screen.getByText('Choice 1').closest('button');
        if (!choiceButton) throw new Error('Choice button not found');
        act(() => {
            fireEvent.click(choiceButton);
        });

        const submitButton = screen.getByText('Répondre');
        act(() => {
            fireEvent.click(submitButton);
        });

        expect(mockHandleOnSubmitAnswer).toHaveBeenCalledWith('Choice 1');
    });
});
