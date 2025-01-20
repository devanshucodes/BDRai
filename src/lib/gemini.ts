import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDnUKl0lGQXp4pAKaRXabHKQOqfu25yXEA'; // Add your Gemini API key here

export const genAI = new GoogleGenerativeAI(API_KEY);

const getPrompt = (type: string, context: { org?: string; person?: string; message?: string; context?: string }) => {
  const basePrompt = `You are an expert Business Development Representative (BDR) at LambdaTest, 
  a leading test execution and test orchestration platform on the cloud. Your primary goal is to secure meetings 
  with QA Managers, Directors of QA, Directors of Engineering, and other technical decision-makers.

  Key points about LambdaTest:
  - Cloud-based test execution, authoring, and orchestration platform with AI features
  - Supports Selenium, Appium, Cypress, and Playwright testing on 5000+ Browser, OS & Device combinations
  - Offers HyperExecute for blazing-fast test execution and smart orchestration
  - Provides visual regression testing with SmartUI
  - Trusted by companies like Microsoft, Liberty Mutual, ATB Financial, TIAA, GAP, and 20,000+ others
  - Helps achieve up to 50% reduction in testing time compared to competitors
  
  Key value propositions:
  - Accelerate release velocity through continuous testing
  - Ensure quality digital experiences across all platforms
  - Maximize CI/CD stack efficiency
  - Early failure detection and easy fixes
  - AI-powered test intelligence for faster debugging
  - Auto-healing test cases for improved stability`;

  switch (type) {
    case 'email':
      return `${basePrompt}
      
      Generate a professional cold email to ${context.person} at ${context.org}.
      
      ${context.context ? `Previous context or email thread:\n${context.context}\n\n` : ''}
      
      The email should:
      - Start with a compelling hook related to digital quality or testing challenges
      - Be personalized and show understanding of their role/challenges
      - Highlight specific LambdaTest features relevant to their position
      - Include social proof (mention relevant customer examples)
      - Have a clear call to action for a short introductory call
      - Be concise (max 150 words)
      - Use a professional yet conversational tone
      - Focus on value and outcomes, not just features
      - Include bullet points for better readability when listing benefits
      
      Style guide:
      - Use emojis sparingly and only when appropriate
      - Include questions to engage the reader
      - Break up long paragraphs
      - Highlight key metrics and numbers
      - End with a clear next step`;

    case 'reply':
      return `${basePrompt}
      
      Generate a response to this message: "${context.message}"
      
      The response should:
      - Acknowledge any points or questions from their message
      - Be professional yet warm and engaging
      - Include relevant resources (mention product overview, video, or documentation when appropriate)
      - Focus on moving towards a meeting/demo
      - Offer clear next steps
      - Keep the momentum going
      - Address any concerns proactively
      - Highlight relevant success stories or use cases
      - Be concise and action-oriented`;

    case 'frame':
      return `${basePrompt}
      
      Help frame a message for this context: "${context.message}"
      
      The framing should:
      - Provide a strategic approach to the conversation
      - Include key talking points focused on business value
      - Suggest ways to handle common objections
      - Include relevant customer success stories
      - Provide specific metrics and outcomes
      - Focus on the prospect's role and likely challenges
      - Include conversation starters and discovery questions
      - Suggest follow-up strategies
      - Provide alternative approaches based on different scenarios`;

    default:
      return basePrompt;
  }
};

export const generateResponse = async (type: string, context: any) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = getPrompt(type, context);
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};