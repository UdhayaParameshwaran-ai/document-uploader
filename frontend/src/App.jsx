import { useState, useEffect } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { DocumentShimmer } from "./DocumentShimmer";

const BASE_URL = "http://localhost:3000";

function App() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // success or error
  const [loading, setLoading] = useState(true); //for shimmer UI

  // Fetch all documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      console.log(BASE_URL);
      const res = await axios.get(`${BASE_URL}/documents`);
      setDocuments(res.data?.data);
      console.log(res.data?.data);
    } catch (err) {
      showMessage("Failed to load documents", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validation
    if (selectedFile.type !== "application/pdf") {
      showMessage("Only PDF files are allowed", "error");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      showMessage("File size must be less than 10MB", "error");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      await axios.post(`${BASE_URL}/documents/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showMessage("PDF uploaded successfully!", "success");
      setFile(null);
      document.getElementById("file-input").value = "";
      fetchDocuments();
    } catch (err) {
      const msg = err.response?.data?.msg || "Upload failed";
      showMessage(msg, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const res = await axios.get(`${BASE_URL}/documents/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showMessage("Download failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await axios.delete(`${BASE_URL}/documents/${id}`);
      showMessage("Document deleted", "success");
      fetchDocuments();
    } catch (err) {
      showMessage("Delete failed", "error");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-10">
            PDF Document Manager
          </h1>

          {/* Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Upload className="w-7 h-7" />
              Upload New PDF
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="flex-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-600 file:text-white
                  hover:file:bg-indigo-700
                  cursor-pointer"
              />

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`px-8 py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2
                  ${
                    file && !uploading
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-400 cursor-not-allowed"
                  } transition`}
              >
                {uploading ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload
                  </>
                )}
              </button>
            </div>

            {file && (
              <p className="mt-3 text-sm text-gray-500">
                Selected: <span className="font-medium">{file.name}</span> (
                {(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            <div className="text-gray-500 text-sm mt-2">
              *Upload within 10MB file
            </div>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div
              className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Documents List */}
          <div className="mt-10 bg-white rounded-xl shadow-lg overflow-hidden">
            <h2 className="text-2xl font-semibold p-6 pb-4 border-b flex items-center gap-3">
              <FileText className="w-7 h-7" />
              Your Documents ({documents.length})
            </h2>

            {loading ? (
              <DocumentShimmer />
            ) : documents.length === 0 ? (
              <p className="text-center text-gray-500 py-12">
                No documents uploaded yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <li
                    key={doc._id || doc.id}
                    className="px-6 py-5 hover:bg-gray-50 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <FileText className="w-10 h-10 text-indigo-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {doc.filename || doc.originalName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Uploaded:{" "}
                          {new Date(doc.created_at).toLocaleDateString()}
                          {" • "}
                          {(doc.filesize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleDownload(doc._id || doc.id, doc.filename)
                        }
                        className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id || doc.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
