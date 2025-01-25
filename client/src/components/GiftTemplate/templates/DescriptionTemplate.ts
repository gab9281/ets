import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainerTemplate';
import Title from './TitleTemplate';
import { textType } from './TextTypeTemplate';
import { ParagraphStyle } from '../constants';
import { state } from '.';
import { Description } from 'gift-pegjs';

type DescriptionOptions = TemplateOptions & Description;

export default function DescriptionTemplate({ title, formattedStem}: DescriptionOptions): string {
    return `${QuestionContainer({
        children: [
            Title({
                type: 'Description',
                title: title
            }),
            `<p style="${ParagraphStyle(state.theme)}">
                ${textType(formattedStem)}
            </p>`
        ]
    })}`;
}
