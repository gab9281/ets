import { marked } from 'marked';
import katex from 'katex';
import { TemplateOptions, TextFormat } from './types';

interface TextTypeOptions extends TemplateOptions {
    text: TextFormat;
}

function formatLatex(text: string): string {
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
export default function TextType({ text }: TextTypeOptions): string {
    const formatText = formatLatex(text.text.trim());  // latex needs pure "&", ">", etc. Must not be escaped

    switch (text.format) {
        case 'moodle':
        case 'plain':
            // Replace newlines with <br> tags
            return formatText.replace(/(?:\r\n|\r|\n)/g, '<br>');
        case 'html':
            // Strip outer paragraph tags (not a great approach with regex)
            return formatText.replace(/(^<p>)(.*?)(<\/p>)$/gm, '$2');
        case 'markdown':
            return (
                marked
                    .parse(formatText, { breaks: true }) // call marked.parse instead of marked
                    // Strip outer paragraph tags
                    .replace(/(^<p>)(.*?)(<\/p>)$/gm, '$2')
            );
        default:
            throw new Error(`Unsupported text format: ${text.format}`);
    }
}
