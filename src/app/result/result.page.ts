import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonText,
  IonButton,
  IonIcon,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { StorageService, CalculationRecord } from '../services/storage.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { book } from 'ionicons/icons';

@Component({
  selector: 'app-result',
  templateUrl: 'result.page.html',
  styleUrls: ['result.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonText,
    IonButton,
    IonIcon,
    IonModal,
    IonList,
    IonItem,
    IonLabel,
    CommonModule,
  ],
})
export class ResultPage implements OnInit {
  latestCalculation: CalculationRecord | null = null;
  calculationHistory: CalculationRecord[] = [];
  showHistory: boolean = false;
  // Value to display (from history)
  displayValue: number | null = null;
  displayExpression: string | null = null;

  constructor(private storageService: StorageService, private router: Router) {
    addIcons({ book });
  }

  ngOnInit(): void {
    // Initial load - just display what's in history
    this.loadLatestCalculation();
  }

  // Called every time view is entered (Ionic lifecycle) — refreshes when returning from Processing
  ionViewWillEnter(): void {
    this.loadLatestCalculation();
  }

  loadLatestCalculation(): void {
    this.latestCalculation = this.storageService.getLatestCalculation();

    // Simply display the result from history (which is already the inaccurate value)
    if (this.latestCalculation) {
      this.displayValue = this.latestCalculation.result;
      this.displayExpression = this.latestCalculation.expression;
    }
  }

  openHistory(): void {
    this.calculationHistory = this.storageService.getHistory();
    this.showHistory = true;
  }

  closeHistory(): void {
    this.showHistory = false;
  }

  goToCamera(): void {
    this.router.navigate(['/tabs/camera']);
  }

  goToCalculator(): void {
    this.router.navigate(['/tabs/calculator']);
  }

  getFormattedDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  clearHistory(): void {
    if (confirm('Are you sure you want to clear all history?')) {
      this.storageService.clearHistory();
      this.calculationHistory = [];
      this.latestCalculation = null;
      this.displayValue = null;
      this.displayExpression = null;
    }
  }
}
