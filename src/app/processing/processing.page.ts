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
  IonButton,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalNotifications } from '@capacitor/local-notifications';

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
    IonButton,
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
  async ionViewWillEnter(): Promise<void> {
    // Hide the tab bar while processing
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar) {
      tabBar.style.display = 'none';
    }

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

    // Prepare notifications (request permission and create channel)
    try {
      await this.prepareNotifications();
    } catch (e) {
      // ignore notification setup errors; app should continue
      console.warn('Notification setup failed', e);
    }

    this.startLoading();
  }

  ngOnDestroy(): void {
    this.clearTimers();
    // Show the tab bar again when leaving
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar) {
      tabBar.style.display = '';
    }
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
        // fire notification then navigate
        this.onProcessingComplete();
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
    // Restore the navigation before navigating away
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar) {
      tabBar.style.display = '';
    }

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

  private async onProcessingComplete(): Promise<void> {
    try {
      await this.sendCompletionNotification();
    } catch (e) {
      // ignore notification errors
      console.warn('Failed to send completion notification', e);
    }

    this.navigateToResult();
  }

  private async prepareNotifications(): Promise<void> {
    try {
      // Request permission to show notifications
      const perm = await LocalNotifications.requestPermissions();
      if (perm && perm.display === 'granted') {
        // Create an Android channel (no-op on iOS)
        try {
          await LocalNotifications.createChannel({
            id: 'calculations',
            name: 'Calculations',
            importance: 5,
            description: 'Notifications when calculations complete',
          });
        } catch (e) {
          // some platforms may not support channels programmatically; continue
        }
      }
    } catch (e) {
      // ignore
      console.warn('LocalNotifications permission request failed', e);
    }
  }

  private async sendCompletionNotification(): Promise<void> {
    try {
      const id = Math.floor(Date.now() % 100000);
      await LocalNotifications.schedule({
        notifications: [
          {
            id,
            title: 'Calculation completed',
            body: 'Calculation completed — check the app for the result',
            smallIcon: undefined,
            largeIcon: undefined,
            channelId: 'calculations',
            extra: { expression: this.expression },
          },
        ],
      });
    } catch (e) {
      console.warn('Failed to schedule local notification', e);
    }
  }

  cancelProcessing(): void {
    // Clear timers and show tab bar again
    this.clearTimers();
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar) {
      tabBar.style.display = '';
    }
    // Navigate back to calculator
    this.router.navigate(['/tabs/calculator']);
  }
}
