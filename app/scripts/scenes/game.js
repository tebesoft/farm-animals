import Background from '../objects/background';

export default class Game extends Phaser.Scene {
  /**
   *  A sample Game scene, displaying the Phaser logo.
   *
   *  @extends Phaser.Scene
   */
  constructor() {
    super({key: 'Game'});
  }

  /**
   *  Called when a scene is initialized. Method responsible for setting up
   *  the game objects of the scene.
   *
   *  @protected
   *  @param {object} data Initialization parameters.
   */
  create(/* data */) {
    //  TODO: Replace this content with really cool game code here :)
    //this.logo = this.add.existing(new Logo(this));
    // let { width, height } = this.sys.game.canvas;
    // console.log(`Canvas size: ${width}x${height}`);
    this.background = this.add.existing(new Background(this));
    //group for animals
    let animalData = [
      { key: 'chicken', text: 'CHICKEN', audio: 'chickenSound' },
      { key: 'horse', text: 'HORSE', audio: 'horseSound' },
      { key: 'pig', text: 'PIG', audio: 'pigSound' },
      { key: 'sheep', text: 'SHEEP', audio: 'sheepSound' }
    ];

    this.animals = this.add.group();
    this.animalCounter = 0;


    animalData.forEach((element) => {
      let animal = this.add.sprite(-1000, this.cameras.main.centerY, element.key);
      animal.setInteractive(this.input.makePixelPerfect());
      animal.on('pointerdown', this.animateAnimal, animal);
      animal.customParams = {
        text: element.text,
        animKey: `${element.key}Anim`,
        sound: this.sound.add(`${element.key}Sound`)
      };
      this.anims.create({
        key: animal.customParams.animKey,
        frames: this.anims.generateFrameNumbers(element.key).concat(this.anims.generateFrameNumbers(element.key)).concat({key: element.key, frame: 0}),
        frameRate: 3,
        repeat: 0
      });
      animal.anims.load(animal.customParams.animKey);
      this.animals.add(animal);
    });

    this.currentAnimal = this.animals.getChildren()[this.animalCounter];
    this.currentAnimal.setPosition(this.cameras.main.centerX, this.cameras.main.centerY);
    this.showText(this.currentAnimal);
    // this.chicken = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, 'chicken');
    // this.pig = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY+10, 'pig');
    // this.pig.setInteractive(this.input.makePixelPerfect());
    // this.pig.on('pointerdown', this.animateAnimal);
    // this.pig.flipX = -1;
    // this.sheep = this.add.sprite(500, 300, 'sheep');
    // this.sheep.angle = 90;
    this.leftArrow = this.add.sprite(180, this.cameras.main.centerY, 'arrow');
    this.leftArrow.setInteractive(this.input.makePixelPerfect());
    this.leftArrow.flipX = -1;
    this.leftArrow.customParams = { direction: -1 };
    this.leftArrow.on('pointerdown', this.switchAnimal, { game: this, arrow: this.leftArrow });

    this.rightArrow = this.add.sprite(680, this.cameras.main.centerY, 'arrow');
    this.rightArrow.customParams = { direction: 1 };
    this.rightArrow.setInteractive(this.input.makePixelPerfect());
    this.rightArrow.on('pointerdown', this.switchAnimal, { game: this, arrow: this.rightArrow });
  }

  /**
   *  Called when a scene is updated. Updates to game logic, physics and game
   *  objects are handled here.
   *
   *  @protected
   *  @param {number} t Current internal clock time.
   *  @param {number} dt Time elapsed since last update.
   */
  update(/* t, dt */) {
    //this.logo.update();
  }

  switchAnimal() {
    if (this.game.isMoving) {
      return;
    }
    this.game.isMoving = true;
    this.game.animalText.visible = false;

    let newAnimal, endX;
    this.game.animalCounter += 1;

    if (this.game.animalCounter >= this.game.animals.children.size) {
      this.game.animalCounter = 0;
    }

    if (this.arrow.customParams.direction > 0) {
      newAnimal = this.game.animals.getChildren()[this.game.animalCounter];
      newAnimal.setX( -newAnimal.width / 2 );
      endX = 854 + this.game.currentAnimal.width / 2;
    } else {
      newAnimal = this.game.animals.getChildren()[this.game.animalCounter];
      newAnimal.setX( 854 + newAnimal.width / 2 );
      endX = 0 - this.game.currentAnimal.width / 2;
    }

    this.game.tweens.add({
      targets: newAnimal,
      x: this.game.cameras.main.centerX,
      duration: 1000,
      ease: 'Power2',
      completeDelay: 0,
      onComplete: () =>  {
        this.game.isMoving = false;
        this.game.showText(newAnimal);
      }
    });

    // newAnimal.setX(this.game.currentAnimal.x);
    // this.game.currentAnimal.setX(endX);
    this.game.tweens.add({
      targets: this.game.currentAnimal,
      x: endX,
      duration: 1000,
      ease: 'Power2',
      completeDelay: 0
    });

    this.game.currentAnimal = newAnimal;

  }

  animateAnimal() {
    //console.log('animate animal');
    this.play(this.customParams.animKey);
    this.customParams.sound.play();
  }

  showText(animal) {
    if (!this.animalText) {
      var style = {
        fontSize: '30pt',
        fill: 'red',
        align: 'center'
      };
      this.animalText = this.add.text(this.cameras.main.centerX, this.game.canvas.height*0.77, '', style);
      this.animalText.setOrigin(0.5);
    }
    this.animalText.setText(animal.customParams.text);
    this.animalText.visible = true;
  }
}
