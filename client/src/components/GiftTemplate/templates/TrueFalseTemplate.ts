import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainerTemplate';
import GlobalFeedback from './GlobalFeedbackTemplate';
import MultipleChoiceAnswersTemplate from './MultipleChoiceAnswersTemplate';
import Title from './TitleTemplate';
import { TextChoice, TrueFalseQuestion } from 'gift-pegjs';
import StemTemplate from './StemTemplate';

type TrueFalseOptions = TemplateOptions & TrueFalseQuestion;

export default function TrueFalseTemplate({
    isTrue,
    title,
    formattedStem,
    trueFormattedFeedback, falseFormattedFeedback,
    formattedGlobalFeedback
}: TrueFalseOptions): string {
    const choices: TextChoice[] = [
        {
            formattedText: {
                format: 'moodle',
                text: 'Vrai'
            },
            isCorrect: isTrue,
            formattedFeedback: trueFormattedFeedback
        },
        {
            formattedText: {
                format: 'moodle',
                text: 'Faux'
            },
            isCorrect: !isTrue,
            formattedFeedback: falseFormattedFeedback
        }
    ];
    return `${QuestionContainer({
        children: [
            Title({
                type: 'Vrai/Faux',
                title: title
            }),
            StemTemplate({formattedStem}),
            MultipleChoiceAnswersTemplate({ choices: choices }),
            formattedGlobalFeedback ? GlobalFeedback(formattedGlobalFeedback) : ``
        ]
    })}`;
}
