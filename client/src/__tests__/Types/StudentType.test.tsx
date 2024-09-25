//StudentType.test.tsx
import { StudentType } from "../../Types/StudentType";

const user : StudentType = {
    name: 'Student',
    id: '123'
}

describe('StudentType', () => {
    test('creates a student with name and id', () => {

        expect(user.name).toBe('Student');
        expect(user.id).toBe('123');
    });
});
