
import React from 'react';
import { QueryResponse } from '@/context/QueryContext';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ResponseDisplayProps {
  response: QueryResponse;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
  const { document_responses, final_summary, message } = response;

  if (message === "No relevant documents found.") {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No relevant documents found for your query.</p>
        <p className="text-sm mt-2">Try a different question or upload more relevant documents.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {document_responses && document_responses.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Document Responses</h2>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Document ID</TableHead>
                  <TableHead>Extracted Answer</TableHead>
                  <TableHead>Citation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {document_responses.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.document_id}</TableCell>
                    <TableCell>{item.extracted_answer}</TableCell>
                    <TableCell>{item.citation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {final_summary && final_summary.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Final Synthesized Summary</h2>
          <div className="space-y-4">
            {final_summary.map((item, index) => (
              <Card key={index}>
                <CardHeader className="py-3 bg-blue-50">
                  <CardTitle className="text-md font-semibold text-primary">
                    Theme {index + 1} - {item.theme}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-3">
                  <p>{item.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseDisplay;
