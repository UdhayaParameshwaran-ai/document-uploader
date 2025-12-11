## 1. Tech Stack Choices

### **Q1. What frontend framework did you use and why?**

**React (with Vite + Tailwind CSS)**  
**Reasoning:**

- Component-based UI architecture
- Fast development with Vite (HMR, lightning rebuilds)
- Large ecosystem & easy state management
- Tailwind enables fast, consistent styling

---

### **Q2. What backend framework did you choose and why?**

**Node.js + Express**  
**Reasoning:**

- Minimal and flexible
- Perfect for REST APIs
- Easy middleware integration (Multer for file uploads)
- Works smoothly with Drizzle + Postgres

---

### **Q3. What database did you choose and why?**

**PostgreSQL (Neon DB) with Drizzle ORM**  
**Reasoning:**

- Reliable relational database
- Free serverless Neon DB suitable for development
- Drizzle ORM provides type-safe queries and easy migrations

---

### **Q4. If you were to support 1,000 users, what changes would you consider?**

| Area            | Improvement                                      |
| --------------- | ------------------------------------------------ |
| File Storage    | Move from local storage → AWS S3 / Cloudflare R2 |
| Database        | Add indexes, connection pooling, caching (Redis) |
| Backend Scaling | Use PM2, load balancer, horizontal scaling       |
| Frontend        | Deploy on CDN (Vercel/Netlify)                   |
| Security        | Add authentication, JWT, signed URLs             |
| Observability   | Logging, metrics, tracing                        |

---

## 2. Architecture Overview

### **Flow Description (Simple)**

1. User uploads a PDF from frontend
2. Frontend sends multipart form-data to backend
3. Backend (Express + Multer) stores file in `uploads/`
4. Metadata saved in Postgres using Drizzle ORM
5. User views all uploaded documents
6. Download and delete actions sent to backend
7. Backend reads/writes file + DB, responds to frontend

---

### **ASCII Architecture**

Frontend (React) ↔ Backend (Node + Express) ↔ PostgreSQL
↕
File Storage (uploads/)

## 3. API Documnetation

### 1. Upload a PDF

**Endpoint**: /documents/upload

**Method:** POST

**Type:** Multipart form-data

```
curl -X POST http://localhost:3000/documents/upload \
  -F "file=@./sample.pdf"
```

**Response:**

```
{
    "message": "PDF uploaded",
    "file": {
        "id": 6,
        "filename": "Question 1 There are two lines in the city Metro rail (Green line and Red line). Green line stations are A (1) 5.pdf",
        "filepath": "uploads\\1765434877885-Question 1 There are two lines in the city Metro rail (Green line and Red line). Green line stations are A (1) 5.pdf",
        "filesize": 4826699,
        "created_at": "2025-12-11T06:34:41.109Z"
    }
}
```

##

### 2. List All Documents

**Endpoint**: /documents

**Method**: GET

```
curl http://localhost:3000/documents

```

**Response**:

```
{
    "message": "Documents fetched successfully",
    "data": [
        {
            "id": 2,
            "filename": "The_Dual-Edged_Sword_of_Social_Media.pdf",
            "filepath": "uploads\\1765297181913-The_Dual-Edged_Sword_of_Social_Media.pdf",
            "filesize": 6063152,
            "created_at": "2025-12-09T16:19:44.558Z"
        },
        {
            "id": 5,
            "filename": "thesis 12.pdf",
            "filepath": "uploads\\1765429072248-thesis 12.pdf",
            "filesize": 1308329,
            "created_at": "2025-12-11T04:57:54.379Z"
        },
        {
            "id": 6,
            "filename": "Question 1 There are two lines in the city Metro rail (Green line and Red line). Green line stations are A (1) 5.pdf",
            "filepath": "uploads\\1765434877885-Question 1 There are two lines in the city Metro rail (Green line and Red line). Green line stations are A (1) 5.pdf",
            "filesize": 4826699,
            "created_at": "2025-12-11T06:34:41.109Z"
        }
    ]
}
```

##

### 3. Download a Document

**Endpoint**: /documents/:id

**Method**: GET

```
curl -O http://localhost:3000/documents/2
```

**Response**: File will get download.

##

### 4. Delete a Document

**Endpoint**: /documents/:id

**Method**: DELETE

```
curl -O http://localhost:3000/documents/2
```

**Response**: File will get deleted from DB and Server as well.

```
{
    "message": "Document deleted successfully",
    "file": "Question 1 There are two lines in the city Metro rail (Green line and Red line). Green line stations are A (1) 5.pdf"
}
```

## 4. Data flow description

### Q5. Step-by-Step Process (Upload & Download)

**_A. File Upload Flow_**

- User selects a PDF and clicks Upload on the frontend.

- Frontend sends a POST /documents/upload request with multipart/form-data.

- Express receives the request and Multer processes the file.

- File is validated (PDF only, size limit).

- Multer saves the file inside the uploads/ folder with a unique filename.

- Backend stores file metadata (original name, stored filename, size, created_at) in the PostgreSQL database via Drizzle ORM.

- Server returns a success response and the frontend updates the UI.

**_B. File Download Flow_**

- User clicks Download for a document.

- Frontend sends a GET /documents/:id request.

- Backend looks up the metadata in PostgreSQL.

- Backend locates the file inside uploads/ using stored_filename.

- Express sets correct headers (Content-Type, Content-Disposition) and streams the PDF back to the client.

- Browser downloads the file or opens it in the PDF viewer.

## 5. Assumptions

### Q6. What assumptions were made while building this project?

- Single User System

  - No authentication or login system is required.

  - All documents belong to one default user.

- File Type Restriction

  - Only PDF files are allowed for upload.

  - No support for images, Word docs, or other formats.

- File Size Limit

  - Maximum upload size assumed to be 5–10 MB (configurable via Multer).

  - Large medical scans are not considered for this assignment.

- Local File Storage

  - All files are stored inside a local uploads/ folder.

  - No cloud storage (S3, GCS, etc.) is used.

- Simple Concurrency Handling

  - Application assumes light usage with minimal concurrent uploads.

  - No advanced concurrency or queue system is required.

- Synchronous Processing

  - File is uploaded and saved immediately without background jobs.

  - No virus scanning or OCR processing is performed.

- Trusts Frontend Constraints

  - Frontend prevents non-PDF files, but backend still validates for safety.

- Database Reliability

  - PostgreSQL (Neon DB) is assumed to be always reachable and stable.

  - No fallback or caching layer is implemented.

  - No Versioning of Documents

  - If a user uploads the same file again, it is treated as a new document.

  - No overwrite or versioning logic.
