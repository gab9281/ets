// NumericalQuestion.tsx
import React, { useState } from 'react';
import '../questionStyle.css';
import { Button, TextField } from '@mui/material';
import { textType } from '../../GiftTemplate/templates/TextType';
import { TextFormat, NumericalAnswer, isHighLowNumericalAnswer, isMultipleNumericalAnswer, isRangeNumericalAnswer, isSimpleNumericalAnswer, SimpleNumericalAnswer, RangeNumericalAnswer, HighLowNumericalAnswer } from 'gift-pegjs';
import DOMPurify from 'dompurify';

// type CorrectAnswer = {
//     numberHigh?: number;
//     numberLow?: number;
//     number?: number;
//     type: string;
// };

interface Props {
    questionContent: TextFormat;
    correctAnswers: NumericalAnswer;
    globalFeedback?: string | undefined;
    handleOnSubmitAnswer?: (answer: number) => void;
    showAnswer?: boolean;
}

const NumericalQuestion: React.FC<Props> = (props) => {
    const { questionContent, correctAnswers, showAnswer, handleOnSubmitAnswer, globalFeedback } =
        props;

    const [answer, setAnswer] = useState<number>();

    let correctAnswer= '';

    if (isSimpleNumericalAnswer(correctAnswers)) {
        correctAnswer = `${(correctAnswers as SimpleNumericalAnswer).number}`;
      } else if (isRangeNumericalAnswer(correctAnswers)) {
        const choice = correctAnswers as RangeNumericalAnswer;
        correctAnswer = `Entre ${choice.number - choice.range} et ${choice.number + choice.range}`;
      } else if (isHighLowNumericalAnswer(correctAnswers)) {
        const choice = correctAnswers as HighLowNumericalAnswer;
        correctAnswer = `Entre ${choice.numberLow} et ${choice.numberHigh}`;
      } else if (isMultipleNumericalAnswer(correctAnswers)) {
        correctAnswer = `MultipleNumericalAnswer is not supported yet`;
      } else {
        throw new Error('Unknown numerical answer type');
      }
  
    return (
        <div className="question-wrapper">
            <div>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(textType({text: questionContent})) }} />
            </div>
            {showAnswer ? (
                <>
                    <div className="correct-answer-text mb-2">{correctAnswer}</div>
                    {globalFeedback && <div className="global-feedback mb-2">{globalFeedback}</div>}
                </>
            ) : (
                <>
                    <div className="answer-wrapper mb-1">
                        <TextField
                            type="number"
                            id={questionContent.text}
                            name={questionContent.text}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setAnswer(e.target.valueAsNumber);
                            }}
                            inputProps={{ 'data-testid': 'number-input' }}
                        />
                    </div>
                    {globalFeedback && showAnswer && (
                        <div className="global-feedback mb-2">{globalFeedback}</div>
                    )}
                    {handleOnSubmitAnswer && (
                        <Button
                            variant="contained"
                            onClick={() =>
                                answer !== undefined &&
                                handleOnSubmitAnswer &&
                                handleOnSubmitAnswer(answer)
                            }
                            disabled={answer === undefined || isNaN(answer)}
                        >
                            Répondre
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

export default NumericalQuestion;
