import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CalculatorService } from '../services/calculator.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-calculator',
  templateUrl: 'calculator.page.html',
  styleUrls: ['calculator.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    CommonModule,
  ],
})
export class CalculatorPage {
  expression: string = '';
  buttons = [
    '7',
    '8',
    '9',
    '/',
    '4',
    '5',
    '6',
    '*',
    '1',
    '2',
    '3',
    '-',
    '0',
    '.',
    '=',
    '+',
  ];

  constructor(
    private calculatorService: CalculatorService,
    private storageService: StorageService,
    private router: Router
  ) {}

  onButtonClick(value: string): void {
    if (value === '=') {
      this.calculate();
    } else if (value === 'C') {
      this.clear();
    } else {
      this.calculatorService.addValue(value);
      this.updateDisplay();
    }
  }

  updateDisplay(): void {
    this.expression = this.calculatorService.getExpression();
  }

  clear(): void {
    this.calculatorService.clear();
    this.updateDisplay();
  }

  async calculate(): Promise<void> {
    // Validate expression is not empty
    if (!this.expression || this.expression.trim() === '') {
      this.expression = 'Error: Empty expression';
      setTimeout(() => (this.expression = ''), 2000);
      return;
    }

    // Validate expression has valid characters
    if (!/^[0-9+\-*/.\s()]+$/.test(this.expression)) {
      this.expression = 'Error: Invalid characters';
      setTimeout(() => (this.expression = ''), 2000);
      return;
    }

    let result: number;
    let inaccurateResult: number;

    // Attempt calculation
    try {
      const res = this.calculatorService.calculate();
      result = res.result;
      inaccurateResult = res.inaccurateResult;
    } catch (err) {
      console.error('Calculation eval error:', err);
      this.expression = 'Error: Invalid expression';
      setTimeout(() => (this.expression = ''), 2000);
      return;
    }

    const hasImage = this.storageService.getImage() !== null;
    const imageData = hasImage ? (this.storageService.getImage() ?? undefined) : undefined;

    // Save calculation (do not fail navigation if cloud save fails)
    try {
      await this.storageService.saveCalculation({
        expression: this.expression,
        result: inaccurateResult,
        imageData: undefined,
        inaccuracy: 1,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Save calculation error (continuing):', err);
      // proceed even if save to Supabase fails
    }

    // Navigate to loading screen with state
    try {
      await this.router.navigate(['/tabs/processing'], {
        state: {
          expression: this.expression,
          actualResult: result,
          displayResult: inaccurateResult,
          hasImage,
          imageData,
        },
      });
    } catch (err) {
      // Attempt fallback navigation by URL
      try {
        await this.router.navigateByUrl('/tabs/processing');
      } catch (err2) {
        console.error('Fallback navigation failed:', err2);
      }
    }

    // Clear local expression after flow started
    this.clear();
  }

  isOperator(value: string): boolean {
    return ['+', '-', '*', '/', '='].includes(value);
  }
}
