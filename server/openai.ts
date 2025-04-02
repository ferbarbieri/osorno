import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "demo-key" });

// Analyze dataset and generate schema
export async function analyzeDataset(data: any[]): Promise<{ 
  analysis: string,
  schema: Record<string, string>,
  summary: string
}> {
  try {
    // Send a small sample of the data for analysis
    const sampleData = data.slice(0, 10);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a data analyst expert. Analyze the dataset sample provided and extract its schema, data types, and provide a brief summary of what the data represents. Respond with JSON in this format: { 'analysis': string, 'schema': Record<string, string>, 'summary': string }",
        },
        {
          role: "user",
          content: JSON.stringify(sampleData),
        },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    console.error("Failed to analyze dataset:", error.message);
    return {
      analysis: "Error analyzing dataset",
      schema: {},
      summary: "Unable to process data sample"
    };
  }
}

// Generate response to user query about data
export async function generateDataResponse(
  query: string, 
  dataContent: any
): Promise<{
  response: string,
  chartData?: any,
  chartType?: string
}> {
  try {
    // Determine if visualization is needed
    const promptForVisualization = `
      User query: ${query}
      
      First, determine if this query requires a data visualization. If yes, also determine what type of chart would be best (bar, line, pie, etc.).
      Respond with JSON in this format: { 'needsVisualization': boolean, 'chartType': string | null }
    `;

    const visualizationResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a data visualization expert. Determine if the user query requires a data visualization and what type.",
        },
        {
          role: "user",
          content: promptForVisualization,
        },
      ],
      response_format: { type: "json_object" },
    });

    const visualizationDecision = JSON.parse(visualizationResponse.choices[0].message.content);
    
    // Generate the actual response based on the data
    const promptForResponse = `
      User query: ${query}
      
      Generate a detailed response based on the data provided. If a visualization is needed, 
      also provide the data to create the chart, ensuring it's in a format compatible with the chart type.
      
      Data: ${JSON.stringify(dataContent).substring(0, 8000)} ${dataContent.length > 8000 ? '... (data truncated)' : ''}
    `;

    const dataResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a data analyst assistant. Provide a detailed response to the user's query about their data.",
        },
        {
          role: "user",
          content: promptForResponse,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const parsedResponse = JSON.parse(dataResponse.choices[0].message.content);
    
    if (visualizationDecision.needsVisualization) {
      // Generate chart data
      const promptForChartData = `
        Based on the user query: ${query}
        And the data analytics response: ${JSON.stringify(parsedResponse)}
        
        Generate the data needed for a ${visualizationDecision.chartType} chart.
        The data should be in the format needed for charts in a React application.
        Respond with JSON in this format: { 'chartData': any[], 'chartType': string }
      `;

      const chartDataResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a data visualization expert. Generate chart data based on the user query and analytics response.",
          },
          {
            role: "user",
            content: promptForChartData,
          },
        ],
        response_format: { type: "json_object" },
      });

      const chartInfo = JSON.parse(chartDataResponse.choices[0].message.content);
      
      return {
        response: parsedResponse.response || parsedResponse.text || JSON.stringify(parsedResponse),
        chartData: chartInfo.chartData,
        chartType: chartInfo.chartType
      };
    }
    
    return {
      response: parsedResponse.response || parsedResponse.text || JSON.stringify(parsedResponse)
    };
  } catch (error: any) {
    console.error("Failed to generate data response:", error.message);
    return {
      response: "I'm sorry, but I encountered an error while processing your query. Please try again with a different question."
    };
  }
}

// For demonstration purposes when no API key is available
export function generateMockDataResponse(query: string): {
  response: string,
  chartData?: any,
  chartType?: string
} {
  // Check if query might be about sales or regions
  if (query.toLowerCase().includes('sales') || query.toLowerCase().includes('region')) {
    return {
      response: "The data shows that the Western region had the highest growth at 15.3%, while the Southern region decreased by 2.1%. The Northeast and Midwest regions showed moderate growth of 7.6% and 5.2% respectively.",
      chartData: [
        { name: 'Northeast', 'Q1 2023': 120000, 'Q2 2023': 129120 },
        { name: 'Midwest', 'Q1 2023': 98000, 'Q2 2023': 103096 },
        { name: 'South', 'Q1 2023': 110000, 'Q2 2023': 107690 },
        { name: 'West', 'Q1 2023': 135000, 'Q2 2023': 155655 }
      ],
      chartType: 'bar'
    };
  }
  
  // Default response for other queries
  return {
    response: "I've analyzed your data and found some interesting patterns. Please ask a more specific question to get detailed insights."
  };
}
