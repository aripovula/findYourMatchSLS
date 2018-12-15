import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})

export class StartComponent implements OnInit {

  greetings = [];
  // on capture image
  isCapturePhotoChosen = false;
  isPhotoCaptured = false;
  isWebsiteURLchosen = false;
  isNotValidImage = false;
  isNotValidURLprovided = false;
  isNotValidImageProvided = false;

  showWebcam = true;
  allowCameraSwitch = true;
  multipleWebcamsAvailable = false;
  deviceId: string;
  videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  errors: WebcamInitError[] = [];
  webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  // on image upload from local file
  uploaderHidden = false;
  imageFile;
  imageDescription;

  // on add image URL
  webURL = '';

  constructor(private dataService: DataService) { this.onGetAudio1Clicked('a'); }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  // on capture image
  onSnapshotClicked() {
    this.isCapturePhotoChosen = true;
    this.isPhotoCaptured = false;
  }

  onCapturePhotoModalClose() {
    this.isCapturePhotoChosen = false;
    this.isPhotoCaptured = false;
  }

  handleImage(webcamImage: WebcamImage): void {
    console.log('received webcam image', webcamImage);
    this.isPhotoCaptured = true;
    this.webcamImage = webcamImage;
  }

  onImageCaptureSubmitted() {
    this.dataService.postImage(this.webcamImage).then(() => {
      this.dataService.getInfoOnURLImage('2', '1', null);
    });
    this.isCapturePhotoChosen = false;
    this.isPhotoCaptured = false;
  }

  onCaptureAgainClicked() {
    this.isCapturePhotoChosen = true;
    this.isPhotoCaptured = false;
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  // public toggleWebcam(): void {
  //   this.showWebcam = !this.showWebcam;
  // }

  // public showNextWebcam(directionOrDeviceId: boolean | string): void {
  //   // true => move forward through devices
  //   // false => move backwards through devices
  //   // string => move to device with given deviceId
  //   this.nextWebcam.next(directionOrDeviceId);
  // }

  // public cameraWasSwitched(deviceId: string): void {
  //   console.log('active device: ' + deviceId);
  //   this.deviceId = deviceId;
  // }

  // on add image URL
  onWebsiteUrlClicked() {
    this.isWebsiteURLchosen = true;
  }

  onWebsiteURLClose() {
    this.isWebsiteURLchosen = false;
  }

  onWebsiteURLSubmit() {
    console.log('webURL = ', this.webURL);
    this.isURLorImageFileValid(this.webURL, 1, this);
    this.webURL = '';
    this.isWebsiteURLchosen = false;
  }

  // on image upload from local file
  onImageChangeRequest(e) {
    this.uploaderHidden = false;
  }

  onUploadFinished(file: any) {
    console.log('onUploadFinished ind = ', file);
    this.uploaderHidden = true;
    this.imageFile = file.src;
    this.isURLorImageFileValid(file.src, 2, this);
  }

  onNotValidImageClose() {
    this.isNotValidImage = false;
    this.isNotValidURLprovided = false;
    this.isNotValidImageProvided = false;
  }

  isURLorImageFileValid(URLorFileSrc, type: number, that) {
    const img = new Image();
    img.onload = () => {
      if (type === 1) {
        that.dataService.getInfoOnURLImage('1', 'A1', URLorFileSrc)
        .then((data) => { JSON.stringify(this.imageDescription = data); });
      } else if (type === 2) {
        that.dataService.postImage({ _imageAsDataUrl: URLorFileSrc }).then(() => {
          that.dataService.getInfoOnURLImage('2', '1', null);
        });
      }
    };
    img.onerror = function () {
      if (type === 1) {
        that.isNotValidImage = true;
        that.isNotValidURLprovided = true;
      } else if (type === 2) {
        that.isNotValidImage = true;
        that.isNotValidImageProvided = true;
      }
    };
    img.src = URLorFileSrc;
  }

  onGetAudio1Clicked(id) {
    this.dataService.getAudio('initial', id)
      .then((fromDB: any) => {
        this.greetings = fromDB;
        console.log('this.greetings=', this.greetings);

      })
      .catch((error) => {
        console.log('error - ', error);
      })
      ;
  }

  onPlayAudioClicked(url) {
    new Audio(url).play();
  }

  onNewMessage() {
    new Audio('../../assets/stairs.mp3').play();
  }
}
