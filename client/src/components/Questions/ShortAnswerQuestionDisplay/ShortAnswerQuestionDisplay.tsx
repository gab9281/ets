import React, { useState } from 'react';
import '../questionStyle.css';
import { Button, TextField } from '@mui/material';
import { textType } from '../../GiftTemplate/templates/TextType';
import { ShortAnswerQuestion } from 'gift-pegjs';
import DOMPurify from 'dompurify';

interface Props {
    question: ShortAnswerQuestion;
    handleOnSubmitAnswer?: (answer: string) => void;
    showAnswer?: boolean;
}

const ShortAnswerQuestionDisplay: React.FC<Props> = (props) => {
    const { question, showAnswer, handleOnSubmitAnswer } = props;
    const [answer, setAnswer] = useState<string>();

    return (
        <div className="question-wrapper">
            <div className="question content">
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(textType({text: question.formattedStem})) }} />
            </div>
            {showAnswer ? (
                <>
                    <div className="correct-answer-text mb-1">
                        {question.choices.map((choice) => (
                            <div key={choice.text} className="mb-1">
                                {choice.text}
                            </div>
                        ))}
                    </div>
                    {question.formattedGlobalFeedback && <div className="global-feedback mb-2">
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(textType({text: question.formattedGlobalFeedback})) }} />
                    </div>}
                </>
            ) : (
                <>
                    <div className="answer-wrapper mb-1">
                        <TextField
                            type="text"
                            id={question.formattedStem.text}
                            name={question.formattedStem.text}
                            onChange={(e) => {
                                setAnswer(e.target.value);
                            }}
                            disabled={showAnswer}
                            aria-label="short-answer-input"
                        />
                    </div>
                    {handleOnSubmitAnswer && (
                        <Button
                            variant="contained"
                            onClick={() =>
                                answer !== undefined &&
                                handleOnSubmitAnswer &&
                                handleOnSubmitAnswer(answer)
                            }
                            disabled={answer === undefined || answer === ''}
                        >
                            Répondre
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

export default ShortAnswerQuestionDisplay;
