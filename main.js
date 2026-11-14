// Phaser 3 sprite sheet animation with JSON Hash atlases.
// Every animation is its own atlas (PNG + JSON). Frame timing comes from the JSON, not from a fixed frameRate.

const ANIMATIONS = [
  { key: 'idle', loop: true },
  { key: 'walk', loop: true },
  { key: 'attack', loop: false },
  { key: 'jump', loop: false },
  { key: 'roll', loop: false },
];

class Demo extends Phaser.Scene {
  preload() {
    for (const { key } of ANIMATIONS) {
      this.load.atlas(`knight-${key}`, `assets/moss-knight/moss-knight-${key}.png`, `assets/moss-knight/moss-knight-${key}.json`);
    }
  }

  create() {
    for (const { key, loop } of ANIMATIONS) {
      const texture = this.textures.get(`knight-${key}`);
      this.anims.create({
        key,
        // getFrameNames() has no guaranteed order; the two-digit suffix sorts correctly.
        // Phaser keeps the extra JSON fields in customData but ignores `duration`, so pass it per frame.
        frames: texture.getFrameNames().sort().map((frame) => ({ key: `knight-${key}`, frame, duration: texture.get(frame).customData.duration })),
        repeat: loop ? -1 : 0,
      });
    }

    const groundY = 300;
    this.add.rectangle(320, groundY, 640, 2, 0x88aa66).setOrigin(0.5, 0);
    // The atlas pivot (0.5, 0.875) is the foot point, so the sprite's y is where the feet stand.
    this.knight = this.add.sprite(320, groundY, 'knight-idle', 'moss-knight-idle-00');
    this.knight.play('idle');

    // One-shot animations go back to idle when they finish. Looping ones never fire this event.
    this.knight.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => this.knight.play('idle'));

    const label = this.add.text(12, 12, '', { fontFamily: 'monospace', fontSize: '14px', color: '#e8e8e8' });
    const keys = { I: 'idle', W: 'walk', SPACE: 'attack', J: 'jump', R: 'roll' };
    for (const [code, key] of Object.entries(keys)) {
      this.input.keyboard.on(`keydown-${code}`, () => {
        const current = this.knight.anims.currentAnim?.key;
        // Don't restart a one-shot halfway through; `true` ignores the call if the animation is already playing.
        if (current === 'attack' || current === 'jump' || current === 'roll') return;
        this.knight.play(key, true);
      });
    }
    this.events.on('update', () => label.setText(`I idle  W walk  SPACE attack  J jump  R roll\nplaying: ${this.knight.anims.currentAnim?.key}`));
  }
}

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 640,
  height: 360,
  backgroundColor: '#1d2021',
  scene: Demo,
});
