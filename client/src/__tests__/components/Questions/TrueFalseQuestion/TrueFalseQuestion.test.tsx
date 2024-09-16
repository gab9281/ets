// TrueFalseQuestion.test.tsx
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrueFalseQuestion from '../../../../components/Questions/TrueFalseQuestion/TrueFalseQuestion';
import { MemoryRouter } from 'react-router-dom';

describe('TrueFalseQuestion Component', () => {
    const mockHandleSubmitAnswer = jest.fn();
    const sampleStem = 'Sample question stem';

    const sampleProps = {
        questionTitle: 'Sample True/False Question',
        correctAnswer: true,
        handleOnSubmitAnswer: mockHandleSubmitAnswer,
        showAnswer: false
    };

    beforeEach(() => {
        render(
            <MemoryRouter>
                <TrueFalseQuestion questionContent={{ text: sampleStem, format: 'plain' }} {...sampleProps} />
            </MemoryRouter>);
    });

    it('renders correctly', () => {
        expect(screen.getByText(sampleStem)).toBeInTheDocument();
        expect(screen.getByText('Vrai')).toBeInTheDocument();
        expect(screen.getByText('Faux')).toBeInTheDocument();
        expect(screen.getByText('Répondre')).toBeInTheDocument();
    });

    it('Submit button should be disabled if no option is selected', () => {
        const submitButton = screen.getByText('Répondre');
        expect(submitButton).toBeDisabled();
    });

    it('not submit answer if no option is selected', () => {
        const submitButton = screen.getByText('Répondre');
        act(() => {
            fireEvent.click(submitButton);
        });

        expect(mockHandleSubmitAnswer).not.toHaveBeenCalled();
    });

    it('submits answer correctly for True', () => {
        const trueButton = screen.getByText('Vrai');
        const submitButton = screen.getByText('Répondre');

        act(() => {
            fireEvent.click(trueButton);
        });

        act(() => {
            fireEvent.click(submitButton);
        });

        expect(mockHandleSubmitAnswer).toHaveBeenCalledWith(true);
    });

    it('submits answer correctly for False', () => {
        const falseButton = screen.getByText('Faux');
        const submitButton = screen.getByText('Répondre');
        act(() => {
            fireEvent.click(falseButton);
        });
        act(() => {
            fireEvent.click(submitButton);
        });

        expect(mockHandleSubmitAnswer).toHaveBeenCalledWith(false);
    });
});
