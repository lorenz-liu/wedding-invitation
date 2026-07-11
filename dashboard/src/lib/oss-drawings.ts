import OSS from "ali-oss";
import type { GuestRecord } from "./types";
import { resolveAliyunCredentials } from "./credentials";

const SIGNED_URL_TTL_SECONDS = 3600;

async function createDrawingsClient() {
  const credentials = await resolveAliyunCredentials();
  const region = process.env.DRAWINGS_OSS_REGION || "oss-cn-chengdu";
  const bucket = process.env.DRAWINGS_OSS_BUCKET || "guest-drawings";

  const options: OSS.Options = {
    region,
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    bucket,
    authorizationV4: true,
  };

  if (credentials.securityToken) {
    options.stsToken = credentials.securityToken;
  }

  return new OSS(options);
}

export async function attachDrawingUrls(guests: GuestRecord[]): Promise<GuestRecord[]> {
  const client = await createDrawingsClient();

  return Promise.all(
    guests.map(async (guest) => {
      if (!guest.drawingIds.length) {
        return { ...guest, drawings: [] };
      }

      const drawings = await Promise.all(
        guest.drawingIds.map(async (drawingId) => {
          const objectKey = `${guest.id}/${drawingId}.png`;
          try {
            const url = client.signatureUrl(objectKey, {
              expires: SIGNED_URL_TTL_SECONDS,
            });
            return { id: drawingId, url };
          } catch {
            return { id: drawingId, url: "" };
          }
        }),
      );

      return {
        ...guest,
        drawings: drawings.filter((item) => item.url),
      };
    }),
  );
}
