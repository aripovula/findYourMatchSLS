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

  // greetings = [];
  conversation = [];
  conversationStep = 0;
  matchPersonData;
  imageToSend;
  selfMessages = [];
  isPopUpImageClicked = false;
  popUpImage;
  // RekognizedData;
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
    this.onGetAudio1Clicked('0');
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
        isSelf: true,
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
      that.onImageSend();
      if (type === 1) {
        that.dataService.getInfoOnURLImage('1', this.dataService.fymRequestID, URLorFileSrc)
          .then((data) => {
            // that.RekognizedData = data;
            that.useRekognizedData(data);
          });
      } else if (type === 2) {
        that.dataService.postImage({ _imageAsDataUrl: URLorFileSrc }).then(() => {
          that.dataService.getInfoOnURLImage('2', this.dataService.fymRequestID, 'none')
            .then((data) => {
              // that.RekognizedData = data;
              that.useRekognizedData(data);
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

  onGetAudio1Clicked(mp3SeqNumb: string) {
    this.dataService.getAudio('check', mp3SeqNumb, 'none')
      .then((fromDB: any) => {
        // this.greetings.push(fromDB);
        // console.log('this.greetings=', this.greetings);
        console.log('audio status = ', fromDB);
        if (fromDB == null) {
          setTimeout(() => this.onGetAudio1Clicked(mp3SeqNumb), 2000);
        } else if (fromDB.status === 'READY') {
          if (mp3SeqNumb === '0') {
            this.conversation[mp3SeqNumb].isSelf = false;
            this.conversation[mp3SeqNumb].audio = fromDB.url;
            this.conversation[mp3SeqNumb].text = fromDB.text;
          } else {
            this.addNewMessage(fromDB);
          }
        } else {
          setTimeout(() => this.onGetAudio1Clicked(mp3SeqNumb), 2000);
        }

        console.log('fromDB = ', fromDB);
        console.log('this.conversation-', this.conversation);
      })
      .catch((error) => {
        console.log('error - ', error);
      })
      ;
  }

  onRequestAudioSynth(text) {
    const params = JSON.stringify({
      gender: JSON.parse(this.dataService.fymCriteriaSet).genderFind,
      text
    });
    const seqNumb = this.conversationStep + 1;
    this.dataService.getAudio('addNew', '' + seqNumb, params)
      .then((data) => {
        console.log('after onRequestAudioSynth = ', data);
        console.log('in onRequestAudioSynth seqNumb = ', seqNumb);
        this.onGetAudio1Clicked('' + seqNumb);
      });
  }

  addNewMessage(data) {
    console.log('in addNewMessage data =', data);
    this.conversationStep++;
    this.conversation[this.conversationStep] = {
      step: this.conversationStep,
      isSelf: false,
      name: null,
      image: null,
      audio: data.url,
      text: data.text
    };
    console.log('this.conversationStep = ', this.conversationStep);
    console.log('this.conversation[this.conversationStep] = ', this.conversation[this.conversationStep]);
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

  onImageSend() {
    this.conversationStep++;
    this.conversation[this.conversationStep] = {
      step: this.conversationStep,
      isSelf: true,
      name: null,
      image: this.imageToSend,
      audio: null,
      text: this.selfMessages[(this.conversationStep - 1) / 2]
    };
    this.imageToSend = null;
  }

  onPopUpImageClicked(step) {
    this.popUpImage = this.conversation[step].image;
    this.isPopUpImageClicked = true;
  }

  onPopUpImageClose() {
    this.isPopUpImageClicked = false;
    this.popUpImage = null;
  }

  useRekognizedData(RekognizedData) {
    const RekognizedDataBody = JSON.parse(RekognizedData.body);
    // const RekognizedDataBody = this.RekognizedData.body;
    console.log('RekognizedDataBody = ', RekognizedDataBody);
    console.log('Labels = ', RekognizedDataBody[0]);
    console.log('FaceDetails = ', RekognizedDataBody[1]);
    console.log('CelebrityFaces = ', RekognizedDataBody[2]);
    console.log('FaceMatches = ', RekognizedDataBody[3]);
    const Labels = RekognizedDataBody[0];
    const FaceDetails = RekognizedDataBody[1];
    const CelebrityFaces = RekognizedDataBody[2];
    const FaceMatches = RekognizedDataBody[3];

    // this.RekognizedData;

    const isCelebrity = CelebrityFaces[0].Name;
    const isCelebrityConf = CelebrityFaces[0].MatchConfidence;
    console.log('isCelebrity=', isCelebrity, isCelebrityConf);

    let howMuchAlike;
    if (isCelebrityConf > 90) { howMuchAlike = 'exactly'; }
    if (isCelebrityConf > 80 && isCelebrityConf <= 90) { howMuchAlike = 'almost'; }
    if (isCelebrityConf > 70 && isCelebrityConf <= 80) { howMuchAlike = 'a little'; }
    let newText = isCelebrityConf > 70 ? 'Hey, you look ' + howMuchAlike + ' like ' + isCelebrity : '';
    newText = newText + '';
    console.log('before audit synth with text = ', newText);
    this.onRequestAudioSynth(newText);

  }
}
