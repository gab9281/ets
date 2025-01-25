import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainerTemplate';
import GlobalFeedback from './GlobalFeedbackTemplate';
import Title from './TitleTemplate';
import MultipleChoiceAnswers from './MultipleChoiceAnswersTemplate';
import { MultipleChoiceQuestion } from 'gift-pegjs';
import StemTemplate from './StemTemplate';

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
            StemTemplate({formattedStem}),
            MultipleChoiceAnswers({ choices: choices }),
            formattedGlobalFeedback ? GlobalFeedback(formattedGlobalFeedback) : ''
        ]
    })}`;
}
