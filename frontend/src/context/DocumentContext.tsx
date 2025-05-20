import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getDocuments, deleteDocument, uploadDocuments } from "../services/api";
import { useToast } from "../hooks/useToast";

export interface Document {
  id: string;
  name: string;
  file_type: string;
  upload_time: string;
}

interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  error: string | null;
  uploadFiles: (files: File[]) => Promise<void>;
  removeDocument: (id: string) => Promise<void>;
  refreshDocuments: () => Promise<void>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
};

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider = ({ children }: DocumentProviderProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const refreshDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError("Failed to load documents. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load documents.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (files: File[]) => {
    setLoading(true);
    if (loading) return;
    try {
      const result = await uploadDocuments(files);

      if (result.uploaded && result.uploaded.length > 0) {
        toast({
          title: "Success",
          description: `${result.uploaded.length} document(s) uploaded successfully.`,
        });

        // Refresh documents list after successful upload
        await refreshDocuments();
      }
    } catch (err) {
      console.error("Failed to upload files:", err);
      toast({
        title: "Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeDocument = async (id: string) => {
    setLoading(true);
    try {
      const result = await deleteDocument(id);

      if (result.status === "deleted") {
        toast({
          title: "Success",
          description: "Document deleted successfully.",
        });

        // Update the state directly instead of refreshing
        setDocuments(documents.filter((doc) => doc.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete document:", err);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load of documents
  useEffect(() => {
    refreshDocuments();
  }, []);

  const value = {
    documents,
    loading,
    error,
    uploadFiles,
    removeDocument,
    refreshDocuments,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};
