import { marked } from 'marked';
import katex from 'katex';
import { TemplateOptions, TextFormat } from './types';

interface TextTypeOptions extends TemplateOptions {
    text: TextFormat;
}

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
export default function textType({ text }: TextTypeOptions) {
    const formatText = formatLatex(text.text.trim());  // latex needs pure "&", ">", etc. Must not be escaped
    let parsedText = ''; 
    switch (text.format) {
        case 'moodle':
        case 'plain':
            // Replace newlines with <br> tags
            return replaceNewlinesOutsideSVG(formatText);
        case 'html':
            // Strip outer paragraph tags (not a great approach with regex)
            return formatText.replace(/(^<p>)(.*?)(<\/p>)$/gm, '$2');
        case 'markdown':
            parsedText = marked.parse(formatText, { breaks: true }) as string; // https://github.com/markedjs/marked/discussions/3219
            return parsedText.replace(/(^<p>)(.*?)(<\/p>)$/gm, '$2');
        default:
            throw new Error(`Unsupported text format: ${text.format}`);
    }
}

// Function to replace \n outside of SVG paths
function replaceNewlinesOutsideSVG(text: string): string {
    const svgPathRegex = /<path[^>]*d="([^"]*)"[^>]*>/g;
    let result = '';
    let lastIndex = 0;

    // Iterate over all SVG paths
    text.replace(svgPathRegex, (match, _p1, offset) => {
        // Append text before the SVG path, replacing \n with <br>
        result += text.slice(lastIndex, offset).replace(/(?:\r\n|\r|\n)/g, '<br>');
        // Append the SVG path without replacing \n
        result += match;
        // Update the last index
        lastIndex = offset + match.length;
        return match;
    });

    // Append the remaining text, replacing \n with <br>
    result += text.slice(lastIndex).replace(/(?:\r\n|\r|\n)/g, '<br>');
    return result;
}
