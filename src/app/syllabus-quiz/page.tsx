'use client';
import { useState } from 'react';
import { generateSyllabusBasedQuestions } from '@/ai/flows/generate-syllabus-questions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

// Define type for questions
type Question = {
  questionText: string;
  marks: number;
};

export default function SyllabusQuizPage() {
  const [syllabusText, setSyllabusText] = useState('');
  const [pastExamQuestionsText, setPastExamQuestionsText] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGeneratedQuestions([]); // Clear previous questions

    // Basic validation
    if (!syllabusText.trim()) {
      setError('Syllabus text cannot be empty.');
      setIsLoading(false);
      return;
    }
    // Past exam questions are optional based on the prompt structure, so no validation for emptiness here.

    try {
      const result = await generateSyllabusBasedQuestions({ syllabusText, pastExamQuestionsText });
      
      // Ensure result is an array, as expected by SyllabusQuestionsOutputSchema
      if (Array.isArray(result) && result.length > 0) {
        setGeneratedQuestions(result);
      } else if (Array.isArray(result) && result.length === 0) {
        setError('No questions were generated. The input might have been too restrictive, or the AI could not find relevant topics to generate questions for.');
      } 
      else {
        // This case handles if 'result' is not an array or is undefined/null,
        // which would indicate an issue with the flow's output or an unexpected response.
        console.warn('Unexpected result format from generateSyllabusBasedQuestions:', result);
        setError('Received an unexpected format from the question generation service. Expected an array of questions.');
      }
    } catch (err: any) {
      console.error('Error generating questions:', err);
      let errorMessage = 'Failed to generate questions. An unexpected error occurred.';
      if (err instanceof Error) {
        errorMessage = `Failed to generate questions: ${err.message}`;
      } else if (typeof err === 'string') {
        errorMessage = `Failed to generate questions: ${err}`;
      }
      // If the error object has more specific details (e.g. from Genkit or AI service)
      if (err.details) {
        errorMessage += ` Details: ${err.details}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 xl:px-20 md:px-10 sm:px-2">
      <Card className="mb-8 shadow-lg rounded-lg">
        <CardHeader className="bg-gray-50 dark:bg-gray-800">
          <CardTitle className="text-2xl md:text-3xl font-bold text-center">Syllabus-Based Question Generator</CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-300 mt-1">
            Input the syllabus text and (optionally) past exam questions to generate a custom set of quiz questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="syllabusText" className="font-semibold text-lg">Syllabus Text (Required)</Label>
              <Textarea
                id="syllabusText"
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                rows={12}
                placeholder="Paste the full syllabus text here..."
                disabled={isLoading}
                className="text-base p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pastExamQuestionsText" className="font-semibold text-lg">Past Exam Questions (Optional)</Label>
              <Textarea
                id="pastExamQuestionsText"
                value={pastExamQuestionsText}
                onChange={(e) => setPastExamQuestionsText(e.target.value)}
                rows={12}
                placeholder="Paste relevant past exam questions here. This helps the AI understand the desired style, topic emphasis, and difficulty."
                disabled={isLoading}
                className="text-base p-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !syllabusText.trim()}
              className="w-full sm:w-auto py-3 px-6 text-lg font-medium rounded-md transition-colors duration-150 ease-in-out"
            >
              {isLoading ? 'Generating Questions...' : 'Generate Questions'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center my-6 p-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-3"></div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading questions, please wait...</p>
        </div>
      )}
      
      {error && (
          <Card className="mt-6 bg-red-50 border-red-300 shadow-md">
            <CardHeader>
              <CardTitle className="text-red-700 text-xl font-semibold">Error Generating Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 text-base whitespace-pre-wrap">{error}</p>
            </CardContent>
          </Card>
      )}

      {!isLoading && !error && generatedQuestions.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-5 text-center">Generated Questions ({generatedQuestions.length})</h2>
          <div className="space-y-4">
            {generatedQuestions.map((q, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="bg-gray-50 dark:bg-gray-700">
                  <CardTitle className="text-xl">Question {index + 1}</CardTitle>
                  <CardDescription className="text-base">Marks: {q.marks}</CardDescription>
                </CardHeader>
                <CardContent className="p-5">
                  <p className="text-gray-800 dark:text-gray-200 text-base" style={{ whiteSpace: 'pre-wrap' }}>{q.questionText}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {!isLoading && !error && generatedQuestions.length === 0 && syllabusText.trim() && (
        <div className="mt-6 p-4 text-center text-gray-500 dark:text-gray-400">
          <p>Click "Generate Questions" to start. If no questions appear after generation, check if an error message was displayed or if your input was too restrictive.</p>
        </div>
      )}
    </main>
  );
}
