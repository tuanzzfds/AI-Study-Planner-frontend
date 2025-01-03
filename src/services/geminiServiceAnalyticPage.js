
import axios from 'axios';
import { config } from '../config/config';

export const analyzeAnalytics = async (data) => {
  try {
    const response = await axios.post(`${config.apiUrl}/api/analytics`, data, {
      headers: { Authorization: `Bearer ${config.geminiApiKey}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing analytics:', error);
    throw error;
  }
};