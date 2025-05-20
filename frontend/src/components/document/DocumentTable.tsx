
import React from 'react';
import { Document } from '@/context/DocumentContext';
import { formatDateTime, getFileTypeLabel } from '@/utils/formatters';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { FileText, FileImage, Trash } from 'lucide-react';

interface DocumentTableProps {
  documents: Document[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const DocumentTable: React.FC<DocumentTableProps> = ({ documents, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse text-primary">Loading documents...</div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No documents uploaded yet.</p>
        <p className="text-sm mt-2">Upload documents to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Document Name</TableHead>
            <TableHead>File Type</TableHead>
            <TableHead>Upload Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="p-0 pl-4">
                {doc.file_type === 'pdf' ? (
                  <FileText size={18} className="text-red-500" />
                ) : (
                  <FileImage size={18} className="text-blue-500" />
                )}
              </TableCell>
              <TableCell className="font-medium">{doc.name}</TableCell>
              <TableCell>{getFileTypeLabel(doc.file_type)}</TableCell>
              <TableCell>{formatDateTime(doc.upload_time)}</TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash size={16} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Document</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{doc.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(doc.id)} className="bg-red-500 hover:bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentTable;
