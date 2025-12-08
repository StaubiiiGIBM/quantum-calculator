import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonImg,
  IonText,
  IonIcon,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';

@Component({
  selector: 'app-camera',
  templateUrl: 'camera.page.html',
  styleUrls: ['camera.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonImg,
    IonText,
    IonIcon,
    IonCard,
    IonCardContent,
    CommonModule,
  ],
})
export class CameraPage implements OnInit {
  photoData: string | null = null;
  cameraPermissionGranted: boolean = true;

  constructor(private storageService: StorageService, private router: Router) {
    addIcons({ camera });
  }

  ngOnInit(): void {
    // Load saved photo if exists
    this.photoData = this.storageService.getImage();
  }

  async takePhoto(): Promise<void> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image.base64String) {
        this.photoData = `data:image/jpeg;base64,${image.base64String}`;
        await this.storageService.saveImage(this.photoData);
      }
    } catch (error) {
      console.error('Camera error:', error);
      if (error instanceof Error && error.message.includes('User cancelled')) {
        console.log('Camera cancelled by user');
      }
    }
  }

  navigateToCalculator(): void {
    this.router.navigate(['/tabs/calculator']);
  }

  clearPhoto(): void {
    this.photoData = null;
    this.storageService.clearImage();
  }
}
