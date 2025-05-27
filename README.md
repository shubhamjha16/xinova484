# Xinova

## Description
Xinova is a web application that uses AI to generate educational content on Computer Science topics. Users can input a CS topic, and Xinova will provide background information, generate a flowchart or key steps, and create an interactive quiz to test their understanding.

## Features
*   **AI-Powered Content Generation:** Leverages AI (specifically Google's Gemini model via Genkit) to create relevant content for a wide range of Computer Science topics.
*   **Background Information:** Provides users with a textual explanation of the chosen CS topic.
*   **Flowcharts/Key Steps:** Generates simple flowcharts or outlines key steps related to the topic, aiding in visual understanding of processes or concepts.
*   **Interactive Quizzes:** Creates multiple-choice quizzes with:
    *   Feedback for each answer.
    *   Explanation for the correct answer.
    *   Final score upon completion.
*   **Question Details:** Indicates the difficulty level (easy, medium, hard) of each question and flags coding-related questions.
*   **Responsive Design:** The user interface is designed to adapt to various screen sizes for accessibility on desktop and mobile devices.
*   **User-Friendly Interface:** Built with Shadcn/ui components, providing a clean and intuitive experience, including toast notifications for feedback and status updates.
*   **Markdown Support:** Renders questions, explanations, and background information in Markdown, allowing for formatted text and code snippets.
*   **Syllabus-Based Question Generation:** A dedicated feature to generate a set of 50 questions tailored to a provided syllabus and examples of past exam questions, with marks distributed across 1, 2.5, 5, and 12.5 points.

## Tech Stack
*   **Next.js:** React framework for server-side rendering and static site generation.
*   **TypeScript:** For static typing and improved code quality.
*   **Tailwind CSS:** Utility-first CSS framework for styling.
*   **Genkit (Google AI SDK):** Used for integrating AI capabilities, specifically with Google's Gemini models.
*   **Shadcn/ui:** Collection of re-usable UI components.
*   **React Hook Form:** For managing forms.
*   **Zod:** For schema validation.
*   **Lucide React:** For icons.

## Getting Started

### Prerequisites
*   Node.js (v20 or later recommended)
*   npm or yarn

### Installation & Setup
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your Google AI API key:
    ```env
    GOOGLE_GENAI_API_KEY=your_google_gemini_api_key_here
    ```
    *Note: The AI functionalities depend on this key.*

    **Important Security Note:** It's highly recommended to add the `.env` file to your `.gitignore` file to prevent committing sensitive API keys to your repository. If `.gitignore` does not already include `.env`, add the following line to it:
    ```
    .env
    ```

4.  **Run the development server:**
    The main application and the AI services run on different ports and can be started with the following commands. It's recommended to run them in separate terminal windows.

    *   **For the Next.js application:**
        ```bash
        npm run dev
        ```
        This will start the Next.js app (usually on `http://localhost:9002`).

    *   **For the Genkit AI services:**
        It's advisable to run Genkit in watch mode so it automatically restarts when AI flow code changes.
        ```bash
        npm run genkit:watch
        ```
        This will start the Genkit development server (usually on `http://localhost:3400` for the Genkit dashboard, with AI flows accessible by the Next.js app).

5.  Open your browser and navigate to `http://localhost:9002` (or the port shown in your terminal for the Next.js app).

## Available Scripts
*   `npm run dev`: Starts the Next.js development server with Turbopack (frontend UI).
*   `npm run genkit:dev`: Starts the Genkit AI development environment.
*   `npm run genkit:watch`: Starts Genkit in watch mode, recompiling on changes to AI flows.
*   `npm run build`: Builds the Next.js application for production.
*   `npm run start`: Starts the Next.js production server.
*   `npm run lint`: Runs ESLint to check for code style issues.
*   `npm run typecheck`: Runs TypeScript type checking.

## Syllabus-Based Question Generator

The application includes a powerful feature to generate a comprehensive set of 50 exam-style questions based on your specific curriculum. This tool is designed to assist educators and students in creating practice materials.

**Access:**
*   This feature is available on a separate tab/page, typically found at `/syllabus-quiz` in the application.

**How to Use:**

1.  **Navigate to the Feature:** Open the "Syllabus-Based Question Generator" tab.
2.  **Input Syllabus Text:** Paste the complete text of your course syllabus into the designated "Syllabus Text" area.
3.  **Input Past Exam Questions (Recommended):** In the "Past Exam Questions" area, paste a list of questions that have been asked in previous exams for this syllabus. This helps the AI understand the desired style, common topics, and typical difficulty associated with different mark values. While optional, providing this input significantly improves the relevance and quality of the generated questions.
4.  **Generate Questions:** Click the "Generate 50 Questions" button.
5.  **Review Output:** The system will generate 50 questions. Each question will be displayed with its assigned marks (1, 2.5, 5, or 12.5). The AI aims to provide a balanced distribution of these marks and ensure questions vary in complexity appropriate to their value.

The AI uses the syllabus to understand the scope of topics, the past questions to understand the examination pattern, and internal flowcharting logic to ensure core concepts are covered. Due to the nature of AI, you may receive slightly different questions each time you generate them, even with the same input, but they will adhere to the overall patterns and content provided.

## Project Structure
Here's a brief overview of some key directories:
*   `src/app/`: Contains the main page and layout for the Next.js application.
*   `src/components/`: Shared UI components, including those from Shadcn/ui.
*   `src/ai/`: Houses the AI logic, including Genkit configuration and flows.
    *   `src/ai/flows/`: Contains the specific AI generation logic (e.g., for quizzes, flowcharts).
*   `src/hooks/`: Custom React hooks.
*   `src/lib/`: Utility functions and libraries.
*   `public/`: Static assets.
*   `docs/`: Contains additional documentation like the blueprint.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for bugs, feature requests, or improvements.

## License
This project is currently unlicensed. (Or specify if a license exists, e.g., MIT License)
