import { TemplateOptions } from './types';
import QuestionContainer from './QuestionContainerTemplate';
import Title from './TitleTemplate';
import { Category } from 'gift-pegjs';

type CategoryOptions = TemplateOptions & Category;

export default function CategoryTemplate( { title }: CategoryOptions): string {
    return `${QuestionContainer({
        children: Title({
            type: 'Catégorie',
            title: title
        })
    })}`;
}
