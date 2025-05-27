'use server';
import { defineFlow, run } from 'genkit';
import { z } from 'zod';
import { ai } from '@/ai/ai-instance'; // Import the shared AI instance
import { generateFlowchart } from './generate-flowchart'; // Assuming this exists

// Define the output structure for each question
const QuestionOutputSchema = z.object({
  questionText: z.string(),
  marks: z.number(),
});

// Define the overall output structure for the flow
const SyllabusQuestionsOutputSchema = z.array(QuestionOutputSchema);

export const generateSyllabusBasedQuestions = defineFlow(
  {
    name: 'generateSyllabusBasedQuestions',
    inputSchema: z.object({
      syllabusText: z.string(),
      pastExamQuestionsText: z.string(),
    }),
    outputSchema: SyllabusQuestionsOutputSchema,
  },
  async (input) => {
    const { syllabusText, pastExamQuestionsText } = input;

    // 2a. Generate Flowchart 1 (Overall Syllabus Flowchart)
    const flowchart1Output = await run('generate-overall-syllabus-flowchart', async () =>
      generateFlowchart({
        topic: 'Overall Syllabus Structure',
        information: syllabusText,
      })
    );
    const flowchart1Text = flowchart1Output.flowchart;

    // 2b. Analyze Inputs for Core Topics
    const analyzeCoreTopicsPrompt = ai.definePrompt(
      {
        name: 'analyzeCoreTopicsPrompt',
        inputSchema: z.object({
          syllabusText: z.string(),
          pastExamQuestionsText: z.string(),
        }),
        outputSchema: z.object({ coreTopicsText: z.string() }),
      },
      async (input) => {
        return {
          prompt: `
           You are an expert curriculum analyst. Your task is to identify the most critical and frequently tested core topics by synthesizing information from the provided syllabus and a list of past exam questions.

           Syllabus:
           ---
           ${input.syllabusText}
           ---

           Past Exam Questions:
           ---
           ${input.pastExamQuestionsText}
           ---

           Analyze both documents thoroughly. Identify topics that are:
           1.  Central to the syllabus structure.
           2.  Explicitly mentioned multiple times or heavily emphasized in the syllabus.
           3.  Frequently appear in the past exam questions, indicating their importance in assessments.
           4.  Fundamental concepts upon which other topics build.

           List the identified core topics/themes clearly. These topics will be used to create a focused study guide and ensure comprehensive question coverage on the most vital areas.
           Output the list of core topics as a comma-separated string or a numbered list.
           `,
        };
      }
    );

    const coreTopicsResponse = await analyzeCoreTopicsPrompt.generate({
      input: { syllabusText, pastExamQuestionsText },
    });
    const coreTopicsText = coreTopicsResponse.output?.coreTopicsText ?? '';
    // TODO: Potentially parse coreTopicsText if it's a list

    // 2c. Generate Flowchart 2 (Core Topics Flowchart)
    const flowchart2Output = await run('generate-core-topics-flowchart', async () =>
      generateFlowchart({
        topic: 'Core Syllabus Topics',
        information: coreTopicsText, // Assuming generateFlowchart can take a string of comma-separated topics as 'information'
      })
    );
    const flowchart2Text = flowchart2Output.flowchart;

    // 2d. Question Generation Logic (Main AI Call)
    const generateSyllabusQuestionsPrompt = ai.definePrompt(
      {
        name: 'generateSyllabusQuestionsPrompt',
        inputSchema: z.object({
          syllabusText: z.string(),
          flowchart1Text: z.string(),
          flowchart2Text: z.string(),
          pastExamQuestionsText: z.string(),
        }),
        outputSchema: SyllabusQuestionsOutputSchema,
      },
      async (input) => {
        return {
          prompt: `
           You are an expert Computer Science examination author. Your task is to generate EXACTLY 50 unique exam questions.

           You will be provided with:
           1.  The course syllabus.
           2.  An overall flowchart/roadmap of the syllabus.
           3.  A focused flowchart/roadmap of core, frequently tested topics.
           4.  A list of past exam questions to guide style, topic emphasis, and difficulty for different mark values.

           Syllabus:
           ---
           ${input.syllabusText}
           ---

           Overall Syllabus Flowchart:
           ---
           ${input.flowchart1Text}
           ---

           Core Topics Flowchart:
           ---
           ${input.flowchart2Text}
           ---

           Past Exam Questions (for style, topic emphasis, and mark/complexity reference):
           ---
           ${input.pastExamQuestionsText}
           ---

           Question Generation Requirements:
           1.  **Quantity:** Generate EXACTLY 50 questions. Do not generate more or fewer.
           2.  **Topic Coverage:** Questions must comprehensively cover topics derived from the syllabus, utilizing insights from both provided flowcharts. Ensure a breadth of topics are addressed.
           3.  **Mark Allocation:** Each question MUST be assigned one of the following mark values: 1, 2.5, 5, or 12.5.
           4.  **Mark Distribution:** Distribute these marks thoughtfully across the 50 questions. Aim for a balanced mix. For example:
               - Approximately 15-20 questions of 1 mark.
               - Approximately 15-20 questions of 2.5 marks.
               - Approximately 8-10 questions of 5 marks.
               - Approximately 2-5 questions of 12.5 marks.
               *(This is a guideline; adjust slightly for optimal topic coverage and natural question complexity, but maintain variety and avoid concentrating all questions at one mark level).*
           5.  **Complexity-Mark Alignment:** The complexity of each question MUST be appropriate for its assigned marks.
               - 1-mark questions: Simple recall, definitions, very basic concepts.
               - 2.5-mark questions: Application of a single concept, short explanations, simple code snippets/interpretations.
               - 5-mark questions: More detailed explanations, comparison of concepts, application of multiple concepts, moderately complex code tasks.
               - 12.5-mark questions: In-depth analysis, design tasks, complex problem-solving, significant coding exercises.
           6.  **Style & Pattern:** Emulate the style, tone, and common question types found in the "Past Exam Questions" provided, especially when determining the nature of questions for different mark values.
           7.  **Uniqueness & Variation:** Each question should be unique. While maintaining consistency with past patterns, ensure slight variations if this prompt is run multiple times with the same input.
           8.  **Output Format:** Respond ONLY with a valid JSON array of objects. Each object must have exactly two fields: "questionText" (string) and "marks" (number). Do not include any other text or explanation outside the JSON array.

           Example of a single question object in the JSON output:
           { "questionText": "Explain the principle of polymorphism in OOP and provide a brief code example in Python.", "marks": 5 }

           Begin JSON output now:
           `,
        };
      }
    );

    const llmResponse = await generateSyllabusQuestionsPrompt.generate({
      input: {
        syllabusText,
        flowchart1Text,
        flowchart2Text,
        pastExamQuestionsText,
      },
    });

    const generatedQuestions = llmResponse.output;

    // Validate the output against the schema
    // Zod will throw an error if the validation fails, which is good for ensuring correctness
    return SyllabusQuestionsOutputSchema.parse(generatedQuestions);
  }
);
