import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainer';
import Title from './Title';
import { textType } from './TextType';
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
