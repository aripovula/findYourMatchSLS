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
  conversation = [];
  conversationStep = 0;
  matchPersonData;
  imageToSend;
  selfMessages = [];
  isPopUpImageClicked = false;
  popUpImage;
  RekognizedData;
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

  constructor(private dataService: DataService) {
    this.onGetAudio1Clicked();
    this.matchPersonData = this.dataService.fymResponseData;
    console.log('matchPersonData = ', this.matchPersonData);
  }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
    if (this.matchPersonData != null) {
      this.conversation[this.conversationStep] = {
        step: this.conversationStep,
        isSelf: false,
        name: this.toTitleCase(this.matchPersonData.name),
        image: this.matchPersonData.image,
        audio: null,
        text: null
      };
      console.log('this.conversation-', this.conversation);
      this.selfMessages = [
        'Hey ' + this.toTitleCase(this.matchPersonData.name)
        + '. Great to meet you ! I like your photo. Here is mine.',
        'Here you go',
        'What do you think about this?',
        'What about this? :)'
      ];
    }
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
    this.imageToSend = this.webcamImage.imageAsDataUrl;
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
    this.imageToSend = this.webURL;
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
    this.imageToSend = file.src;
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
        that.dataService.getInfoOnURLImage('1', this.dataService.fymRequestID, URLorFileSrc)
          .then((data) => {
            that.RekognizedData = data;
            that.useRekognizedData();
          });
      } else if (type === 2) {
        that.dataService.postImage({ _imageAsDataUrl: URLorFileSrc }).then(() => {
          that.dataService.getInfoOnURLImage('2', this.dataService.fymRequestID, 'none')
            .then((data) => {
              that.RekognizedData = data;
              that.useRekognizedData();
            });
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

  onGetAudio1Clicked() {
    this.dataService.getAudio('initial')
      .then((fromDB: any) => {
        this.greetings.push(fromDB);
        console.log('this.greetings=', this.greetings);
        this.conversation[this.conversationStep].audio = fromDB.url;
        this.conversation[this.conversationStep].text = fromDB.text;
        console.log('this.conversation-', this.conversation);
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

  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  onImageSendClicked() {
    this.conversationStep++;
    this.conversation[this.conversationStep] = {
      step: this.conversationStep,
      isSelf: true,
      name: null,
      image: this.imageToSend,
      audio: null,
      text: this.selfMessages[(this.conversationStep - 1) / 2]
    };
  }

  onPopUpImageClicked(step) {
    this.popUpImage = this.conversation[step].image;
    this.isPopUpImageClicked = true;
  }

  onPopUpImageClose() {
    this.isPopUpImageClicked = false;
    this.popUpImage = null;
  }

  useRekognizedData() {
    const RekognizedDataBody = JSON.parse(this.RekognizedData.body);
    // const RekognizedDataBody = this.RekognizedData.body;
    console.log('RekognizedDataBody = ', RekognizedDataBody);
    console.log('Labels = ', RekognizedDataBody[0]);
    console.log('FaceDetails = ', RekognizedDataBody[1]);
    console.log('CelebrityFaces = ', RekognizedDataBody[2]);
    console.log('FaceMatches = ', RekognizedDataBody[3]);
    // this.RekognizedData;
  }
}
