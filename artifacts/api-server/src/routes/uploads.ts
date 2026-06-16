import { Router } from "express";
import multer from "multer";
import { objectStorageClient } from "../replit_integrations/object_storage/objectStorage.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const BUCKET_ID = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID ?? "";

router.post("/uploads/hero-image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });
    if (!BUCKET_ID) return res.status(500).json({ error: "Object storage not configured" });

    const safeFilename = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const objectName = `hero_images/${Date.now()}_${safeFilename}`;

    const bucket = objectStorageClient.bucket(BUCKET_ID);
    const file = bucket.file(objectName);

    await file.save(req.file.buffer, {
      contentType: req.file.mimetype,
      resumable: false,
    });

    const key = Buffer.from(objectName).toString("base64url");
    res.json({ url: `/api/uploads/hero-image/${key}` });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed: " + (err as Error).message });
  }
});

router.get("/uploads/hero-image/:key", async (req, res) => {
  try {
    if (!BUCKET_ID) return res.status(500).json({ error: "Object storage not configured" });

    const objectName = Buffer.from(req.params.key, "base64url").toString("utf8");
    const bucket = objectStorageClient.bucket(BUCKET_ID);
    const file = bucket.file(objectName);

    const [exists] = await file.exists();
    if (!exists) return res.status(404).json({ error: "Image not found" });

    const [metadata] = await file.getMetadata();
    res.setHeader("Content-Type", (metadata.contentType as string) || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=31536000");

    file.createReadStream()
      .on("error", () => { if (!res.headersSent) res.status(500).end(); })
      .pipe(res);
  } catch (err) {
    console.error("Serve error:", err);
    if (!res.headersSent) res.status(500).json({ error: "Failed to serve image" });
  }
});

export default router;
