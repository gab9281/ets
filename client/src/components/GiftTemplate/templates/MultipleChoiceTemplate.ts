import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainerTemplate';
import GlobalFeedback from './GlobalFeedbackTemplate';
import Title from './TitleTemplate';
import {textType} from './TextTypeTemplate';
import MultipleChoiceAnswers from './MultipleChoiceAnswersTemplate';
import { ParagraphStyle } from '../constants';
import { state } from '.';
import { MultipleChoiceQuestion } from 'gift-pegjs';

type MultipleChoiceOptions = TemplateOptions & MultipleChoiceQuestion;

export default function MultipleChoiceTemplate({
    title,
    formattedStem,
    choices,
    formattedGlobalFeedback
}: MultipleChoiceOptions): string {
    return `${QuestionContainer({
        children: [
            Title({
                type: 'Choix multiple',
                title: title
            }),
            `<p style="${ParagraphStyle(state.theme)}" class="present-question-stem">${textType(formattedStem)}</p>`,
            MultipleChoiceAnswers({ choices: choices }),
            formattedGlobalFeedback ? GlobalFeedback(formattedGlobalFeedback) : ''
        ]
    })}`;
}
