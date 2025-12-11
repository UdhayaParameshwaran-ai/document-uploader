# Document Uploader

A simple full-stack healthcare portal that allows a user (patient) to upload, view, download, and delete medical documents (PDF files).
Built using **_React + Tailwind CSS, Node.js/Express, Drizzle ORM, and Neon PostgreSQL_**.

## Project Overview

### Frontend (React + Tailwind CSS)

- Upload PDF documents
- Display list of uploaded documents
- Download any uploaded file
- Delete a document
- Smooth UI with success/error messages

### Backend (Node.js + Express)

- REST APIs:

  - Upload PDF

  - Fetch all documents

  - Download document

  - Delete document

  - File uploads handled using **Multer**

  - Uploaded files stored locally in an uploads/ folder

  - Metadata stored in Postgres using Drizzle ORM

### Database (Neon PostgreSQL + Drizzle ORM)

Table stores:

- `id`

- `filename`

- `filepath`

- `filesize`

- `created_at`

User authentication is not required (single-user system).

## Project Setup

### 1. Clone the Repository

```
git clone https://github.com/UdhayaParameshwaran-ai/document-uploader.git
cd document-uploader
```

### Backend Setup

### 2. Install Backend Dependencies

```
cd backend
npm install

```

### 3. Create .env file

Create a .env file inside the backend folder:

```
DATABASE_URL=your_neon_postgres_connection_string
```

### 4. Run Drizzle Migrations

```
npm run migrate
```

### 5. Start backend Server

```
node index.js
```

**The backend will run at: http://localhost:3000**

### Frontend Setup (React + Vite + Tailwind)

### 6. Install Frontend Dependencies

```
cd ../frontend
npm install

```

### 7. Start Frontend

```
npm run dev

```

**App will run at: http://localhost:5173**

## API Documentation

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
