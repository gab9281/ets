import { TemplateOptions } from './types';
import { state } from '.';
import { ParagraphStyle } from '../constants';
import { BaseQuestion } from 'gift-pegjs';
import { FormatTextTemplate } from './TextTypeTemplate';

// Type is string to allow for custom question type text (e,g, "Multiple Choice")
interface StemOptions extends TemplateOptions {
    formattedStem: BaseQuestion['formattedStem'];
}

export default function StemTemplate({ formattedStem }: StemOptions): string {
    const Container = `
  display: flex;
`;

    return `
  <div style="${Container}">
    <span>
      <p style="${ParagraphStyle(state.theme)}" class="present-question-stem">
                      ${FormatTextTemplate(formattedStem)}
                  </p>
    </span>
  </div>
`;
}
