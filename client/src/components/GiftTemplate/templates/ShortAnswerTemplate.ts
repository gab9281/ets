import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainerTemplate';
import Title from './TitleTemplate';
import {textType} from './TextTypeTemplate';
import GlobalFeedback from './GlobalFeedbackTemplate';
import { ParagraphStyle, InputStyle } from '../constants';
import { state } from './index';
import { ShortAnswerQuestion } from 'gift-pegjs';

type ShortAnswerOptions = TemplateOptions & ShortAnswerQuestion;
type AnswerOptions = TemplateOptions & Pick<ShortAnswerQuestion, 'choices'>;

export default function ShortAnswerTemplate({
    title,
    formattedStem,
    choices,
    formattedGlobalFeedback
}: ShortAnswerOptions): string {
    return `${QuestionContainer({
        children: [
            Title({
                type: 'Réponse courte',
                title: title
            }),
            `<p style="${ParagraphStyle(state.theme)}">${textType(formattedStem)}</p>`,
            Answers({ choices: choices }),
            formattedGlobalFeedback ? GlobalFeedback(formattedGlobalFeedback) : ''
        ]
    })}`;
}

function Answers({ choices }: AnswerOptions): string {
    const placeholder = choices
        .map(({ text }) => textType({ format: '', text: text }))
        .join(', ');
    return `
    <div>
      <span style="${ParagraphStyle(
          state.theme
      )}">Réponse: </span><input class="gift-input" type="text" style="${InputStyle(
        state.theme
    )}" placeholder="${placeholder}">
        </div>
      `;
}
