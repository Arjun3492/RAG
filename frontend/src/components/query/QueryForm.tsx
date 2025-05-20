
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search } from 'lucide-react';

interface QueryFormProps {
  question: string;
  setQuestion: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const QueryForm: React.FC<QueryFormProps> = ({ question, setQuestion, onSubmit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="question" className="text-sm font-medium">
          Ask a question about your documents
        </label>
        <Textarea
          id="question"
          placeholder="e.g., What are the tribunal findings?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="min-h-[100px] resize-none"
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!question.trim() || isLoading}
          className="bg-primary hover:bg-primary/90 flex items-center"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Submit Query
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default QueryForm;
