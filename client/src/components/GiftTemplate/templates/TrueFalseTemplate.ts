import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainerTemplate';
import {textType} from './TextTypeTemplate';
import GlobalFeedback from './GlobalFeedbackTemplate';
import MultipleChoiceAnswersTemplate from './MultipleChoiceAnswersTemplate';
import Title from './TitleTemplate';
import { TextChoice, TrueFalseQuestion } from 'gift-pegjs';
import DOMPurify from 'dompurify';

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
            `<div dangerouslySetInnerHTML={{ __html: ${DOMPurify.sanitize(textType(formattedStem))} }} />`,
            MultipleChoiceAnswersTemplate({ choices: choices }),
            formattedGlobalFeedback ? GlobalFeedback(formattedGlobalFeedback) : ``
        ]
    })}`;
}
