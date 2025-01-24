import { marked } from 'marked';
import katex from 'katex';
import { TextFormat } from 'gift-pegjs';


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
export function textType(formattedText: TextFormat): string {
    const formatText = formatLatex(formattedText.text.trim());  // latex needs pure "&", ">", etc. Must not be escaped
    let parsedText = ''; 
    switch (formattedText.format) {
        case 'moodle':
        case 'plain':
            // Replace newlines with <br> tags
            return formatText.replace(/(?:\r\n|\r|\n)/g, '<br>');
        case 'html':
            // Strip outer paragraph tags (not a great approach with regex)
            return formatText.replace(/(^<p>)(.*?)(<\/p>)$/gm, '$2');
        case 'markdown':
            parsedText = marked.parse(formatText, { breaks: true }) as string; // https://github.com/markedjs/marked/discussions/3219
            return parsedText.replace(/(^<p>)(.*?)(<\/p>)$/gm, '$2');
        default:
            throw new Error(`Unsupported text format: ${formattedText.format}`);
    }
}
