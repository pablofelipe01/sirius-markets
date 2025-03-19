// src/lib/webhook-service.ts
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MarketDataItem, NewsItem, PredictionResults } from '@/types/market';

// URL del webhook de n8n para el análisis de mercado
const WEBHOOK_URL = 'https://n8n-sirius-agentic.onrender.com/webhook/market';

/**
 * Servicio para enviar datos al webhook de n8n
 */
export const webhookService = {
  /**
   * Envía datos de futuros y noticias al webhook para análisis
   * @param data Los datos a enviar al webhook
   * @returns La respuesta del webhook
   */
  async sendDataToWebhook(data: {
    futuresData: MarketDataItem[];
    newsData: NewsItem[];
  }): Promise<unknown> {
    try {
      console.log('Sending data to n8n webhook for analysis');
      console.log('Futures data:', data.futuresData.length, 'items');
      console.log('News data:', data.newsData.length, 'items');
      
      // Añadir timestamp para que el webhook sepa cuándo se generaron estos datos
      const payload = {
        ...data,
        timestamp: new Date().toISOString()
      };
      
      // Enviar la solicitud POST al webhook
      const response = await axios.post(WEBHOOK_URL, payload);
      
      console.log('Webhook response status:', response.status);
      
      // Procesar la respuesta del webhook
      if (response.data && typeof response.data === 'object' && response.data.output) {
        // Manejar respuesta que viene como un objeto con campo 'output'
        console.log('Received formatted AI response');
        
        // La respuesta raw puede ser útil para depuración
        console.log('Raw webhook response:', response.data);
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Manejar respuesta directa en formato JSON
        console.log('Received JSON response directly');
        return response.data;
      } else {
        // Manejar otros tipos de respuesta
        console.warn('Unexpected response format:', typeof response.data);
        return response.data;
      }
    } catch (error) {
      // Registrar detalles del error para facilitar la depuración
      if (axios.isAxiosError(error)) {
        console.error('Webhook error status:', error.response?.status);
        console.error('Webhook error data:', error.response?.data);
      }
      
      console.error('Error sending data to webhook:', error);
      throw error;
    }
  }
};