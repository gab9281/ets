import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainerTemplate';
import Title from './TitleTemplate';
import { Description } from 'gift-pegjs';
import StemTemplate from './StemTemplate';

type DescriptionOptions = TemplateOptions & Description;

export default function DescriptionTemplate({ title, formattedStem}: DescriptionOptions): string {
    return `${QuestionContainer({
        children: [
            Title({
                type: 'Description',
                title: title
            }),
            StemTemplate({formattedStem}),
        ]
    })}`;
}
