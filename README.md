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
    *   **Syllabus-Based Question Generation:** 
        *   **Purpose:** Generates 50 unique exam-style questions based on a provided syllabus and (optionally) past exam questions. This feature is designed to assist educators and students in creating practice materials tailored to specific curricula.
        *   **Access:** Navigate to the `/syllabus-quiz` page in the application.
        *   **Input:** You'll need to provide the full syllabus text. Optionally, but recommended, include text from past exam questions to guide the style, topic emphasis, and difficulty for different mark values.
        *   **Output:** The tool produces 50 questions. Each question is assigned marks from one of the following values: 1, 2.5, 5, or 12.5 points. The questions are distributed across various complexities appropriate to their mark value, covering topics derived from the syllabus and insights from any provided past questions.

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
