import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from '../../shared/services/question.service';
import { Question } from '../../shared/services/question.model';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-manage-questions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-questions.component.html',
  styleUrls: ['./manage-questions.component.css']
})
export class ManageQuestionsComponent implements OnInit {
  questions: Question[] = [];
  questionForm = this.fb.group({
    text: ['', Validators.required],
    options: ['', Validators.required]
  });
  editingQuestion: Question | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loading = true;
    this.questionService.getQuestions().subscribe(
      questions => {
        this.questions = questions;
        this.loading = false;
      },
      (error: HttpErrorResponse) => this.handleError(error)
    );
  }

  addQuestion(): void {
    if (this.questionForm.valid) {
      this.loading = true;
      const newQuestion: Question = {
        id: 0, // Temporary ID, should be set by the server
        text: this.questionForm.value.text || ''
      };
      this.questionService.addQuestion(newQuestion).subscribe(
        question => {
          this.questions.push(question);
          this.questionForm.reset();
          this.loading = false;
        },
        (error: HttpErrorResponse) => this.handleError(error)
      );
    }
  }

  editQuestion(question: Question): void {
    this.editingQuestion = question;
    this.questionForm.patchValue({
      text: question.text
    });
  }

  updateQuestion(): void {
    if (this.questionForm.valid && this.editingQuestion) {
      this.loading = true;
      const updatedQuestion: Question = {
        ...this.editingQuestion,
        text: this.questionForm.value.text || ''
      };

      this.questionService.editQuestion(updatedQuestion).subscribe(
        question => {
          const index = this.questions.findIndex(q => q.id === this.editingQuestion!.id);
          if (index !== -1) {
            this.questions[index] = question;
          }
          this.loading = false;
          this.cancelEdit();
        },
        (error: HttpErrorResponse) => this.handleError(error)
      );
    } else {
      console.error("Editing question is null or form is invalid.");
    }
  }

  deleteQuestion(questionId: number): void {
    this.loading = true;
    this.questionService.deleteQuestion(questionId).subscribe(
      () => {
        this.questions = this.questions.filter(question => question.id !== questionId);
        this.loading = false;
      },
      (error: HttpErrorResponse) => this.handleError(error)
    );
  }

  cancelEdit(): void {
    this.editingQuestion = null;
    this.questionForm.reset();
  }

  private handleError(error: HttpErrorResponse): void {
    this.errorMessage = error.error instanceof ErrorEvent
      ? `Error: ${error.error.message}`
      : `Error Code: ${error.status}\nMessage: ${error.message}`;
    this.loading = false;
  }
}