'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { runFlow } from '@genkit-ai/next/client';
// Adjust the path to where your flow is exported from.
// This assumes your flows are structured in an 'ai/flows' directory relative to 'src'.
import { generateSyllabusBasedQuestions } from '@/ai/flows/generate-syllabus-questions';
import { useToast } from '@/hooks/use-toast';

// Define the structure for a single question
interface Question {
  questionText: string;
  marks: number;
}

// Define the expected output structure of your flow
// This should match the OutputSchema of your generateSyllabusBasedQuestions flow
type SyllabusQuestionsOutput = Array<{
  questionText: string;
  marks: number;
}>;


export default function SyllabusQuizPage() {
  const [syllabusText, setSyllabusText] = useState('');
  const [pastExamQuestionsText, setPastExamQuestionsText] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateQuestions = async () => {
    if (!syllabusText.trim()) {
      setError('Syllabus text cannot be empty.');
      toast({ title: 'Error', description: 'Syllabus text cannot be empty.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedQuestions([]); // Clear previous questions

    try {
      // The first argument to runFlow is the flow reference imported above.
      // The second argument is the input object for the flow.
      const result = await runFlow<SyllabusQuestionsOutput, { syllabusText: string; pastExamQuestionsText: string }>(
        generateSyllabusBasedQuestions,
        { syllabusText, pastExamQuestionsText }
      );

      if (result && result.length > 0) {
        setGeneratedQuestions(result);
        toast({ title: 'Success!', description: `Generated ${result.length} questions.`, variant: 'success' });
      } else {
        // This case handles if the flow runs successfully but returns an empty array or undefined/null
        setError('The AI returned an empty or invalid set of questions. Please try again or refine your input.');
        toast({ title: 'No Questions Generated', description: 'The AI returned no questions. Your input might be too restrictive or unclear.', variant: 'warning' });
        setGeneratedQuestions([]); // Ensure it's empty
      }
    } catch (e: any) {
      console.error('Error generating questions:', e);
      let errorMessage = 'An unexpected error occurred.';
      if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }
      // Check for specific Genkit error structures if available, e.g., e.details
      if (e.details) {
        errorMessage = `${errorMessage} Details: ${e.details}`;
      }
      setError(`Failed to generate questions: ${errorMessage}`);
      toast({ title: 'Generation Failed', description: errorMessage, variant: 'destructive' });
      setGeneratedQuestions([]); // Clear any partial results
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <Card className="w-full max-w-4xl shadow-lg rounded-lg">
        <CardHeader className="text-center bg-primary text-primary-foreground p-6">
          <CardTitle className="text-3xl font-bold">Syllabus-Based Question Generator</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Paste your syllabus and (optionally) past exam questions to generate a custom set of 50 questions with marks.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="syllabusText" className="text-lg font-medium">Syllabus Text (Required)</Label>
              <Textarea
                id="syllabusText"
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                placeholder="Paste the full syllabus text here..."
                rows={15}
                className="text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pastExamQuestionsText" className="text-lg font-medium">Past Exam Questions (Optional)</Label>
              <Textarea
                id="pastExamQuestionsText"
                value={pastExamQuestionsText}
                onChange={(e) => setPastExamQuestionsText(e.target.value)}
                placeholder="Paste relevant past exam questions here to guide the AI..."
                rows={15}
                className="text-base"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerateQuestions}
            disabled={isLoading || !syllabusText.trim()}
            className="w-full text-lg py-3 transition-transform duration-150 ease-in-out hover:scale-[1.02]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Questions...
              </>
            ) : (
              'Generate 50 Questions'
            )}
          </Button>

          {error && (
            <div className="p-4 my-4 rounded-md bg-destructive/10 text-destructive border border-destructive">
              <p className="font-semibold">Error Generating Questions:</p>
              <p className="whitespace-pre-line">{error}</p>
            </div>
          )}

          {generatedQuestions.length > 0 && !isLoading && (
            <div className="space-y-6 pt-6 border-t mt-6">
              <h3 className="text-2xl font-semibold text-center text-primary">Generated Questions</h3>
              {generatedQuestions.map((q, index) => (
                <Card key={index} className="shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    <CardDescription>Marks: {q.marks}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base whitespace-pre-line">{q.questionText}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && !error && generatedQuestions.length === 0 && (
            <div className="text-center text-muted-foreground pt-6 border-t mt-6">
              { syllabusText.trim() ? (
                <p>Click "Generate 50 Questions" to see the results.</p>
              ) : (
                <p>Enter your syllabus (and optionally past questions) and click "Generate 50 Questions" to begin.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
