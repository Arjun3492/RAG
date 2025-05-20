
import React from 'react';
import { useDocuments } from '../context/DocumentContext';
import DocumentTable from '@/components/document/DocumentTable';
import UploadForm from '@/components/document/UploadForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DocumentsPage: React.FC = () => {
  const { documents, loading, uploadFiles, removeDocument } = useDocuments();

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl font-bold">Documents Management</h1>
          <p className="text-gray-600 mt-1">Upload, view, and manage your documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>
              Upload PDF or image files to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadForm onUpload={uploadFiles} isLoading={loading} />
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document List</CardTitle>
              <CardDescription>
                {documents.length} document{documents.length !== 1 ? 's' : ''} available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentTable 
                documents={documents} 
                onDelete={removeDocument}
                isLoading={loading} 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
