import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../shared/services/question.service';
import { Question } from '../../shared/services/question.model';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ClientFormComponent implements OnInit, OnDestroy {
  @ViewChild('videoPreview') videoPreview!: ElementRef<HTMLVideoElement>;

  clientInfo = {
    name: '',
    address: '',
    email: ''
  };

  questions: Question[] = [];
  currentQuestionIndex = 0;
  currentStep = 'info';
  videoRecorded = false;
  isRecording = false;
  recordingTime = 0;
  videoUrl = '';
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  timerInterval: any;
  stream: MediaStream | null = null;

  // Speech properties
  private speechSynthesis: SpeechSynthesis;
  private speechRecognition: any;
  isListening: boolean = false;
  isSpeaking: boolean = false;

  constructor(
    private questionService: QuestionService,
    private http: HttpClient
  ) {
    // Initialize speech synthesis
    this.speechSynthesis = window.speechSynthesis;
    
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      this.speechRecognition = new (window as any).webkitSpeechRecognition();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = false;
      
      this.speechRecognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase();
        
        if (command.includes('next') || command.includes('next question')) {
          if (this.videoRecorded) {
            this.proceedToNext();
          }
        } else if (command.includes('stop') || command.includes('stop recording')) {
          if (this.isRecording) {
            this.stopRecording();
          }
        } else if (command.includes('start') || command.includes('start recording')) {
          if (!this.isRecording && !this.videoRecorded) {
            this.startRecording();
          }
        } else if (command.includes('repeat') || command.includes('repeat question')) {
          this.speakCurrentQuestion();
        }
      };
    }
  }

  ngOnInit() {
    this.loadQuestions();
  }

  ngOnDestroy() {
    this.stopListening();
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    clearInterval(this.timerInterval);
  }

  startListening() {
    if (this.speechRecognition) {
      this.isListening = true;
      this.speechRecognition.start();
    }
  }

  stopListening() {
    if (this.speechRecognition) {
      this.isListening = false;
      this.speechRecognition.stop();
    }
  }

  speakText(text: string) {
    if (this.speechSynthesis) {
      // Cancel any ongoing speech
      this.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text );
      utterance.rate = 0.9; // Slightly slower speed
      utterance.pitch = 1;
      this.speechSynthesis.speak(utterance);
    }
  }

  speakCurrentQuestion() {
    if (this.currentQuestion) {
      this.speakText(this.currentQuestion.text);
    }
  }

  loadQuestions() {
    this.questionService.getQuestions().subscribe({
      next: (data) => {
        this.questions = data;
        if (this.questions.length > 0) {
          setTimeout(() => {
            this.speakText(this.questions[0].text);
          }, 1000);
        }
      },
      error: (error) => {
        console.error('Error loading questions:', error);
      }
    });
  }

  startQuestions() {
    if (this.validateClientInfo()) {
      this.currentStep = 'questions';
      this.startListening();
    }
  }

  validateClientInfo(): boolean {
    if (!this.clientInfo.name || !this.clientInfo.address || !this.clientInfo.email) {
      alert('Please fill in all required fields');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.clientInfo.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    return true;
  }

  async startRecording() {
    try {
      // Stop any existing stream
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }

      // Get new media stream
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Set up video preview
      if (this.videoPreview && this.videoPreview.nativeElement) {
        this.videoPreview.nativeElement.srcObject = this.stream;
        await this.videoPreview.nativeElement.play();
      }

      // Initialize recording
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.videoUrl = URL.createObjectURL(blob);
        this.videoRecorded = true;
        this.isRecording = false;

        // Stop all tracks
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
        }
      };

      // Start recording
      this.mediaRecorder.start();
      this.isRecording = true;
      this.recordingTime = 0;
      this.timerInterval = setInterval(() => { this.recordingTime++; }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      clearInterval(this.timerInterval);
    }
  }

  retakeVideo() {
    this.videoRecorded = false;
    this.videoUrl = '';
    this.recordedChunks = [];
    this.mediaRecorder = null;
    this.stream = null;
  }

  proceedToNext() {
    if (this.isLastQuestion) {
      this.submitForm();
    } else {
      this.currentQuestionIndex++;
      this.videoRecorded = false;
      this.videoUrl = '';
      this.speakCurrentQuestion();
    }
  }

  get isLastQuestion() {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  get currentQuestion() {
    return this.questions[this.currentQuestionIndex];
  }

  submitForm() {
    const formData = new FormData();
    formData.append('clientInfo', JSON.stringify(this.clientInfo));
    formData.append('responses', JSON.stringify(this.questions.map((question) => ({
      questionId: question.id,
      videoUrl: this.videoUrl
    }))));

    this.http.post('api/survey/submit', formData).subscribe({
      next: () => {
        console.log('Form submitted successfully!');
        this.currentStep = 'complete';
      },
      error: (error) => {
        console.error('Error submitting form:', error);
      }
    });
  }
}