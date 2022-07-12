import Phaser from 'phaser';
import introImg from './assets/images/1. 인트로.png';
import howtoImg from './assets/images/2. 문제 설명.png';
import round1Img from './assets/images/3. 1라운드배경화면.png';
import round2Img from './assets/images/4. 2라운드배경화면.png';
import round3Img from './assets/images/5. 3라운드배경화면.png';
import outroImg from './assets/images/6. 아웃트로.png';
import trashImg from './assets/images/7. 1라운드_휴지통.png';
import trashCommentImg from './assets/images/휴지통 위 문구.png';
import round1Object_1 from './assets/images/7. 1라운드아이템_1.png';
import round1Object_2 from './assets/images/7. 1라운드아이템_2.png';
import round1Object_3 from './assets/images/7. 1라운드아이템_3.png';
import round1Object_4 from './assets/images/7. 1라운드아이템_4.png';
import round1Object_5 from './assets/images/7. 1라운드아이템_5.png';

import round2Object_1 from './assets/images/8. 2라운드아이템_1.png';
import round2Object_2 from './assets/images/8. 2라운드아이템_2.png';
import round2Object_3 from './assets/images/8. 2라운드아이템_3.png';
import round2Object_4 from './assets/images/8. 2라운드아이템_4.png';
import round2Object_5 from './assets/images/8. 2라운드아이템_5.png';

import round2ObjectIncorrect_1 from './assets/images/8. 2라운드오답아이템_1.png';
import round2ObjectIncorrect_2 from './assets/images/8. 2라운드오답아이템_2.png';
import round2ObjectIncorrect_3 from './assets/images/8. 2라운드오답아이템_3.png';

import nextRoundImg from './assets/images/10. 다음라운드 안내 화면.png';
import questionImg from './assets/images/9. 3라운드_문제화면.png';

import playButtonImg from './assets/images/플레이버튼.png';
import bgmAud from './assets/audios/bgm.mp3';

let centerX, centerY;
let introBackgroundImg,
  howtoBackgorundImg,
  round1BackgorundImg,
  round2BackgorundImg,
  round3BackgorundImg;
let nextRoundSignImg, nextRoundSignText;
let trashTxtObj, trashObj;
let round1DropZone;
let nowRound = 1;
let dragCount = 5;
let dragEnterObj;
let dragObjects = [];

