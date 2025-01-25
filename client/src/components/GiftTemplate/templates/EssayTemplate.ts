import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainerTemplate';
import Title from './TitleTemplate';
import {textType} from './TextTypeTemplate';
import GlobalFeedbackTemplate from './GlobalFeedbackTemplate';
import { ParagraphStyle, TextAreaStyle } from '../constants';
import { state } from '.';
import { EssayQuestion } from 'gift-pegjs';

type EssayOptions = TemplateOptions & EssayQuestion;

export default function EssayTemplate({ title, formattedStem, formattedGlobalFeedback }: EssayOptions): string {
    return `${QuestionContainer({
        children: [
            Title({
                type: 'Développement',
                title: title
            }),
            `<p style="${ParagraphStyle(state.theme)}">${textType(formattedStem)}</p>`,
            `<textarea class="gift-textarea" style="${TextAreaStyle(
                state.theme
            )}" placeholder="Entrez votre réponse ici..."></textarea>`, 
            (formattedGlobalFeedback && formattedGlobalFeedback.text) ?
                GlobalFeedbackTemplate(formattedGlobalFeedback) : ``
        ]
    })}`;
}
