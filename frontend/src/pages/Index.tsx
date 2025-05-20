
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-3xl w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            DocQuery
          </h1>
          <p className="text-xl text-gray-600">
            Upload documents and get intelligent answers to your questions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <FileText size={30} className="text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl">Manage Documents</CardTitle>
              <CardDescription>
                Upload and organize your documents for quick access
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pt-4">
              <Link to="/documents">
                <Button className="bg-primary hover:bg-primary/90">
                  <FileText className="mr-2 h-4 w-4" />
                  View Documents
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <Search size={30} className="text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl">Ask Questions</CardTitle>
              <CardDescription>
                Get intelligent answers from your document collection
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pt-4">
              <Link to="/ask">
                <Button className="bg-primary hover:bg-primary/90">
                  <Search className="mr-2 h-4 w-4" />
                  Ask a Query
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <p className="text-sm text-gray-500 mt-12">
          Upload PDF and image files to get started with document analysis
        </p>
      </div>
    </div>
  );
};

export default Index;