class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image('introImg', introImg);
    this.load.image('howtoImg', howtoImg);
    this.load.image('round1Img', round1Img);
    this.load.image('round2Img', round2Img);
    this.load.image('round3Img', round3Img);
    this.load.image('outroImg', outroImg);
    this.load.image('trashImg', trashImg);
    this.load.image('trashCommentImg', trashCommentImg);
    this.load.image('round1ObjectImg_1', round1Object_1);
    this.load.image('round1ObjectImg_2', round1Object_2);
    this.load.image('round1ObjectImg_3', round1Object_3);
    this.load.image('round1ObjectImg_4', round1Object_4);
    this.load.image('round1ObjectImg_5', round1Object_5);
    this.load.image('round2ObjectImg_1', round2Object_1);
    this.load.image('round2ObjectImg_2', round2Object_2);
    this.load.image('round2ObjectImg_3', round2Object_3);
    this.load.image('round2ObjectImg_4', round2Object_4);
    this.load.image('round2ObjectImg_5', round2Object_5);
    this.load.image('round2ObjectImgIncorrect_1', round2ObjectIncorrect_1);
    this.load.image('round2ObjectImgIncorrect_2', round2ObjectIncorrect_2);
    this.load.image('round2ObjectImgIncorrect_3', round2ObjectIncorrect_3);
    this.load.image('nextRoundImg', nextRoundImg);
    this.load.image('questionImg', questionImg);
    this.load.image('playBtn', playButtonImg);
    this.load.audio('bgm', bgmAud);

    const loadFont = (name, url) => {
      var newFont = new FontFace(name, `url(${url})`);
      newFont
        .load()
        .then(function (loaded) {
          document.fonts.add(loaded);
        })
        .catch(function (error) {
          return error;
        });
    };

    loadFont(
      'CookieRun-Regular',
      'https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/CookieRun-Regular.woff'
    );
  }

  create() {
    document.body.style.margin = 0;

    // XY
    centerX = this.cameras.main.width / 2;
    centerY = this.cameras.main.height / 2;

    const bgm = this.sound.add('bgm', { loop: true });

    introBackgroundImg = this.add.image(centerX, centerY, 'introImg');
    const dim = this.add.rectangle(
      centerX,
      centerY,
      1920,
      1080,
      '0x000000',
      0.3
    );
    const circle = this.add
      .circle(centerX, centerY, 100, '0xffffff')
      .setInteractive({ cursor: true });
    const playBtn = this.add.image(centerX, centerY, 'playBtn');

    this.fullResize(introBackgroundImg);

    // Groups...
    const playButtonGroup = this.add.group();

    playButtonGroup.add(circle);
    playButtonGroup.add(playBtn);

    playButtonGroup.getChildren().forEach((obj) => {
      obj.on('pointerdown', (e) => {
        playButtonGroup.setVisible(false);
        dim.setVisible(false);
        bgm.play();
        this.time.addEvent({
          delay: 2000,
          callback: () => this.goHowto(),
        });
      });
      obj.on('pointerout', () => {
        this.input.setDefaultCursor('auto');
      });
      obj.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
      });
    });

    // Drags Events...
    this.input.on(
      'dragstart',
      (pointer, gameObject) => {
        this.children.bringToTop(gameObject);
        if (nowRound == 2) {
          gameObject.setScale(0.15);
        }
      },
      this
    );

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('dragenter', function (pointer, gameObject, dropZone) {
      dragEnterObj = dropZone;
    });

    this.input.on('dragend', (pointer, gameObject, dropped) => {
      if (!dropped) {
        gameObject.x = gameObject.input.dragStartX;
        gameObject.y = gameObject.input.dragStartY;
        if (nowRound == 2) {
          gameObject.setScale(0.065);
        }
      } else {
        if (nowRound == 1) {
          gameObject.destroy();
          dragCount--;
          if (dragCount == 0) {
            this.input.setDefaultCursor('auto');
            nextRoundSignImg = this.add
              .image(centerX, centerY, 'nextRoundImg')
              .setScale(0.2);
            nextRoundSignText = this.add.text(
              220,
              450,
              '1라운드 미션 성공!\n2라운드에서는 환경을 아프게 하는 것들이 있던\n자리에 환경을 위한 아이템을 채워 보세요!',
              {
                font: '50px CookieRun-Regular',
                fill: '#007bc6',
                align: 'center',
                fixedWidth: 1500,
              }
            );
            this.time.addEvent({
              delay: 5000,
              callback: () => this.goRound2(),
            });
          }
        } else if (nowRound == 2) {
          if (
            gameObject.data.correct &&
            dragEnterObj.data.number == gameObject.data.number
          ) {
            gameObject.x = dragEnterObj.x;
            gameObject.y = dragEnterObj.y;
            gameObject.input.draggable = false;
            dragCount--;
            if (dragCount == 0) {
              round1BackgorundImg.destroy();
              round2BackgorundImg = this.add.image(
                centerX,
                centerY,
                'round2Img'
              );
              this.fullResize(round2BackgorundImg);

              for (let index = 0; index < dragObjects.length; index++) {
                let obj = dragObjects[index];
                this.children.bringToTop(obj);
                obj.input.draggable = false;
              }

              this.children.bringToTop(nextRoundSignImg);
              this.children.bringToTop(nextRoundSignText);

              nextRoundSignImg.setVisible(true);
              nextRoundSignText.setText(
                '2라운드 미션 성공!\n친환경 마을이 만들어졌어요!\n다음 라운드로 넘어가 볼까요?'
              );
              nextRoundSignText.setVisible(true);
              //Todo.. next Round
            }
          } else {
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
            gameObject.setScale(0.065);
          }
        }
      }
    });
  }

  // functions...
  goHowto() {
    introBackgroundImg.destroy();
    howtoBackgorundImg = this.add.image(centerX, centerY, 'howtoImg');
    this.fullResize(howtoBackgorundImg);
    this.time.addEvent({
      delay: 5000,
      callback: () => this.goRound1(),
    });
  }

  goRound1() {
    howtoBackgorundImg.destroy();
    round1BackgorundImg = this.add.image(centerX, centerY, 'round1Img');
    this.fullResize(round1BackgorundImg);
    trashObj = this.add.image(150, 900, 'trashImg').setScale(0.15);
    trashTxtObj = this.add.image(200, 700, 'trashCommentImg').setScale(0.1);

    // Drag Images...
    const moveX = ['1500,540', '1050,150', '250,550', '1550,900', '600,700'];
    for (let i = 1; i <= dragCount; i++) {
      const dragObj = this.add
        .image(
          moveX[i - 1].split(',')[0],
          moveX[i - 1].split(',')[1],
          'round1ObjectImg_' + i
        )
        .setScale(0.2);
      dragObj.setInteractive({
        draggable: true,
      });

      dragObj.on('pointerout', () => {
        this.input.setDefaultCursor('auto');
      });
      dragObj.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
      });
    }

    // Drop Zones...
    round1DropZone = this.add
      .zone(150, 900, 300, 300)
      .setRectangleDropZone(300, 300);
    //  Just a visual display of the drop zone
    // let graphics = this.add.graphics();
    // graphics.lineStyle(2, 0xffff00);
    // graphics.strokeRect(
    //   round1DropZone.x - round1DropZone.input.hitArea.width / 2,
    //   round1DropZone.y - round1DropZone.input.hitArea.height / 2,
    //   round1DropZone.input.hitArea.width,
    //   round1DropZone.input.hitArea.height
    // );
  }

  goRound2() {
    dragCount = 5;
    nowRound = 2;
    nextRoundSignText.setVisible(false);
    nextRoundSignImg.setVisible(false);
    trashObj.setVisible(false);
    trashTxtObj.setVisible(false);
    this.add.image(centerX, 930, 'questionImg').setScale(0.15);

    const round2Objects = [
      'round2ObjectImg_1',
      'round2ObjectImg_2',
      'round2ObjectImg_3',
      'round2ObjectImg_4',
      'round2ObjectImg_5',
      'round2ObjectImgIncorrect_1',
      'round2ObjectImgIncorrect_2',
      'round2ObjectImgIncorrect_3',
    ];

    Phaser.Actions.Shuffle(round2Objects);

    let moveX = 520;
    const dropZonePos = [
      '1550,600',
      '1100,300',
      '300,500',
      '1650,850',
      '550,700',
    ];
    // Drag Images...
    for (let i = 0; i < round2Objects.length; i++) {
      let objKey = round2Objects[i];
      let number = objKey.split('_')[1];
      let correct = objKey.indexOf('Incorrect') == -1 ? true : false;
      let dragObj = this.add.image(moveX, 950, objKey).setScale(0.065);
      dragObj.setInteractive({
        draggable: true,
      });
      dragObj.on('pointerout', () => {
        this.input.setDefaultCursor('auto');
      });
      dragObj.on('pointerover', () => {
        this.input.setDefaultCursor('pointer');
      });
      dragObj.data = {
        number: number,
        correct: correct,
      };

      dragObjects.push(dragObj);

      moveX += 127;

      if (correct) {
        let dropZone = this.add
          .zone(
            dropZonePos[number - 1].split(',')[0],
            dropZonePos[number - 1].split(',')[1],
            300,
            300
          )
          .setRectangleDropZone(300, 300);
        //  Just a visual display of the drop zone
        // let graphics = this.add.graphics();
        // graphics.lineStyle(2, 0xffff00);
        // graphics.strokeRect(
        //   dropZone.x - dropZone.input.hitArea.width / 2,
        //   dropZone.y - dropZone.input.hitArea.height / 2,
        //   dropZone.input.hitArea.width,
        //   dropZone.input.hitArea.height
        // );
        dropZone.data = { number: number };
      }
    }

    round1DropZone.destroy();
  }

  fullResize(obj) {
    let scaleX = this.cameras.main.width / obj.width;
    let scaleY = this.cameras.main.height / obj.height;
    let scale = Math.max(scaleX, scaleY);
    obj.setScale(scale).setScrollFactor(0);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1920,
  height: 1080,
  scene: MyGame,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const game = new Phaser.Game(config);
