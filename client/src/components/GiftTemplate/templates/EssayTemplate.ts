import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainerTemplate';
import Title from './TitleTemplate';
import GlobalFeedbackTemplate from './GlobalFeedbackTemplate';
import { TextAreaStyle } from '../constants';
import { state } from '.';
import { EssayQuestion } from 'gift-pegjs';
import StemTemplate from './StemTemplate';

type EssayOptions = TemplateOptions & EssayQuestion;

export default function EssayTemplate({ title, formattedStem, formattedGlobalFeedback }: EssayOptions): string {
    return `${QuestionContainer({
        children: [
            Title({
                type: 'Développement',
                title: title
            }),
            StemTemplate({formattedStem}),
            `<textarea class="gift-textarea" style="${TextAreaStyle(
                state.theme
            )}" placeholder="Entrez votre réponse ici..."></textarea>`, 
            (formattedGlobalFeedback && formattedGlobalFeedback.text) ?
                GlobalFeedbackTemplate(formattedGlobalFeedback) : ``
        ]
    })}`;
}
