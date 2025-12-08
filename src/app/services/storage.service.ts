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

    // Verify write by reading back
    const stored = localStorage.getItem('calculationHistory');
    const parsed = stored ? JSON.parse(stored) : [];

    // Save to Supabase (async, don't block on this)
    try {
      await this.supabase
        .from('calculations')
        .insert([
          {
            expression: record.expression,
            result: record.result,
            inaccuracy: record.inaccuracy,
            image_data: record.imageData,
            created_at: new Date(record.timestamp).toISOString(),
          },
        ]);
    } catch (error) {
      console.error('[StorageService] Error saving to Supabase:', error);
      // Continue offline, will sync later
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
