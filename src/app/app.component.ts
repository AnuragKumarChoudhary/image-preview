import { Component, OnInit } from '@angular/core';
import { WebcamInitError, WebcamUtil, WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {};
  public errors: WebcamInitError[] = [];
  public capturedImages = [];
  public height = [];
  public width = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.capturedImages.push(webcamImage.imageAsDataUrl);
    this.height.push(100);
    this.width.push(130);
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public resizeImage(i) {
    if (this.height[i] == 100 && this.width[i] == 130) {
      this.height[i] *= 2;
      this.width[i] *= 2;
    } else if (this.height[i] / 2 == 100 && this.width[i] / 2 == 130) {
      this.height[i] /= 2;
      this.width[i] /= 2;
    }
  }
}
