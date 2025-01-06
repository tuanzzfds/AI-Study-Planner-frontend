import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from '../config/config';
import axios from 'axios';
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

    const prompt = `Analyze the following task schedule and provide comprehensive, structured feedback in the specified format:

    1. **Schedule Status Overview:**
       - Assess the current task load and distribution.
       - Identify any immediate concerns or bottlenecks.
       - Highlight if the schedule lacks tasks and discuss potential implications.

    2. **Task Prioritization Recommendations:**
       - Categorize tasks using the Eisenhower Matrix (Urgent/Important).
       - Identify tasks that are both urgent and important versus those that can be delegated or scheduled for later.
       - Suggest an optimized sequence for task execution to enhance productivity.

    3. **Time Management Analysis:**
       - Review patterns in time allocation across tasks.
       - Detect potential scheduling conflicts or overlapping commitments.
       - Recommend improvements in time blocking to maximize efficiency.

    4. **Work-Life Balance Assessment:**
       - Evaluate the balance between work/study tasks and breaks or personal time.
       - Identify indicators of potential burnout or excessive workload.
       - Suggest strategies to improve work-life balance.

    5. **Action Steps:**
       - List 3-5 specific, actionable steps to enhance the schedule.
       - Recommend adjustments to the current schedule if necessary.
       - Provide tips for effective time management based on the analysis.

    **Tasks:**
    ${JSON.stringify(tasks, null, 2)}

    **Note:** If no tasks are present, offer guidance on creating an effective schedule and managing time efficiently.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing schedule:', error);
    throw new Error('Failed to analyze schedule. Please check your API key configuration.');
  }
};

export const analyzeAnalytics = async (dailyData, taskStatusData, progressPercentage) => {
  const prompt = `As a study analytics AI assistant, perform an in-depth analysis of the provided data and offer insightful feedback:

    **Data Overview:**
    - **Daily Time Spent Pattern:** ${JSON.stringify(dailyData)}
    - **Task Completion Status:** ${JSON.stringify(taskStatusData)}
    - **Overall Progress:** ${progressPercentage}%

    **Analysis Requirements:**
    1. **Areas of Excellence:**
       - Identify subjects or tasks where the user is performing exceptionally well.
       - Highlight positive study habits and effective time management practices.
       - Acknowledge achievements and milestones reached.

    2. **Areas Needing Improvement:**
       - Pinpoint subjects or tasks that require more attention or effort.
       - Analyze patterns that may be hindering progress.
       - Suggest strategies to overcome challenges in weaker areas.

    3. **Motivational Feedback:**
       - Provide encouragement to maintain or increase current performance levels.
       - Offer motivational tips to sustain and enhance study efforts.
       - Recognize the user's dedication and progress to foster continued improvement.

    4. **Actionable Recommendations:**
       - Suggest 3-5 practical steps to improve overall academic performance.
       - Recommend adjustments to study routines or methods based on the analysis.
       - Provide strategies for maintaining momentum and achieving goals.

    **Note:** Ensure that the feedback is personalized, data-driven, and aimed at fostering continuous improvement.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error analyzing analytics:', error);
    throw error;
  }
};
export const createTask = async (taskData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5001/api/ai/tasks/create', taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId, updates) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`http://localhost:5001/api/ai/tasks/update/${taskId}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.task;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5001/api/ai/tasks/delete/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const startTimer = async (taskId, duration) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5001/api/ai/timer/start', { taskId, duration }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.timer;
  } catch (error) {
    console.error('Error starting timer:', error);
    throw error;
  }
};

export const stopTimer = async (timerId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:5001/api/ai/timer/stop', { timerId }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.timer;
  } catch (error) {
    console.error('Error stopping timer:', error);
    throw error;
  }
};