import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainerTemplate';
import {textType} from './TextTypeTemplate';
import GlobalFeedback from './GlobalFeedbackTemplate';
import MultipleChoiceAnswersTemplate from './MultipleChoiceAnswersTemplate';
import Title from './TitleTemplate';
import { TextChoice, TrueFalseQuestion } from 'gift-pegjs';
import { ParagraphStyle } from '../constants';
import { state } from '.';
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
            `<p style="${ParagraphStyle(state.theme)}" class="present-question-stem">${DOMPurify.sanitize(textType(formattedStem))}</p>`,
            MultipleChoiceAnswersTemplate({ choices: choices }),
            formattedGlobalFeedback ? GlobalFeedback(formattedGlobalFeedback) : ``
        ]
    })}`;
}
