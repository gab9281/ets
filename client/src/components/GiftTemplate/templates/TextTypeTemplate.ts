// import { marked } from 'marked';
import marked from 'src/markedConfig';

import katex from 'katex';
import { TextFormat } from 'gift-pegjs';
import DOMPurify from 'dompurify';  // cleans HTML to prevent XSS attacks, etc.

export function formatLatex(text: string): string {
    return text
        .replace(/\$\$(.*?)\$\$/g, (_, inner) => katex.renderToString(inner, { displayMode: true }))
        .replace(/\$(.*?)\$/g, (_, inner) => katex.renderToString(inner, { displayMode: false }))
        .replace(/\\\[(.*?)\\\]/g, (_, inner) => katex.renderToString(inner, { displayMode: true }))
        .replace(/\\\((.*?)\\\)/g, (_, inner) =>
            katex.renderToString(inner, { displayMode: false })
        );
}

/**
 * Formats text based on the format specified in the text object
 * @param text Text object to format
 * @returns Formatted text
 * @throws Error if the text format is not supported
 * @see TextFormat
 * @see TextTypeOptions
 * @see TemplateOptions
 * @see formatLatex
 * @see marked
 * @see katex
 */
export function FormattedTextTemplate(formattedText: TextFormat): string {
    const formatText = formatLatex(formattedText.text.trim());  // latex needs pure "&", ">", etc. Must not be escaped
    let parsedText = ''; 
    let result = '';
    switch (formattedText.format) {
        case '':
        case 'moodle':
        case 'plain':
            // Replace newlines with <br> tags
            result = formatText.replace(/(?:\r\n|\r|\n)/g, '<br>');
            break;
        case 'html':
            // Strip outer paragraph tags (not a great approach with regex)
            result = formatText.replace(/(^<p>)(.*?)(<\/p>)$/gm, '$2');
            break;
        case 'markdown':
            parsedText = marked.parse(formatText, { breaks: true, gfm: true }) as string; // <br> for newlines
            result = parsedText.replace(/(^<p>)(.*?)(<\/p>)$/gm, '$2');
            break;
        default:
            throw new Error(`Unsupported text format: ${formattedText.format}`);
    }
    return DOMPurify.sanitize(result);
}
