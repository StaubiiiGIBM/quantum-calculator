import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  private expression: string = '';
  private inaccuracyPercentage: number = 1;

  constructor() {}

  addValue(value: string): void {
    this.expression += value;
  }

  getExpression(): string {
    return this.expression;
  }

  clear(): void {
    this.expression = '';
  }

  calculate(): { result: number; inaccurateResult: number; inaccuracyPercentage: number } {
    try {
      // Trim expression
      let exp = this.expression.trim();

      if (!exp) {
        throw new Error('Empty expression');
      }

      // Replace operators with their JavaScript equivalents
      // This is safer than direct eval but still allows basic math
      exp = exp.replace(/÷/g, '/').replace(/×/g, '*');

      // eslint-disable-next-line no-eval
      const result = eval(exp);

      if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
        throw new Error('Invalid calculation result');
      }

      // Calculate inaccuracy (random between 0% and max inaccuracy percentage)
      const randomInaccuracyPercentage = this.inaccuracyPercentage * Math.random();
      const inaccuracy = (result * randomInaccuracyPercentage) / 100;
      const inaccurateResult =
        result + (Math.random() > 0.5 ? inaccuracy : -inaccuracy);

      return {
        result: Math.round(result * 100) / 100,
        inaccurateResult: Math.round(inaccurateResult * 100) / 100,
        inaccuracyPercentage: Math.round(randomInaccuracyPercentage * 100) / 100,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid expression';
      throw new Error(message);
    }
  }

  setInaccuracyPercentage(percentage: number): void {
    this.inaccuracyPercentage = Math.max(0, Math.min(100, percentage));
  }
}
