import express from "express";
import { db } from "./utils/db.js";
import { documentTable } from "./utils/schema.js";
import { upload } from "./utils/upload.js";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());

//Upload the document
app.post("/documents/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No PDF file uploaded or invalid file type");
    }

    const result = await db
      .insert(documentTable)
      .values({
        filename: req.file.originalname,
        filepath: req.file.path,
        filesize: req.file.size,
      })
      .returning();

    res.status(201).json({
      message: "PDF uploaded",
      file: result[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Error while uploading" });
  }
});

//List all the document
app.get("/documents", async (req, res) => {
  try {
    const result = await db.select().from(documentTable);
    res.status(200).json({
      message: "Documents fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

//download a document
app.get("/documents/:id", async (req, res) => {
  try {
    const id = req.params.id;

    //fetching the document from DB
    const result = await db
      .select()
      .from(documentTable)
      .where(eq(documentTable.id, id));

    if (result.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    const fileRecord = result[0];
    const filePath = path.resolve(fileRecord.filepath);

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ error: "File missing from server storage" });
    }

    return res.download(filePath, fileRecord.filename);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to download file" });
  }
});

//delete a document
app.delete("/documents/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const result = await db
      .select()
      .from(documentTable)
      .where(eq(documentTable.id, id));

    if (result.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    const file = result[0];
    const filePath = path.resolve(file.filepath);

    //deleting document in loacl storage
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    //deleting document in DB
    await db.delete(documentTable).where(eq(documentTable.id, id));

    res.status(200).json({
      message: "Document deleted successfully",
      file: file.filename,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete file" });
  }
});

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
