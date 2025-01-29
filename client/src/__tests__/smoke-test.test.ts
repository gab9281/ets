import { parse, NumericalQuestion, SimpleNumericalAnswer,  } from "gift-pegjs";
import { isSimpleNumericalAnswer } from "gift-pegjs/typeGuards";

describe('Numerical Question Tests', () => {
    // ::Ulysses birthdate::When was Ulysses S. Grant born? {#1822}
    it('should produce a valid Question object for a Numerical question with Title', () => {
        const input = `
          ::Ulysses birthdate::When was Ulysses S. Grant born? {#1822}
        `;
        const result = parse(input);

        // Type assertion to ensure result matches the Question interface
        const question = result[0];

        // Example assertions to check specific properties
        expect(question).toHaveProperty('type', 'Numerical');
        const numericalQuestion = question as NumericalQuestion;
        expect(numericalQuestion.title).toBe('Ulysses birthdate');
        expect(numericalQuestion.formattedStem.text).toBe('When was Ulysses S. Grant born?');
        expect(numericalQuestion.choices).toBeDefined();
        expect(numericalQuestion.choices).toHaveLength(1);

        const choice = numericalQuestion.choices[0];
        expect(isSimpleNumericalAnswer(choice)).toBe(true);
        const c = choice as SimpleNumericalAnswer;
        expect(c.type).toBe('simple');
        expect(c.number).toBe(1822);

    });
});
