
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { askQuery } from '../services/api';
import { useToast } from '../hooks/useToast';

export interface DocumentResponse {
  document_id: string;
  extracted_answer: string;
  citation: string;
}

export interface ThemeSummary {
  theme: string;
  summary: string;
}

export interface QueryResponse {
  document_responses: DocumentResponse[];
  final_summary: ThemeSummary[];
  message?: string;
}

interface QueryContextType {
  question: string;
  setQuestion: (query: string) => void;
  response: QueryResponse | null;
  loading: boolean;
  error: string | null;
  submitQuery: () => Promise<void>;
  reset: () => void;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const useQueryContext = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error('useQueryContext must be used within a QueryProvider');
  }
  return context;
};

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const submitQuery = async () => {
    if (!question.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a question.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await askQuery(question);
      setResponse(result);
      
      if (result.message === "No relevant documents found.") {
        toast({
          title: 'Information',
          description: 'No relevant documents found for your query.',
        });
      }
    } catch (err) {
      console.error('Failed to submit query:', err);
      setError('Failed to get response. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setQuestion('');
    setResponse(null);
    setError(null);
  };

  const value = {
    question,
    setQuestion,
    response,
    loading,
    error,
    submitQuery,
    reset
  };

  return (
    <QueryContext.Provider value={value}>
      {children}
    </QueryContext.Provider>
  );
};
