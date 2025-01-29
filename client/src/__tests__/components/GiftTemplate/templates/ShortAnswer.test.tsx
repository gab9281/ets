import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShortAnswer from 'src/components/GiftTemplate/templates/ShortAnswerTemplate';
import { TemplateOptions } from 'src/components/GiftTemplate/templates/types';
import { parse, ShortAnswerQuestion } from 'gift-pegjs';

// Mock the nanoid function
jest.mock('nanoid', () => ({
    nanoid: jest.fn(() => 'mocked-id')
  }));

const plainTextMock: TemplateOptions & ShortAnswerQuestion = 
    parse(`
    ::Sample Short Answer Title:: Sample Stem {=%1%Answer 1#Correct! =%1%Answer 2#Correct!####Sample Global Feedback}
        `)[0] as ShortAnswerQuestion;

const katexMock: TemplateOptions & ShortAnswerQuestion = 
    parse(`
    ::Sample Short Answer Title:: $$\\frac\\{zzz\\}\\{yyy\\}$$ {=%1%Answer 1#Correct! =%1%Answer 2#Correct!####[html]Sample Global Feedback}
        `)[0] as ShortAnswerQuestion;


const moodleMock: TemplateOptions & ShortAnswerQuestion = 
    parse(`
    ::Sample Short Answer Title:: Sample Stem {=%1%Answer 1#Correct! =%1%Answer 2#Correct!####[moodle]Sample Global Feedback}
        `)[0] as ShortAnswerQuestion;

const imageMock: TemplateOptions & ShortAnswerQuestion = 
    parse(`
    ::Sample Short Answer Title with Image::[markdown]Sample Stem with Image ![](https\\://example.com/cat.jpg) {=%1%Answer 1#Correct! =%1%Answer 2#Correct!####Sample Global Feedback with Image}
        `)[0] as ShortAnswerQuestion;

test('ShortAnswer snapshot test with plain text', () => {
    const { asFragment } = render(<ShortAnswer {...plainTextMock} />);
    expect(asFragment()).toMatchSnapshot();
});

test('ShortAnswer snapshot test with katex', () => {
    const { asFragment } = render(<ShortAnswer {...katexMock} />);
    expect(asFragment()).toMatchSnapshot();
});

test('ShortAnswer snapshot test with moodle', () => {
    const { asFragment } = render(<ShortAnswer {...moodleMock} />);
    expect(asFragment()).toMatchSnapshot();
});

test('ShortAnswer snapshot test with image', () => {
    const { asFragment } = render(<ShortAnswer {...imageMock} />);
    expect(asFragment()).toMatchSnapshot();
});
