import { Component, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonHeader, IonToolbar, IonTitle, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, calculator, checkmarkCircle, sunny, moon } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonHeader, IonToolbar, IonTitle, IonButton],
})
export class TabsPage implements OnInit {
  public environmentInjector = inject(EnvironmentInjector);
  isDark = false;

  constructor() {
    addIcons({ camera, calculator, checkmarkCircle, sunny, moon });
  }

  ngOnInit() {
    // Check user preference and listen for changes
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.initializeDarkPalette(prefersDark.matches);
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches));
  }

  initializeDarkPalette(isDark: boolean) {
    this.isDark = isDark;
    this.toggleDarkPalette(isDark);
  }

  toggleTheme() {
    this.toggleDarkPalette(!this.isDark);
  }

  private toggleDarkPalette(shouldAdd: boolean) {
    this.isDark = shouldAdd;
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }
}

