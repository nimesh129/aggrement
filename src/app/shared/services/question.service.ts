import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Question } from './question.model'; // Ensure the correct path to your model

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'https://example.com/api/questions'; // Consider moving this to a config file

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  addQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question).pipe(
      catchError(this.handleError)
    );
  }

  editQuestion(question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${question.id}`, question).pipe(
      catchError(this.handleError)
    );
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Change this method to public
  public handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}