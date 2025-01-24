// Question;tsx
import React, { useMemo } from 'react';
import { Question } from 'gift-pegjs';

import TrueFalseQuestion from './TrueFalseQuestion/TrueFalseQuestion';
import MultipleChoiceQuestionDisplay from './MultipleChoiceQuestionDisplay/MultipleChoiceQuestionDisplay';
import NumericalQuestion from './NumericalQuestion/NumericalQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion/ShortAnswerQuestion';
import useCheckMobileScreen from '../../services/useCheckMobileScreen';

interface QuestionProps {
    question: Question;
    handleOnSubmitAnswer?: (answer: string | number | boolean) => void;
    showAnswer?: boolean;
}
const QuestionDisplay: React.FC<QuestionProps> = ({
    question,
    handleOnSubmitAnswer,
    showAnswer,
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
                    questionContent={question.formattedStem}
                    correctAnswer={question.isTrue}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    showAnswer={showAnswer}
                    globalFeedback={question.formattedGlobalFeedback?.text}
                />
            );
            break;
        case 'MC':
            questionTypeComponent = (
                <MultipleChoiceQuestionDisplay
                    question={question}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    showAnswer={showAnswer}
                />
            );
            break;
        case 'Numerical':
            if (question.choices) {
                if (!Array.isArray(question.choices)) {
                    questionTypeComponent = (
                        <NumericalQuestion
                            questionContent={question.formattedStem}
                            correctAnswers={question.choices}
                            handleOnSubmitAnswer={handleOnSubmitAnswer}
                            showAnswer={showAnswer}
                            globalFeedback={question.formattedGlobalFeedback?.text}
                        />
                    );
                } else {
                    questionTypeComponent = (  // TODO fix NumericalQuestion (correctAnswers is borked)
                        <NumericalQuestion
                            questionContent={question.formattedStem}
                            correctAnswers={question.choices}
                            handleOnSubmitAnswer={handleOnSubmitAnswer}
                            showAnswer={showAnswer}
                            globalFeedback={question.formattedGlobalFeedback?.text}
                        />
                    );
                }
            }
            break;
        case 'Short':
            questionTypeComponent = (
                <ShortAnswerQuestion
                    questionContent={question.formattedStem}
                    choices={question.choices.map((choice, index) => ({ ...choice, id: index.toString() }))}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    showAnswer={showAnswer}
                    globalFeedback={question.formattedGlobalFeedback?.text}
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

export default QuestionDisplay;
