import { TemplateOptions } from './types';
import {FormattedTextTemplate} from './TextTypeTemplate';
import { state } from '.';
import { theme } from '../constants';
import { TextFormat } from 'gift-pegjs';

type GlobalFeedbackOptions = TemplateOptions & TextFormat;

export default function GlobalFeedbackTemplate({ format, text }: GlobalFeedbackOptions): string {
    const Container = `
  position: relative;
  margin-top: 1rem;
  padding: 0 1rem;
  background-color: ${theme(state.theme, 'beige100', 'black400')};
  color: ${theme(state.theme, 'beige900', 'gray200')};
  border: ${theme(state.theme, 'beige300', 'black300')} ${state.theme === 'light' ? 1 : 2}px solid;
  border-radius: 6px;
  box-shadow: 0px 2px 5px ${theme(state.theme, 'gray400', 'black800')};
`;

    return (format && text)
        ? `<div style="${Container}">
        <p>${FormattedTextTemplate({format: format, text: text})}</p>
      </div>`
        : ``;
}
