// Question;tsx
import React, { useMemo } from 'react';
import { GIFTQuestion } from 'gift-pegjs';

import TrueFalseQuestion from './TrueFalseQuestion/TrueFalseQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion/MultipleChoiceQuestion';
import NumericalQuestion from './NumericalQuestion/NumericalQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion/ShortAnswerQuestion';
import useCheckMobileScreen from '../../services/useCheckMobileScreen';

interface QuestionProps {
    question: GIFTQuestion | undefined;
    handleOnSubmitAnswer?: (answer: string | number | boolean) => void;
    showAnswer?: boolean;
    imageUrl?: string;
}
const Question: React.FC<QuestionProps> = ({
    question,
    handleOnSubmitAnswer,
    showAnswer,
    imageUrl
}) => {
    const isMobile = useCheckMobileScreen();
    const imgWidth = useMemo(() => {
        return isMobile ? '100%' : '20%';
    }, [isMobile]);

    let questionTypeComponent = null;
    switch (question?.type) {
        case 'TF':
            questionTypeComponent = (
                <TrueFalseQuestion
                    questionContent={question.stem}
                    correctAnswer={question.isTrue}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    showAnswer={showAnswer}
                    globalFeedback={question.globalFeedback?.text}
                />
            );
            break;
        case 'MC':
            questionTypeComponent = (
                <MultipleChoiceQuestion
                    questionStem={question.stem}
                    choices={question.choices}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    showAnswer={showAnswer}
                    globalFeedback={question.globalFeedback?.text}
                />
            );
            break;
        case 'Numerical':
            if (question.choices) {
                if (!Array.isArray(question.choices)) {
                    questionTypeComponent = (
                        <NumericalQuestion
                            questionContent={question.stem}
                            correctAnswers={question.choices}
                            handleOnSubmitAnswer={handleOnSubmitAnswer}
                            showAnswer={showAnswer}
                            globalFeedback={question.globalFeedback?.text}
                        />
                    );
                } else {
                    questionTypeComponent = (
                        <NumericalQuestion
                            questionContent={question.stem}
                            correctAnswers={question.choices[0].text}
                            handleOnSubmitAnswer={handleOnSubmitAnswer}
                            showAnswer={showAnswer}
                            globalFeedback={question.globalFeedback?.text}
                        />
                    );
                }
            }
            break;
        case 'Short':
            questionTypeComponent = (
                <ShortAnswerQuestion
                    questionContent={question.stem}
                    choices={question.choices}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    showAnswer={showAnswer}
                    globalFeedback={question.globalFeedback?.text}
                />
            );
            break;
    }
    return (
        <div className="question-container">
            {questionTypeComponent ? (
                <>
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="QuestionImage"
                            style={{ width: imgWidth, marginBottom: '2rem' }}
                        />
                    )}
                    {questionTypeComponent}
                </>
            ) : (
                <div>Question de type inconnue</div>
            )}
        </div>
    );
};

export default Question;
