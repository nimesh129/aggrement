// src/app/admin/survey-management/survey-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuestionService } from '../../shared/services/question.service';
import { ClientResponse } from '../../shared/services/question.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-survey-management',
  templateUrl: './survey-management.component.html',
  styleUrls: ['./survey-management.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SurveyManagementComponent implements OnInit {
  responses: ClientResponse[] = [];
  selectedResponse: ClientResponse | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;
  modalOpen: boolean = false;

  constructor(
    private questionService: QuestionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadResponses();
  }

  loadResponses(): void {
    this.loading = true;
    this.errorMessage = null;
    
    // this.questionService.getResponses().subscribe({
    //   next: (data) => {
    //     this.responses = data;
    //     this.loading = false;
    //   },
    //   error: (error: HttpErrorResponse) => this.handleError(error)
    // });
  }

  viewResponse(response: ClientResponse): void {
    this.selectedResponse = response;
    this.modalOpen = true;
  }

  closeModal(): void {
    this.selectedResponse = null;
    this.modalOpen = false;
  }

  updateStatus(response: ClientResponse, status: 'approved' | 'rejected'): void {
    if (!response.id) {
      this.errorMessage = 'Invalid response ID';
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    
    // this.questionService.updateResponseStatus(response.id, status).subscribe({
    //   next: () => {
    //     const index = this.responses.findIndex(r => r.id === response.id);
    //     if (index !== -1) {
    //       this.responses[index] = { ...response, status };
    //     }
    //     this.loading = false;
    //   },
    //   error: (error: HttpErrorResponse) => this.handleError(error)
    // });
  }

  deleteResponse(id: number): void {
    if (confirm('Are you sure you want to delete this response?')) {
      this.loading = true;
      this.errorMessage = null;
      
      // this.questionService.deleteResponse(id).subscribe({
      //   next: () => {
      //     this.responses = this.responses.filter(response => response.id !== id);
      //     this.loading = false;
      //   },
      //   error: (error: HttpErrorResponse) => this.handleError(error)
      // });
    }
  }

  // Helper methods
  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'badge-warning',
      'approved': 'badge-success',
      'rejected': 'badge-danger'
    };
    return statusMap[status.toLowerCase()] || 'badge-secondary';
  }

  isVideoPlayable(url: string): boolean {
    return Boolean(url && url.trim().length > 0);
  }

  // Error handling
  private handleError(error: HttpErrorResponse): void {
    this.loading = false;
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      this.errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      this.errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error('An error occurred:', error);
  }

  // Navigation methods
  // navigateTo Home(): void {
  //   this.router.navigate(['/']);
  // }
}