export type Template = (options: TemplateOptions) => string;

export interface TemplateOptions {
    children?: Template | string | Array<Template | string>;
    options?: DisplayOptions;
}

export type ThemeType = 'light' | 'dark';

export interface DisplayOptions {
    theme: ThemeType;
    preview: boolean;
}

export { 
    QuestionType, FormatType, NumericalType, TextFormat, NumericalFormat, TextChoice, NumericalChoice, Question, Description, Category, MultipleChoice, ShortAnswer, Numerical, Essay, TrueFalse,
    Matching, Match, GIFTQuestion } from 'gift-pegjs';

export interface Choice {
    isCorrect: boolean;
    weight: number | null;
    text: TextFormat | NumericalFormat;
    feedback: TextFormat | null;
}
