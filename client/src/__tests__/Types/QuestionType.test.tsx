//QuestionType.test.tsx
import { GIFTQuestion } from 'gift-pegjs';
import { QuestionType } from '../../Types/QuestionType';

const sampleStem = 'Sample question stem';
const options = ['Option A', 'Option B'];
const sampleFormat = 'plain';
const sampleType = 'MC';
const sampleTitle = 'Sample Question';

const mockQuestion: GIFTQuestion = {
    id: '1',
    type: sampleType,
    stem: { format: sampleFormat, text: sampleStem },
    title: sampleTitle,
    hasEmbeddedAnswers: false,
    globalFeedback: null,
    choices: [
        { text: { format: sampleFormat, text: options[0] }, isCorrect: true, weight: 1, feedback: null },
        { text: { format: sampleFormat, text: options[1] }, isCorrect: false, weight: 0, feedback: null },
    ],
};

const mockQuestionType: QuestionType = {
    question: mockQuestion,
};

describe('QuestionType', () => {
    test('has the expected structure', () => {
        expect(mockQuestionType).toEqual(expect.objectContaining({
            question: expect.any(Object),
        }));

        expect(mockQuestionType.question).toEqual(expect.objectContaining({
            id: expect.any(String),
            type: expect.any(String),
            stem: expect.objectContaining({
                format: sampleFormat,
                text: sampleStem,
            }),
            title: expect.any(String),
            hasEmbeddedAnswers: expect.any(Boolean),
            globalFeedback: expect.any(Object),
            choices: expect.any(Array),
        }));
    });
});
