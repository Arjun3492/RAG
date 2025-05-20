
import React from 'react';
import { useQueryContext } from '../context/QueryContext';
import QueryForm from '@/components/query/QueryForm';
import ResponseDisplay from '@/components/query/ResponseDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AskPage: React.FC = () => {
  const { question, setQuestion, response, loading, submitQuery } = useQueryContext();

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ask Query</h1>
        <p className="text-gray-600 mt-1">Ask questions about your uploaded documents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Question</CardTitle>
          <CardDescription>
            Enter a question related to your uploaded documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QueryForm 
            question={question} 
            setQuestion={setQuestion} 
            onSubmit={submitQuery} 
            isLoading={loading} 
          />
        </CardContent>
      </Card>

      {response && (
        <Card>
          <CardHeader>
            <CardTitle>Query Results</CardTitle>
            <CardDescription>
              Results for: "{question}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponseDisplay response={response} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AskPage;
