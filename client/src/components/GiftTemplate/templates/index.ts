import Category from './Category';
import DescriptionTemplate from './Description';
import Essay from './Essay';
import Matching from './Matching';
import MultipleChoice from './MultipleChoice';
import Numerical from './Numerical';
import ShortAnswer from './ShortAnswer';
import TrueFalse from './TrueFalse';
import Error from './Error';
import {
    GIFTQuestion,
    // Category as CategoryType,
    // Description as DescriptionType,
    MultipleChoice as MultipleChoiceType,
    Numerical as NumericalType,
    ShortAnswer as ShortAnswerType,
    // Essay as EssayType,
    TrueFalse as TrueFalseType,
    Matching as MatchingType,
    DisplayOptions
} from './types';

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
            return MultipleChoice({
                ...(keys as MultipleChoiceType)
            });
        case 'Numerical':
            return Numerical({ ...(keys as NumericalType) });
        case 'Short':
            return ShortAnswer({
                ...(keys as ShortAnswerType)
            });
        // case 'Essay':
        //     return Essay({ ...(keys as EssayType) });
        case 'TF':
            return TrueFalse({ ...(keys as TrueFalseType) });
        case 'Matching':
            return Matching({ ...(keys as MatchingType) });
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
    Category,
    DescriptionTemplate as Description,
    Essay,
    Matching,
    MultipleChoice,
    Numerical,
    ShortAnswer,
    TrueFalse,
    Error
};
