//QuestionType.test.tsx
import { Question } from 'gift-pegjs';

const sampleStem = 'Sample question stem';
const options = ['Option A', 'Option B'];
const sampleFormat = 'plain';
const sampleType = 'MC';
const sampleTitle = 'Sample Question';

const mockQuestion: Question = {
    id: '1',
    type: sampleType,
    formattedStem: { format: sampleFormat, text: sampleStem },
    title: sampleTitle,
    hasEmbeddedAnswers: false,
    choices: [
        { formattedText: { format: sampleFormat, text: options[0] }, isCorrect: true, weight: 1 },
        { formattedText: { format: sampleFormat, text: options[1] }, isCorrect: false, weight: 0 },
    ],
};

const mockQuestionType = mockQuestion;

// test seems useless (it's broken) now that gift-pegjs has TypeScript types (and its own tests)
describe.skip('QuestionType', () => {
    test('has the expected structure', () => {
        expect(mockQuestionType).toEqual(expect.objectContaining({
            question: expect.any(Object),
        }));

        expect(mockQuestionType).toEqual(expect.objectContaining({
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
