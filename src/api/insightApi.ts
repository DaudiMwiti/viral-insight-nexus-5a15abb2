
import { InsightParams, InsightDataType } from '@/types/insight';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const runInsightFlow = async (params: InsightParams): Promise<InsightDataType> => {
  try {
    const response = await fetch(`${API_BASE_URL}/run-flow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to run insight flow');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
