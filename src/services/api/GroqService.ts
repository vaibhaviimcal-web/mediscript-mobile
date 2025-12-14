import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

interface PrescriptionRequest {
  patientName: string;
  patientAge: number;
  patientGender: string;
  symptoms: string;
}

interface PrescriptionResponse {
  diagnosis: string;
  medications: Array<{
    name: string;
    dosage: string;
    duration: string;
    timing: string;
  }>;
  advice: string;
  followUp: string;
}

class GroqService {
  private apiKey: string | null = null;

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  async generatePrescription(
    request: PrescriptionRequest
  ): Promise<PrescriptionResponse> {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    const prompt = this.buildPrompt(request);

    try {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an expert medical AI assistant helping doctors generate accurate prescriptions. Provide detailed, medically sound recommendations.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: 30000,
        }
      );

      const content = response.data.choices[0].message.content;
      return this.parsePrescription(content);
    } catch (error: any) {
      console.error('❌ Groq API error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection.');
      }
      
      throw new Error('Failed to generate prescription. Please try again.');
    }
  }

  private buildPrompt(request: PrescriptionRequest): string {
    return `Generate a detailed medical prescription for the following patient:

Patient Information:
- Name: ${request.patientName}
- Age: ${request.patientAge} years
- Gender: ${request.patientGender}
- Symptoms: ${request.symptoms}

Please provide:
1. Diagnosis (probable condition based on symptoms)
2. Medications (name, dosage, duration, timing)
3. General advice (lifestyle, diet, precautions)
4. Follow-up recommendation

Format the response as JSON with this structure:
{
  "diagnosis": "condition name",
  "medications": [
    {
      "name": "medicine name",
      "dosage": "dosage amount",
      "duration": "duration",
      "timing": "when to take"
    }
  ],
  "advice": "general advice",
  "followUp": "follow-up recommendation"
}`;
  }

  private parsePrescription(content: string): PrescriptionResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback: parse manually
      return this.manualParse(content);
    } catch (error) {
      console.error('❌ Error parsing prescription:', error);
      throw new Error('Failed to parse AI response');
    }
  }

  private manualParse(content: string): PrescriptionResponse {
    // Simple fallback parser
    const lines = content.split('\n').filter(line => line.trim());
    
    return {
      diagnosis: this.extractSection(lines, 'diagnosis') || 'Diagnosis pending',
      medications: [
        {
          name: 'Medication details in AI response',
          dosage: 'As prescribed',
          duration: '5-7 days',
          timing: 'After meals',
        },
      ],
      advice: this.extractSection(lines, 'advice') || 'Follow doctor\'s instructions',
      followUp: this.extractSection(lines, 'follow') || '7 days',
    };
  }

  private extractSection(lines: string[], keyword: string): string {
    const section = lines.find(line => 
      line.toLowerCase().includes(keyword)
    );
    return section ? section.split(':')[1]?.trim() || '' : '';
  }
}

export default new GroqService();
