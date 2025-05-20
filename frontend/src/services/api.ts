
// API base URL - replace with your actual API endpoint
const API_BASE_URL = import.meta.env.API_BASE_URL || "http://localhost:8000";

// Utility function to handle errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // Try to parse error message from response
    try {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error ${response.status}`);
    } catch (e) {
      throw new Error(`HTTP error ${response.status}`);
    }
  }
  return response.json();
};

// Get the list of all documents
export const getDocuments = async () => {
  console.log("api_base_url", API_BASE_URL)
  const response = await fetch(`${API_BASE_URL}/documents`);
  return handleResponse(response);
};

// Upload documents
export const uploadDocuments = async (files: File[]) => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE_URL}/upload-documents`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse(response);
};

// Delete a document
export const deleteDocument = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
};

// Submit a query
export const askQuery = async (question: string) => {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  return handleResponse(response);
};
