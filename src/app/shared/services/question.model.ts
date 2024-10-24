// src/app/shared/services/question.model.ts

// Existing Question interface
export interface Question {
    id: number;
    text: string;
}

// New ClientResponse interface
export interface ClientResponse {
    id: number;
    clientName: string;
    clientEmail: string;
    submissionDate: Date;
    status: ResponseStatus;
    questionResponses: QuestionResponse[];
}

// Response for each question
export interface QuestionResponse {
    questionId: number;
    question?: Question;
    videoUrl: string;
}

// Response status type
export type ResponseStatus = 'pending' | 'approved' | 'rejected';