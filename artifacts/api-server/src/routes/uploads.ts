import { Router } from "express";
import multer from "multer";
import { initializeApp, getApps, cert, type ServiceAccount } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  if (!serviceAccountJson || !storageBucket) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON and FIREBASE_STORAGE_BUCKET env vars are required");
  }
  const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
  return initializeApp({ credential: cert(serviceAccount), storageBucket });
}

router.post("/uploads/hero-image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const app = getAdminApp();
    const bucket = getStorage(app).bucket();

    const safeFilename = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const objectName = `hero_images/${Date.now()}_${safeFilename}`;
    const fileRef = bucket.file(objectName);

    await fileRef.save(req.file.buffer, {
      contentType: req.file.mimetype,
      resumable: false,
      public: true,
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${objectName}`;
    res.json({ url: publicUrl });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed: " + (err as Error).message });
  }
});

router.get("/uploads/hero-image/:key", async (_req, res) => {
  res.status(410).json({
    error: "This proxy endpoint is no longer used. Images are served directly from Firebase Storage.",
  });
});

export default router;
