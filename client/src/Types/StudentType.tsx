export interface Answer {
    answer: string | number | boolean;
    isCorrect: boolean;
    idQuestion: number;
}

export interface StudentType {
    name: string;
    id: string;
    room?: string;
    answers: Answer[];
}
