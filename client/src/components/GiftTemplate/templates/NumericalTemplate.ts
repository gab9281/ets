import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainerTemplate';
import Title from './TitleTemplate';
import GlobalFeedback from './GlobalFeedbackTemplate';
import { ParagraphStyle, InputStyle } from '../constants';
import { state } from '.';
import { NumericalAnswer, NumericalQuestion } from 'gift-pegjs';
import { isHighLowNumericalAnswer, isRangeNumericalAnswer, isSimpleNumericalAnswer } from 'gift-pegjs/typeGuards';
import StemTemplate from './StemTemplate';

type NumericalOptions = TemplateOptions & NumericalQuestion;
type NumericalAnswerOptions = TemplateOptions & Pick<NumericalQuestion, 'choices'>;

export default function NumericalTemplate({
    title,
    formattedStem,
    choices,
    formattedGlobalFeedback
}: NumericalOptions): string {
    return `${QuestionContainer({
        children: [
            Title({
                type: 'Numérique',
                title: title
            }),
            StemTemplate({formattedStem}),
            NumericalAnswers({ choices: choices }),
            formattedGlobalFeedback ? GlobalFeedback(formattedGlobalFeedback) : ''
        ]
    })}`;
}

function NumericalAnswers({ choices }: NumericalAnswerOptions): string {
    const placeholder = choices.length > 1
    ? choices.map(choice => {Answer(choice)}).join(', ')
    : Answer(choices[0]);

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

function Answer(choice: NumericalAnswer): string {
    switch (true) {
        case isSimpleNumericalAnswer(choice):
            return `${choice.number}`;
        case isRangeNumericalAnswer(choice):
            return `${choice.number} &plusmn; ${choice.range}`;
        case isHighLowNumericalAnswer(choice):
            return `${choice.numberLow}..${choice.numberHigh}`;
        default:
            return ``;
    }
}
