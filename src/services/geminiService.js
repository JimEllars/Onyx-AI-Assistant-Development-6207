import { GoogleGenerativeAI } from '@google/generative-ai';
import supabase from '../lib/supabase';
import { systemPrompt } from '../utils/aiPromptTemplates';

class GeminiService {
  constructor() {
    this.apiKey = null;
    this.genAI = null;
    this.model = null;
    this.initialized = false;
  }

  async initialize(apiKey) {
    try {
      if (!apiKey) {
        throw new Error('API key is required to initialize Gemini');
      }

      this.apiKey = apiKey;
      this.genAI = new GoogleGenerativeAI(this.apiKey);

      // Default to Gemini Pro model
      this.model = this.genAI.getGenerativeModel({
        model: "gemini-pro"
      });

      // Test the connection
      const result = await this.generateResponse("Hello, are you working?");
      this.initialized = true;
      console.log("Gemini API initialized successfully");
      return true;
    } catch (error) {
      console.error("Failed to initialize Gemini:", error);
      this.initialized = false;
      throw error;
    }
  }

  async generateResponse(prompt, options = {}) {
    if (!this.initialized) {
      throw new Error('Gemini API not initialized');
    }

    try {
      const generationConfig = {
        temperature: options.temperature || 0.7,
        topK: options.topK || 40,
        topP: options.topP || 0.95,
        maxOutputTokens: options.maxTokens || 1024,
        ...options
      };

      // Add system prompt to guide the response
      const fullPrompt = `${systemPrompt}\n\n${prompt}`;

      const result = await this.model.generateContent({
        contents: [{
          role: "user",
          parts: [{ text: fullPrompt }]
        }],
        generationConfig,
      });

      return {
        text: result.response.text(),
        raw: result
      };
    } catch (error) {
      console.error("Error generating content with Gemini:", error);
      throw error;
    }
  }

  async generateChat(history, options = {}) {
    if (!this.initialized) {
      throw new Error('Gemini API not initialized');
    }

    try {
      // Add system prompt as first message if not already present
      const chatHistory = [...history];
      if (chatHistory.length === 0 || chatHistory[0].content !== systemPrompt) {
        chatHistory.unshift({
          role: 'model',
          content: systemPrompt
        });
      }

      // Create a chat session
      const chat = this.model.startChat({
        history: chatHistory.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          temperature: options.temperature || 0.7,
          topK: options.topK || 40,
          topP: options.topP || 0.95,
          maxOutputTokens: options.maxTokens || 1024,
        },
      });

      // Get the last message from the user
      const lastUserMessage = history.filter(msg => msg.role === "user").pop();
      if (!lastUserMessage) {
        throw new Error("No user message found in history");
      }

      // Generate a response
      const result = await chat.sendMessage(lastUserMessage.content);
      return {
        text: result.response.text(),
        raw: result
      };
    } catch (error) {
      console.error("Error in chat generation with Gemini:", error);
      throw error;
    }
  }

  async storeApiKey(apiKey, userId) {
    try {
      // Store API key in Supabase
      const { data, error } = await supabase
        .from('api_keys_x7k9m2')
        .upsert([
          {
            user_id: userId,
            service: 'google',
            key_name: 'gemini',
            api_key: apiKey,
            created_at: new Date()
          }
        ]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Failed to store API key:", error);
      return false;
    }
  }

  async getApiKey(userId) {
    try {
      const { data, error } = await supabase
        .from('api_keys_x7k9m2')
        .select('api_key')
        .eq('user_id', userId)
        .eq('service', 'google')
        .eq('key_name', 'gemini')
        .single();

      if (error) throw error;
      return data?.api_key || null;
    } catch (error) {
      console.error("Failed to retrieve API key:", error);
      return null;
    }
  }
}

const geminiService = new GeminiService();
export default geminiService;