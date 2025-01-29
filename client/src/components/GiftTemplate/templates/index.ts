
import {
    ParsedGIFTQuestion as GIFTQuestion,
    // Category as CategoryType,
    // Description as DescriptionType,
    MultipleChoiceQuestion as MultipleChoiceType,
    NumericalQuestion as NumericalType,
    ShortAnswerQuestion as ShortAnswerType,
    // Essay as EssayType,
    TrueFalseQuestion as TrueFalseType,
    // MatchingQuestion as MatchingType,
} from 'gift-pegjs';
import { DisplayOptions } from './types';
import DescriptionTemplate from './DescriptionTemplate';
import EssayTemplate from './EssayTemplate';
import MatchingTemplate from './MatchingTemplate';
import MultipleChoiceTemplate from './MultipleChoiceTemplate';
import NumericalTemplate from './NumericalTemplate';
import ShortAnswerTemplate from './ShortAnswerTemplate';
import TrueFalseTemplate from './TrueFalseTemplate';
import Error from './ErrorTemplate';
import CategoryTemplate from './CategoryTemplate';

export const state: DisplayOptions = { preview: true, theme: 'light' };

export default function Template(
    { type, ...keys }: GIFTQuestion,
    options?: Partial<DisplayOptions>
): string {
    Object.assign(state, options);

    switch (type) {
        // Category, Description, Essay are not supported?
        // case 'Category':
        //     return Category({ ...(keys as CategoryType) });
        // case 'Description':
        //     return Description({
        //         ...(keys as DescriptionType)
        //     });
        case 'MC':
            return MultipleChoiceTemplate({
                ...(keys as MultipleChoiceType)
            });
        case 'Numerical':
            return NumericalTemplate({ ...(keys as NumericalType) });
        case 'Short':
            return ShortAnswerTemplate({
                ...(keys as ShortAnswerType)
            });
        // case 'Essay':
        //     return Essay({ ...(keys as EssayType) });
        case 'TF':
            return TrueFalseTemplate({ ...(keys as TrueFalseType) });
        // case 'Matching':
        //     return Matching({ ...(keys as MatchingType) });
        default:
            // TODO: throw error for unsupported question types?
            // throw new Error(`Unsupported question type: ${type}`);
            return ``;
    }
}

export function ErrorTemplate(text: string, options?: Partial<DisplayOptions>): string {
    Object.assign(state, options);

    return Error(text);
}

export {
    CategoryTemplate,
    DescriptionTemplate as Description,
    EssayTemplate as Essay,
    MatchingTemplate as Matching,
    MultipleChoiceTemplate as MultipleChoice,
    NumericalTemplate as Numerical,
    ShortAnswerTemplate as ShortAnswer,
    TrueFalseTemplate as TrueFalse,
    Error
};
