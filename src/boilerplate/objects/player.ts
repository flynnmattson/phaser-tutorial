/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 Digitsensitive
 * @description  Flappy Bird: Bird
 * @license      Digitsensitive
 */

export class Player extends Phaser.GameObjects.Sprite {
  private isDead: boolean = false;
  private isJumping: boolean = false;
  private isRunning: boolean = false;
  private isAttacking: boolean = false;
  private currentScene: Phaser.Scene;
  private attackCooldown: number = 400;
  private lastAttack: number = 0;
  private attackCombo: number = 1;

  public getDead(): boolean {
    return this.isDead;
  }

  public setDead(dead): void {
    this.isDead = dead;
  }

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);
    this.currentScene = params.scene;

    // image
    this.setScale(3);
    this.setOrigin(0, 0);

    // physics
    params.scene.physics.world.enable(this);
    this.body.allowGravity = true;
    this.body.setSize(50, 37);

    params.scene.add.existing(this);
  }

  update(): void {
    if (this.body.velocity.y === 0) {
      this.isJumping = false;
    }

    if (this.isAttacking && this.currentScene.time.now > this.lastAttack) {
      this.isAttacking = false;
    }

    if (!this.isJumping && !this.isRunning && !this.isAttacking) {
      this.anims.play("adventurerIdle", true);
    }

    this.isOffTheScreen();
  }

  // private handleGravity(): void {
  //   if (this.body.y >= this.scene.sys.canvas.height - 215) {
  //     this.body.allowGravity = false;
  //     if (this.body.velocity.y > 0) {
  //       this.isJumping = false;
  //       this.body.setVelocityY(0);
  //     }
  //   } else {
  //     this.body.allowGravity = true;
  //   }
  // }

  public jump(): void {
    if (!this.isJumping) {
      this.body.setVelocityY(-350);
      this.isJumping = true;
      this.anims.play("adventurerJump", true);
    }
  }

  public attack(): void {
    if (!this.isRunning && this.currentScene.time.now > this.lastAttack) {
      this.isAttacking = true;
      this.anims.play("adventurerAttack" + this.attackCombo, false);
      this.lastAttack = this.currentScene.time.now + this.attackCooldown;
      this.attackCombo = this.attackCombo === 3 ? 1 : this.attackCombo + 1;
    }
  }
 
  public runLeft(): void {
    this.isRunning = true;
    this.flipX = true;
    this.body.setVelocityX(-200);
    if (!this.isJumping && !this.isAttacking) {
      this.anims.play("adventurerRun", true);
    }
  }

  public runRight(): void {
    this.isRunning = true;
    this.flipX = false;
    this.body.setVelocityX(200);
    if (!this.isJumping && !this.isAttacking) {
      this.anims.play("adventurerRun", true);
    }
  }

  public stopRun(): void {
    this.body.setVelocityX(0);
    this.isRunning = false;
  }

  private isOffTheScreen(): void {
    if (this.y + this.height > this.scene.sys.canvas.height) {
      this.isDead = true;
    }
  }
}
