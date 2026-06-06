# Assets

All images, fonts, music, and other media for this project live here.

```
assets/
├── fonts/     # .ttf font files
├── images/    # .png, .jpg, ...
└── music/     # .mp3 and other audio
```

## Upload to Aliyun OSS

Recommended: run in **CloudShell**, or locally after `aliyun configure --mode OAuth` (no long-lived AccessKey). See [infra/aliyun/SETUP.md](../infra/aliyun/SETUP.md).

```bash
pnpm upload:oss-assets
```

Assets are served at `https://wedding-asset.oss-cn-chengdu.aliyuncs.com/assets/...`.

Set `ASSETS_CACHE_VERSION` in `src/constants/aliyun.ts`, then rebuild.

Single file:

```bash
pnpm upload:oss-file images/homepage-niu.png
```

## Usage in code

```typescript
import { images } from "@/utils/assets";

<Image src={images.homepageNiu} />
```
