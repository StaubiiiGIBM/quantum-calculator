import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonProgressBar,
  IonText,
  IonImg,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-processing',
  templateUrl: 'processing.page.html',
  styleUrls: ['processing.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonProgressBar,
    IonText,
    IonImg,
    IonCard,
    IonCardContent,
    CommonModule,
  ],
})
export class ProcessingPage implements OnInit, OnDestroy {
  progress: number = 0;
  currentMessage: string = '';
  hasImage: boolean = false;
  imageData: string | null = null;
  actualResult: number | null = null;
  displayResult: number | null = null;
  expression: string | null = null;
  messageIndex: number = 0;

  messages = [
    'Processing your calculation...',
    'Analyzing patterns...',
    'Booting up Quantum Computer...',
    'Establishing qubit entanglement...',
    'Optimizing superposition states...',
    'Calibrating quantum gates...',
    'Minimizing decoherence...',
    'Running Shor\'s algorithm...',
    'Simulating quantum circuits...',
    'Detected Quantum Computer Crash...',
    'Evaluating alternative possibilities...',
    'Quering ChatGPT for help...',
    'Reviving Albert Einstein...',
    'Consulting Schrödinger\'s cat...',
    'Reading the stars...',
    'Summarizing...',
  ];

  private timer: any;
  private messageTimer: any;
  private lastNavigationState: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initial setup (runs only once on component creation)
    // Capture navigation state on first init
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.lastNavigationState = nav.extras.state;
    }
    this.clearTimers();
  }

  // Called every time view is entered
  ionViewWillEnter(): void {
    // Try to get fresh navigation state, or fall back to last captured state
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state ?? this.lastNavigationState ?? (window as any).history.state;
    
    if (state && state.expression) {
      this.hasImage = state['hasImage'] || false;
      this.imageData = state['imageData'] || null;
      this.actualResult = state['actualResult'] ?? null;
      this.displayResult = state['displayResult'] ?? null;
      this.expression = state['expression'] ?? null;
      this.lastNavigationState = state;
    } else {
      console.log('No navigation state found, using previous values');
    }

    // Reset state before starting new loading animation
    this.clearTimers();
    this.progress = 0;
    this.messageIndex = 0;
    this.currentMessage = '';

    this.startLoading();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private startLoading(): void {
    const randomDuration = 30000 + Math.random() * 30000; // 30-60 seconds
    const startTime = Date.now();

    // Show messages at intervals
    this.showNextMessage();
    this.messageTimer = setInterval(() => this.showNextMessage(), Math.max(1000, randomDuration / this.messages.length));

    // Update progress bar
    this.timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      this.progress = Math.min(elapsed / randomDuration, 1);

      if (this.progress >= 1) {
        this.clearTimers();
        this.navigateToResult();
      }
    }, 100);
  }

  private showNextMessage(): void {
    this.currentMessage =
      this.messages[this.messageIndex % this.messages.length];
    this.messageIndex++;
  }

  private clearTimers(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.messageTimer) {
      clearInterval(this.messageTimer);
    }
  }

  private navigateToResult(): void {
    // Pass display/actual result to Result Page so it can show the same inaccurate value
    try {
      this.router.navigate(['/tabs/result'], {
        state: {
          expression: this.expression,
          actualResult: this.actualResult,
          displayResult: this.displayResult,
        },
      });
    } catch (err) {
      // fallback: simple navigation
      this.router.navigateByUrl('/tabs/result');
    }
  }
}
