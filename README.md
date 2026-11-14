# Phaser 3 sprite sheet animation example

A minimal Phaser 3 scene that plays a character's idle, walk, attack, jump and roll animations from JSON Hash atlases. No build step: open it with any static server.

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Keys: `I` idle, `W` walk, `SPACE` attack, `J` jump, `R` roll. One-shot animations return to idle when they finish.

## What it shows

- **One atlas per animation.** Each action is a PNG sheet plus a JSON Hash atlas, loaded with `this.load.atlas(key, png, json)`.
- **Per-frame timing from the JSON.** Phaser keeps extra frame fields in `customData` and ignores `duration` unless you pass it per frame when building the animation (`main.js`, tested on Phaser `3.90.0`; on `3.80+` a per-frame `duration` replaces the base frame time as long as `play()` does not override `frameRate`).
- **Frame order.** `texture.getFrameNames()` has no guaranteed order; the frame names end in a two-digit index, so a plain `.sort()` is enough.
- **Feet on the ground.** The atlas pivot is `(0.5, 0.875)`, the foot point of the 256×256 cell, so the sprite's `y` is where the feet stand and every action lines up on the same ground line.
- **Looping vs one-shot.** `repeat: -1` for idle and walk; attack, jump and roll play once and fire `ANIMATION_COMPLETE`, which switches back to idle. A one-shot is not restarted halfway through.

## Files

```
index.html                 loads Phaser 3.90 from jsDelivr
main.js                    the whole scene (~60 lines)
assets/moss-knight/        five PNG sheets + JSON atlases, CC0
```

## Art

The Moss Knight sheets come from the free CC0 packs at [spritecanvas.com/free-sprite-sheets](https://spritecanvas.com/free-sprite-sheets/). They were generated with AI in the [SpriteCanvas](https://spritecanvas.com/) workflow (character image → animation video → cleaned, aligned sprite sheet with an atlas). You can use them in commercial projects without credit.

To swap in your own character, export a sprite sheet with a JSON Hash atlas (Phaser format) from any tool and keep the file names, or change the paths in `ANIMATIONS` in `main.js`.

## License

Code: MIT (see `LICENSE`). Art in `assets/`: CC0 1.0 (see `assets/moss-knight/LICENSE.txt`).
