import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Numerical from 'src/components/GiftTemplate/templates/NumericalTemplate';
import { TemplateOptions } from 'src/components/GiftTemplate/templates/types';
import { parse, NumericalQuestion } from 'gift-pegjs';

// Mock the nanoid function
jest.mock('nanoid', () => ({
    nanoid: jest.fn(() => 'mocked-id')
  }));

const plainTextMock: TemplateOptions & NumericalQuestion = 
    parse(`
    ::Sample Numerical Title:: Sample Stem {#=42#Correct!=43#Incorrect!####Sample Global Feedback}
        `)[0] as NumericalQuestion;

const htmlMock: TemplateOptions & NumericalQuestion = 
    parse(`
        ::Sample Numerical Title::
        [html]$$\\frac\\{zzz\\}\\{yyy\\}$$ {#
            =42#Correct
            =43#Incorrect!
            ####Sample Global Feedback
        }
    `)[0] as NumericalQuestion;

const moodleMock: TemplateOptions & NumericalQuestion = 
    parse(`
        ::Sample Numerical Title::[moodle]Sample Stem {#=42#Correct!=43#Incorrect!####Sample Global Feedback}
    `)[0] as NumericalQuestion;

const imageMock: TemplateOptions & NumericalQuestion = 
    parse(`
        ::Sample Numerical Title with Image::[markdown]Sample Stem with Image ![](https\\://example.com/cat.jpg){#=42#Correct!=43#Incorrect!=44#Also Incorrect! ![](https\\://example.com/cat.jpg)####Sample Global Feedback with Image}
    `)[0] as NumericalQuestion;


test('Numerical snapshot test with plain text', () => {
    const { asFragment } = render(<Numerical {...plainTextMock} />);
    expect(asFragment()).toMatchSnapshot();
});

test('Numerical snapshot test with html', () => {
    const { asFragment } = render(<Numerical {...htmlMock} />);
    expect(asFragment()).toMatchSnapshot();
});

test('Numerical snapshot test with moodle', () => {
    const { asFragment } = render(<Numerical {...moodleMock} />);
    expect(asFragment()).toMatchSnapshot();
});

test('Numerical snapshot test with image', () => {
    const { asFragment } = render(<Numerical {...imageMock} />);
    expect(asFragment()).toMatchSnapshot();
});
