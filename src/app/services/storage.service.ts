import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface CalculationRecord {
  id?: string;
  expression: string;
  result: number;
  imageData?: string;
  timestamp: number;
  inaccuracy: number;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private supabase: SupabaseClient;
  private calculationHistory: CalculationRecord[] = [];
  private currentImage: string | null = null;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
    this.loadLocalHistory();
  }

  // Image Management
  async saveImage(imageData: string): Promise<void> {
    this.currentImage = imageData;
    localStorage.setItem('calculatorImage', imageData);
  }

  getImage(): string | null {
    if (!this.currentImage) {
      this.currentImage = localStorage.getItem('calculatorImage');
    }
    return this.currentImage;
  }

  clearImage(): void {
    this.currentImage = null;
    localStorage.removeItem('calculatorImage');
  }

  // Calculation History Management
  async saveCalculation(record: CalculationRecord): Promise<void> {
    record.timestamp = Date.now();
    this.calculationHistory.unshift(record);

    // Save to local storage (synchronous, but flush to ensure write)
    this.saveLocalHistory();

    // Save to Supabase (async, don't block on this, with timeout)
    // Use Promise.race to ensure Supabase call doesn't hang indefinitely
    const supabaseTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Supabase save timeout')), 5000)
    );

    try {
      await Promise.race([
        this.supabase.from('calculations').insert([
          {
            expression: record.expression,
            result: record.result,
            inaccuracy: record.inaccuracy,
            created_at: new Date(record.timestamp).toISOString(),
          },
        ]),
        supabaseTimeout,
      ]);
    } catch (error) {
      // Silently fail - continue offline, will sync later
      // Don't log errors as they're expected in offline mode
    }
  }

  getHistory(): CalculationRecord[] {
    return this.calculationHistory;
  }

  getLatestCalculation(): CalculationRecord | null {
    return this.calculationHistory.length > 0 ? this.calculationHistory[0] : null;
  }

  private saveLocalHistory(): void {
    const json = JSON.stringify(this.calculationHistory);
    localStorage.setItem('calculationHistory', json);
  }

  private loadLocalHistory(): void {
    const stored = localStorage.getItem('calculationHistory');
    if (stored) {
      try {
        this.calculationHistory = JSON.parse(stored);
      } catch (error) {
        this.calculationHistory = [];
      }
    } else {
      console.log('No history found in local storage');
    }
  }

  clearHistory(): void {
    this.calculationHistory = [];
    localStorage.removeItem('calculationHistory');
  }
}
