import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

import { DataService } from './../services/data.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})

export class StartComponent implements OnInit {

  // general vars
  conversation = [];
  conversationStep = 0;
  matchPersonData;
  imageToSend;
  selfMessages = [];
  isPopUpImageClicked = false;
  popUpImage;
  AgeRange;
  showAge = false;
  LabelsToDisplay;
  FaceDetailsToDisplay;
  CelebrityDataToDisplay;
  FaceMatchesToDisplay;

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

  // forUseRekognition
  currentStep = 1;
  stepAtFunctionStart = 1;


  constructor(private dataService: DataService, private router: Router) {
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
        'Sure, my favorites are',
        'Well, this should describe it '
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

  onWebsiteURLSubmit() {
    console.log('webURL = ', this.webURL);
    this.isURLorImageFileValid(this.webURL, 1, this);
    this.imageToSend = this.webURL;
    this.webURL = '';
    this.isWebsiteURLchosen = false;
  }

  onImageURLchange(event) {
    console.log('event = ', event);
    const that = this;
    const img = new Image();
    img.onload = () => {
      that.webURL = event;
      that.isURLorImageFileValid(this.webURL, 1, this);
      that.imageToSend = this.webURL;
      that.webURL = '';
      that.isWebsiteURLchosen = false;
    };
    img.onerror = function () {
      that.isNotValidImage = true;
      that.isNotValidURLprovided = true;
      that.webURL = '';
    };
    img.src = event;
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
    this.showAge = false;
    img.onload = () => {
      that.onImageSend();
      if (type === 1) {
        that.dataService.getInfoOnURLImage('1', this.dataService.fymRequestID, URLorFileSrc)
          .then((data) => {
            that.useRekognizedData(data);
          })
          .catch((err) => {
            console.log('Rekog err = ', err);
            this.conversationStep++;
            this.conversation[this.conversationStep] = {
              step: this.conversationStep,
              isSelf: false,
              name: null,
              image: null,
              audio: null,
              text: 'Hey, I can not recognize anything in that photo! Can you send another one please !'
            };
            this.onNewMessage();
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
        console.log('fromDB = ', fromDB);
        console.log('this.conversation-', this.conversation);
        if (fromDB == null) {
          setTimeout(() => this.onGetAudio1Clicked(mp3SeqNumb), 2000);
        } else if (fromDB.status === 'READY') {
          if (mp3SeqNumb === '0') {
            this.conversation[mp3SeqNumb].isSelf = false;
            this.conversation[mp3SeqNumb].audio = fromDB.url;
            this.conversation[mp3SeqNumb].text = fromDB.text;
            this.onNewMessage();
          } else {
            this.addNewMessage(fromDB);
          }
        } else {
          setTimeout(() => this.onGetAudio1Clicked(mp3SeqNumb), 2000);
        }
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
    this.onNewMessage();
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
      text: this.selfMessages[this.currentStep - 1]
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
    let newText = '';
    let repeatStepOne = false;
    let repeatStepTwo = false;
    let repeatStepThree = false;
    let repeatStepFour = false;
    this.stepAtFunctionStart = this.currentStep;
    this.AgeRange = null;

    // const RekognizedDataBody = this.RekognizedData.body;
    console.log('RekognizedDataBody = ', RekognizedDataBody);
    console.log('Labels = ', RekognizedDataBody[0]);
    console.log('FaceDetails = ', RekognizedDataBody[1]);
    console.log('CelebrityFaces = ', RekognizedDataBody[2]);
    console.log('FaceMatches = ', RekognizedDataBody[3]);
    console.log('currentStep = ', this.currentStep);
    console.log('stepAtFunctionStart = ', this.stepAtFunctionStart);
    const Labels = RekognizedDataBody[0];
    const FaceDetails = RekognizedDataBody[1];
    const CelebrityFaces = RekognizedDataBody[2];
    const FaceMatches = RekognizedDataBody[3];

    this.LabelsToDisplay = Labels;
    this.FaceDetailsToDisplay = FaceDetails;
    this.CelebrityDataToDisplay = CelebrityFaces;
    this.FaceMatchesToDisplay = FaceMatches;


    const genderSelfLc = JSON.parse(this.dataService.fymCriteriaSet).genderSelf;
    const genderSelf = this.toTitleCase(genderSelfLc);
    const Gender = (FaceDetails != null && FaceDetails[0] != null) ? FaceDetails[0].Gender.Value : genderSelf;

    console.log('FaceDetails.length=', FaceDetails.length);
    console.log('genderSelf + Gender=', genderSelf, Gender);

    if (this.stepAtFunctionStart === 1) {
      if (FaceDetails == null && this.stepAtFunctionStart === 1 ||
        FaceDetails.length === 0 && this.stepAtFunctionStart === 1) {
        newText = this.add('Hey, I asked for your photo. I do not see any human faces here !', newText);
        repeatStepOne = true;
      } else if (FaceDetails.length > 2) {
        newText = this.add('Hey, I asked for your photo only. I see ' + FaceDetails.length + ' faces here !', newText);
        repeatStepOne = true;
      } else if (FaceDetails.length === 2) {
        console.log('in 2 faces');
        console.log('FaceDetails[0].Gender.Value = ', FaceDetails[0].Gender.Value);
        console.log('FaceDetails[1].Gender.Value = ', FaceDetails[1].Gender.Value);
        console.log('genderSelf = ', genderSelf);

        if (FaceDetails[0].Gender.Value === genderSelf && FaceDetails[1].Gender.Value === genderSelf) {
          console.log('in 2 a');
          if (FaceDetails[0].AgeRange.Low >= 18 && FaceDetails[1].AgeRange.Low >= 18) {
            newText = this.add('I see two ' + genderSelfLc
              + 's here. I do not know which one is you ! ', newText);
            repeatStepOne = true;
          } else if (FaceDetails[0].AgeRange.Low >= 18 || FaceDetails[1].AgeRange.Low >= 18) {
            newText = this.add('I see two ' + genderSelfLc
              + 's here. Since one of them looks too young I guess other one is you !', newText);
          } else {
            newText = this.add('I see two ' + genderSelfLc
              + 's here. But both of them look too young. One of them is you ?', newText);
            repeatStepOne = true;
          }
        } else if (!(FaceDetails[0].Gender.Value === genderSelf) && !(FaceDetails[1].Gender.Value === genderSelf)) {
          console.log('in 2 b');
          const oppGender = genderSelf === 'Male' ? 'female' : 'male';
          newText = this.add('Hey, I asked for your photo. I see two ' + oppGender + 's here !', newText);
          repeatStepOne = true;
        } else if (FaceDetails[0].Gender.Value === genderSelf && !(FaceDetails[1].Gender.Value === genderSelf) ||
          !(FaceDetails[0].Gender.Value === genderSelf) && FaceDetails[1].Gender.Value === genderSelf) {
          console.log('in 2 c');
          console.log('in TWO DIF GENDERS');
          if (FaceDetails[0].AgeRange.Low >= 18 && FaceDetails[1].AgeRange.Low >= 18) {
            const oppGender = genderSelf === 'Male' ? 'she' : 'he';
            newText = this.add('I see one man and one woman here. I wonder who ' + oppGender + ' is.', newText);
          } else if (FaceDetails[0].AgeRange.Low >= 18 || FaceDetails[1].AgeRange.Low >= 18) {
            if (FaceDetails[0].AgeRange.Low >= 18 && FaceDetails[1].Gender.Value === genderSelf) {
              const oppGender = genderSelf === 'Male' ? 'girl' : 'boy';
              const oppGender1 = genderSelf === 'Male' ? 'she' : 'he';
              const oppGender2 = genderSelf === 'Male' ? 'daughter' : 'son';
              newText = this.add('I see a young ' + oppGender + '. I wonder who ' + oppGender1
                + 'is. May be your ' + oppGender2 + '.', newText);
            } else if (FaceDetails[0].AgeRange.Low < 18 && FaceDetails[1].Gender.Value === genderSelf) {
              const oppGender = genderSelf === 'Male' ? 'female' : 'male';
              newText = this.add('Well, I see only one ' + oppGender + 'here and you look too young.', newText);
              repeatStepOne = true;
            }
          } else {
            newText = this.add('I see two ' + genderSelfLc + 's here. But both of them look too young. One of them is you ?', newText);
            repeatStepOne = true;
          }

        }
      } else if (Gender !== genderSelf) {
        const aText = 'Hey, you said that your gender is ' + genderSelfLc + '. And I wonder why you are sending photo of a ' + Gender + '.';
        newText = this.add(aText, newText);
        repeatStepOne = true;
      }
    }

    if (!repeatStepOne) {
      // this.RekognizedData;
      console.log('in ELSE LARGE');
      if (CelebrityFaces.length === 0 && this.stepAtFunctionStart === 2) {
        repeatStepTwo = true;
      } else if (CelebrityFaces.length === 1) {
        const isCelebrity = CelebrityFaces[0].Name;
        const isCelebrityConf = CelebrityFaces[0].MatchConfidence;
        console.log('isCelebrity=', isCelebrity, isCelebrityConf);
        let howMuchAlike; let wow = ''; let who = '';
        if (isCelebrityConf > 90) { howMuchAlike = 'exactly'; wow = 'Oh my ...'; }
        if (isCelebrityConf > 80 && isCelebrityConf <= 90) { howMuchAlike = 'almost'; wow = 'Wow'; }
        if (isCelebrityConf > 50 && isCelebrityConf <= 80) { howMuchAlike = 'a little'; wow = 'Hey'; }
        if (this.stepAtFunctionStart === 1) { who = ', you look '; } else {
          if (FaceDetails != null && FaceDetails.length > 0) {
            if (FaceDetails[0].Gender.Value === 'Male') { who = ', he looks '; }
            if (FaceDetails[0].Gender.Value === 'Female') { who = ', she looks '; }
          } else { who = ', this person looks '; }
        }
        console.log('who = ', who);
        const celebrities = isCelebrityConf > 50 ? wow + who + howMuchAlike + ' like '
        + isCelebrity + '. I am also fan of this person.' : '';
        newText = this.add(celebrities, newText);

        if (celebrities.length > 0 && this.stepAtFunctionStart === 2) {
          this.currentStep = 3;
        } else if (this.stepAtFunctionStart === 2 && celebrities.length === 0) { repeatStepTwo = true; }

      } else if (CelebrityFaces.length > 1) {
        console.log('in CELEBS >1');
        let celebrities = '';
        for (let x = 0; x < CelebrityFaces.length; x++) {
          if (x !== CelebrityFaces.length - 1 || CelebrityFaces.length === 1) {
            if (x === 0) { celebrities = CelebrityFaces[x].Name; } else { celebrities = celebrities + ', ' + CelebrityFaces[x].Names; }
          } else { celebrities = celebrities + ' and ' + CelebrityFaces[x].Name; }
        }
        newText = this.add(' These people look like ' + celebrities + '. I am their fan, too.', newText);
        if (celebrities.length > 0 && this.stepAtFunctionStart === 2) {
          this.currentStep = 3;
        } else if (this.stepAtFunctionStart === 2 && celebrities.length === 0) { repeatStepTwo = true; }
      }

      if (FaceDetails != null && FaceDetails.length > 0) {
        console.log('in FACE DETAILS > 0');

        if (FaceDetails.length === 1) {
          this.AgeRange = FaceDetails[0].AgeRange != null ? FaceDetails[0].AgeRange.Low + ' and ' + FaceDetails[0].AgeRange.High : false;
        }

        if (this.stepAtFunctionStart === 1) {

          if (FaceDetails.length > 0) {
            const iLikes = []; const iGlads = [];
            const isSmiling = FaceDetails[0].Smile != null ? FaceDetails[0].Smile.Value : false;
            if (isSmiling) { iLikes.push('smile'); }
            const isBeard = FaceDetails[0].Beard != null ? FaceDetails[0].Beard.Value : false;
            if (Gender === 'Male' && isBeard) { iLikes.push('beard'); }
            if (Gender === 'Male' && !isBeard) { iGlads.push('beard'); }
            // Removed. Rekognition makes many errors saying there is no moustache when there is a solid one.
            // const isMoustach = FaceDetails[0].Mustache != null ? FaceDetails[0].Mustache.Value : false;
            // if (Gender === 'Male' && isMoustach) { iLikes.push('moustach'); }
            // if (Gender === 'Male' && !isMoustach) { iGlads.push('moustach'); }
            const isSunGlass = FaceDetails[0].Sunglasses != null ? FaceDetails[0].Sunglasses.Value : false;
            const isEyeGlass = FaceDetails[0].Eyeglasses != null ? FaceDetails[0].Eyeglasses.Value : false;
            if (isSunGlass || isEyeGlass) { iLikes.push('glasses'); }
            if (!isSunGlass && !isEyeGlass) { iGlads.push('glasses'); }
            const iLike = this.makeCommaAndText(iLikes);
            const iGlad = this.makeCommaAndText(iGlads);
            console.log(iLikes, iLike, iGlads, iGlad);

            if (iLikes.length > 0) { newText = this.add(' I like your ' + iLike + '.', newText); }
            if (iGlads.length > 0) { newText = this.add(' I am glad that you do NOT have ' + iGlad + '.', newText); }

            let emotion; let conf = 0, confPrev = 0;
            console.log('emotion = ', emotion, confPrev);
            FaceDetails[0].Emotions.forEach((element: any) => {
              conf = parseInt(element.Confidence, 10);
              if (confPrev < conf) {
                confPrev = conf;
                emotion = element.Type;
              }
            });
            if (emotion === 'HAPPY' && confPrev > 50) { newText = this.add(' I am glad that you look happy.', newText); }
            if (!isSmiling && emotion === 'CALM') { newText = this.add(' Hey, why you are so serious? Cheer up !', newText); }
            if (!isSmiling && emotion !== 'CALM' && emotion !== 'HAPPY') {
              newText = this.add(' Hey, why you look ' + emotion.toLowerCase() + '?', newText);
            }
          }

        }
      }
      if (newText.length > 0 && this.stepAtFunctionStart === 1) { this.currentStep = 2; }
      if (newText.length === 0 && this.stepAtFunctionStart === 1) { repeatStepOne = true; }
    }
    if (this.stepAtFunctionStart === 3) {
      console.log('Labels[0].toString() = ', Labels[0].toString());
        let animalFound = false;
        const pets = [];
        Labels.forEach(itemPre => {
          const item = itemPre.Name;
          console.log('item = ', item);
          if (item === 'Animal') { animalFound = true; }
          if (itemPre.Confidence > 70) {
            if (item !== 'Animal' && item !== 'Mammal' && item !== 'Pet' && item !== 'Bird' && item !== 'Person' && item !== 'Human'
              && item !== 'Outdoors' && item !== 'Fish' && item !== 'Aquatic' && item !== 'Water' && item !== 'Rural') {
              pets.push(item.toLowerCase());
            }
          }
        });
      if (animalFound && pets.length > 0) {
          const Text1 = this.makeCommaAndText(pets);
          newText = newText + ' Ok, I am glad that you like some animals. I can see here ' + Text1 + '.';
          this.currentStep = 4;
        } else { repeatStepThree = true; }
    } else if (this.stepAtFunctionStart === 4) {
      console.log('Labels[0].toString() = ', Labels[0].toString());
      const items = [];
      Labels.forEach(itemPre => {
        const item = itemPre.Name;
        console.log('item = ', item);
        if (itemPre.Confidence > 70) {
          if (item !== 'Animal' && item !== 'Mammal' && item !== 'Pet' && item !== 'Bird' && item !== 'Person' && item !== 'Human'
            && item !== 'Transportation' && item !== 'Vehicle' && item !== 'Sport' && item !== 'Sports' && item !== 'Photo'
            && item !== 'Portrait' && item !== 'Photography' && item !== 'Face' && item !== '___' && item !== '___'
          && item !== 'Outdoors' && item !== 'Fish' && item !== 'Aquatic' && item !== 'Water' && item !== 'Rural') {
            items.push(item.toLowerCase());
          }
        }
      });
      if (items.length > 0) {
        const Text1 = this.makeCommaAndText(items);
        let firstName = JSON.parse(this.dataService.fymCriteriaSet).firstName;
        firstName = this.toTitleCase(firstName);
        if (FaceMatches.length > 0) {
          if (FaceMatches[0].Similarity > 70) {
            newText = newText + ' I think I recognize you in this last image. Great, ';
          }
        }
        if (FaceMatches.length === 0) {
          newText = newText + ' Ok, I do not see you in this last image, but still, ';
        }
        // tslint:disable-next-line:max-line-length
        newText = newText + ' I am glad that you have some spare time activity. I can see here ' + Text1 + '. I like all this. Whoops, I have something urgent to do now. I would like to keep in touch with you. Talk to you soon ' + firstName + ' !';
        this.currentStep = 5;
        this.stepAtFunctionStart = 5;
      } else { repeatStepFour = true; }
    }

    // verifi
    if (this.stepAtFunctionStart === 1 && !repeatStepOne && this.currentStep === 2) {
      newText = newText + ' Can you send me photo of your favourite movie star or sports player ?';
    } else if (this.stepAtFunctionStart === 2 && !repeatStepTwo && this.currentStep === 3) {
      const lovePetsSelf = JSON.parse(this.dataService.fymCriteriaSet).lovePetsSelf;
      let Text1; let Text2;
      if (lovePetsSelf === 'yes') { Text1 = 'love'; Text2 = 'type of animal you like most of all'; }
      if (lovePetsSelf === 'no') {
        Text1 = 'do not love'; Text2 = 'any animal that you may like ( at least a little), if any';
      }
      if (lovePetsSelf === 'depends') {
        Text1 = 'would tolerate some'; Text2 = 'an animal you would tolerate more than others';
      }
      newText = newText + ' In your profile you stated that you ' + Text1 + ' pets. Can you send me photo of ' + Text2 + '?';
    } else if (this.stepAtFunctionStart === 3 && !repeatStepThree && this.currentStep === 4) {
      const active = JSON.parse(this.dataService.fymCriteriaSet).characterSelf;
      console.log('active = ', active);
      let Text1; let Text2;
      if (active === 'rather active (outdoor, sports)') {
        Text1 = 'love outdoor activities and sports'; Text2 = 'favourite outdoor activity or sport';
      }
      if (active === 'rather lazy') { Text1 = 'are rather lazy. I assume you have, at least, some hobby'; Text2 = 'hobby'; }
      // tslint:disable-next-line:max-line-length
      newText = newText + ' And my last question for today. In your profile you stated that you ' + Text1 + '. Can you send photo describing your ' + Text2 + '?';
    }
    if (repeatStepOne) { newText = this.add(' Can you send me your real photo ( where you are on your own ) ?', newText); }
    if (repeatStepTwo) {
      newText
        // tslint:disable-next-line:max-line-length
        = this.add(' I do not see any celebrity person here. Or at least I do not know this person - sorry! Can you send me photo of a real celebrity ?', newText);
    }
    if (repeatStepThree) { newText = this.add('  I do not see any animal here. Can you send me photo of a real animal ?', newText); }
    if (repeatStepFour) { newText = this.add('  I do not see anything here. Can you send me photo of a real activity ?', newText); }

    console.log('before audio synth with text = ', newText);
    console.log('repeatOne = ', repeatStepOne);


    if (newText.length > 0) { this.onRequestAudioSynth(newText); }

  }

  add(This: string, toThis: string) {
    if (toThis.length > 0) {
      toThis = toThis + This;
    } else {
      toThis = This;
    }
    return toThis;
  }

  makeCommaAndText(array) {
    let Text1 = '';
    for (let x = 0; x < array.length; x++) {
      if (x !== array.length - 1 || array.length === 1) {
        if (x === 0) { Text1 = array[x]; } else { Text1 = Text1 + ', ' + array[x]; }
      } else { Text1 = Text1 + ' and ' + array[x]; }
    }
    return Text1;
  }

  canShowAge() {
    this.showAge = true;
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
