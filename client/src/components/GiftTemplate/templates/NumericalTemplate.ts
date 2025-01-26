import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainerTemplate';
import Title from './TitleTemplate';
import GlobalFeedback from './GlobalFeedbackTemplate';
import { ParagraphStyle, InputStyle } from '../constants';
import { state } from '.';
import { MultipleNumericalAnswer, NumericalAnswer, NumericalQuestion, TextFormat } from 'gift-pegjs';
import { isHighLowNumericalAnswer, isMultipleNumericalAnswer, isRangeNumericalAnswer, isSimpleNumericalAnswer } from 'gift-pegjs/typeGuards';
import StemTemplate from './StemTemplate';
import { FormattedTextTemplate } from './TextTypeTemplate';

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
    const placeholder = isMultipleNumericalAnswer(choices[0])
    ? choices.map(choice => {
        console.log(JSON.stringify(choice)); 
        const c = choice as MultipleNumericalAnswer; 
        return Answer(c.answer, c.formattedFeedback)
    }).join(', ')
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

function Answer(choice: NumericalAnswer, formattedFeedback?: TextFormat): string {
    const formattedFeedbackString = formattedFeedback ? ` (${FormattedTextTemplate(formattedFeedback)})` : '';
    switch (true) {
        case isSimpleNumericalAnswer(choice):
            return `${choice.number}${formattedFeedbackString}`;
        case isRangeNumericalAnswer(choice):
            return `${choice.number} &plusmn; ${choice.range}${formattedFeedbackString}`;
        case isHighLowNumericalAnswer(choice):
            return `${choice.numberLow}..${choice.numberHigh}${formattedFeedbackString}`;
        default:
            return ``;
    }
}
