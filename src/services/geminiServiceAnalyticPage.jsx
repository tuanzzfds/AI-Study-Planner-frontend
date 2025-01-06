import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from '../config/config';

const apiKey = config.geminiApiKey;

if (!apiKey) {
  console.error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your environment.');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const analyzeSchedule = async (tasks) => {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Provide a detailed analysis of the following task schedule with insights and actionable recommendations:

    1. **Potential Burnout Risks:**
       - Assess workload intensity and distribution.
       - Identify signs of overcommitment or excessive stress.
       - Recommend strategies to mitigate burnout.

    2. **Schedule Conflicts:**
       - Detect overlapping tasks or time allocations.
       - Highlight any inconsistencies or unrealistic deadlines.
       - Suggest adjustments to resolve conflicts.

    3. **Priority Optimization Suggestions:**
       - Evaluate the prioritization of tasks based on importance and urgency.
       - Recommend reordering or reclassifying tasks for optimal efficiency.
       - Provide guidance on focusing efforts on high-impact activities.

    4. **Work-Life Balance Recommendations:**
       - Analyze the balance between academic/work tasks and personal time.
       - Suggest ways to incorporate adequate breaks and leisure activities.
       - Recommend adjustments to ensure a healthy balance.

    **Tasks:**
    ${JSON.stringify(tasks, null, 2)}

    **Note:** Ensure that the analysis is thorough, data-driven, and provides clear recommendations for improving the schedule.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing schedule:', error);
    throw error;
  }
};

export async function analyzeAnalytics(dailyData, taskStatusData, progressPercentage) {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const analyticsContext = `
      **Study Analytics Report:**
      - **Overall Progress:** ${progressPercentage}% completion rate
      - **Daily Study Time (minutes):** ${dailyData.datasets[0].data.join(', ')}
      - **Task Distribution:**
        * **Completed Tasks:** ${taskStatusData.datasets[0].data[0]}
        * **In Progress:** ${taskStatusData.datasets[0].data[1]}
        * **Overdue Tasks:** ${taskStatusData.datasets[0].data[2]}
    `;

    const prompt = `As an educational analytics expert, analyze the following study data and provide comprehensive, personalized feedback:

    1. **Areas of Excellence:**
       - Highlight subjects or tasks where the user shows strong performance.
       - Identify effective study habits and strategies in use.
       - Acknowledge significant achievements and progress.

    2. **Growth Opportunities:**
       - Point out subjects or tasks that require additional focus.
       - Analyze patterns that may be impeding progress.
       - Suggest targeted learning strategies to address weaknesses.

    3. **Motivational Feedback:**
       - Encourage the user to maintain and build upon current strengths.
       - Provide motivational tips to enhance consistency and dedication.
       - Recognize the user's efforts and progress to inspire continued improvement.

    4. **Action Steps:**
       - Recommend 3 practical steps to boost academic performance.
       - Suggest adjustments to study routines or methods based on data analysis.
       - Provide strategies for overcoming identified challenges.

    **Data Overview:**
    ${analyticsContext}

    **Note:** Ensure that the feedback is insightful, actionable, and tailored to the user's specific data.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to analyze analytics data');
  }
}
