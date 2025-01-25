import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrueFalse from 'src/components/GiftTemplate/templates';
import { TemplateOptions } from 'src/components/GiftTemplate/templates/types';
import { parse, ShortAnswerQuestion, TrueFalseQuestion } from 'gift-pegjs';

// Mock the nanoid function
jest.mock('nanoid', () => ({
    nanoid: jest.fn(() => 'mocked-id')
}));

const plainTextMock: TemplateOptions & TrueFalseQuestion =
    parse(`::Sample True/False Title::Sample Stem {T#Correct!#Incorrect!####Sample Global Feedback}`)[0] as TrueFalseQuestion;

const katexMock: TemplateOptions & TrueFalseQuestion =
    parse(`::Sample True/False Title::$$\\frac{zzz}{yyy}$$ {T#Correct!#Incorrect!####Sample Global Feedback}`)[0] as TrueFalseQuestion;

const moodleMock: TemplateOptions & TrueFalseQuestion =
    parse(`::Sample True/False Title::[moodle]Sample Stem{TRUE#Correct!#Incorrect!####Sample Global Feedback}`)[0] as TrueFalseQuestion;

const imageMock: TemplateOptions & ShortAnswerQuestion =
    parse(`::Sample Short Answer Title with Image::
        [markdown]Sample Stem with Image ![](https\\://example.com/cat.gif)
        {=A =B =C####[html]<img src="https\\://via.placeholder.com/150" alt="Sample Image" />}`)[0] as ShortAnswerQuestion;

test('TrueFalse snapshot test with plain text', () => {
    const { asFragment } = render(<TrueFalse {...plainTextMock} />);
    expect(asFragment()).toMatchSnapshot();
});

test('TrueFalse snapshot test with katex', () => {
    const { asFragment } = render(<TrueFalse {...katexMock} />);
    expect(asFragment()).toMatchSnapshot();
});

test('TrueFalse snapshot test with moodle', () => {
    const { asFragment } = render(<TrueFalse {...moodleMock} />);
    expect(asFragment()).toMatchSnapshot();
});

test('TrueFalse snapshot test with image', () => {
    const { asFragment } = render(<TrueFalse {...imageMock} />);
    expect(asFragment()).toMatchSnapshot();
});
