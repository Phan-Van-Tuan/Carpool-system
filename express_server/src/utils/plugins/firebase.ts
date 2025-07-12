var admin = require("firebase-admin");

var serviceAccount = require("../../../private/express-firebase-30f76-firebase-adminsdk-fbsvc-b31be344d6.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const firebaseAdmin = admin;

export async function generateSignedUrl(
  filePath: string,
  type: "read" | "write"
): Promise<string> {
  const file = admin.storage().bucket().file(filePath);
  const farFuture = Date.now() + 100 * 365 * 24 * 60 * 60 * 1000;

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: type,
    expires: farFuture,
    contentType: type === "write" ? "image/jpeg" : undefined,
  });

  return url;
}
