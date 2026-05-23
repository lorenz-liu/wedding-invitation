# Assets

All images, fonts, music, and other media for this project live here.
The build copies this folder to `dist/assets/`.

```
assets/
├── fonts/     # .ttf font files
├── images/    # .png, .jpg, ...
└── music/     # .mp3 and other audio
```

## Usage in code

```typescript
import { assetPath, images } from "@/utils/assets";

// Static image (copied to dist)
<Image src={images.homepageNiu} />
<Image src={assetPath("images/your-photo.jpg")} />

// Bundled font / audio (webpack)
require("@assets/fonts/thin-black.ttf");
require("@assets/music/our-love.mp3");
```

Replace files in this directory, then run `pnpm build:weapp`.
