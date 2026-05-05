import { generateText } from 'ai';
import { mockProviders, categoryLabels } from '@/lib/mock-data';

export async function POST(req: Request) {
  try {
    const { prompt, files } = await req.json();

    // Build context from uploaded files
    let fileContext = '';
    if (files && files.length > 0) {
      fileContext = '\n\nUploaded documents:\n';
      for (const file of files) {
        fileContext += `\n--- ${file.name} ---\n${file.content}\n`;
      }
    }

    // Get available categories
    const categories = Object.keys(categoryLabels);

    const systemPrompt = `You are KathaAI, an intelligent assistant for Katha - The Network for Tech Work in the Philippines. 
Your job is to analyze user requests and recommend the best service providers from our marketplace.

Available service categories: ${categories.join(', ')}

Category descriptions:
- printing: 3D Printing services (FDM, SLA, prototyping)
- pcb: PCB design and fabrication
- cad: CAD design and technical drawings
- laser: Laser cutting and engraving
- machining: CNC machining and metal fabrication
- assembly: Electronics assembly and soldering

Based on the user's problem description and any uploaded documents, you must:
1. Provide a helpful summary of their needs and what service would help them
2. Give 2-4 specific recommendations or tips for their project
3. Determine the most appropriate service category

Respond in JSON format only:
{
  "summary": "A 2-3 sentence analysis of what the user needs and how Katha can help",
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "suggestedCategory": "one of: printing, pcb, cad, laser, machining, assembly"
}`;

    const userMessage = `User's request: ${prompt}${fileContext}`;

    const { text } = await generateText({
      model: 'openai/gpt-4o-mini',
      system: systemPrompt,
      prompt: userMessage,
      maxOutputTokens: 1000,
      temperature: 0.7,
    });

    // Parse the AI response
    let aiResult;
    try {
      // Extract JSON from the response (handle markdown code blocks if present)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch {
      // Fallback if parsing fails
      aiResult = {
        summary: "Based on your request, we can help you find the right service provider. Please browse our marketplace to find specialists in your area.",
        recommendations: [
          "Consider uploading more detailed specifications",
          "Check provider ratings and reviews before committing"
        ],
        suggestedCategory: "printing"
      };
    }

    // Filter providers by suggested category
    const suggestedCategory = aiResult.suggestedCategory || 'printing';
    const matchingShops = mockProviders
      .filter((p) => p.category === suggestedCategory)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    // If no exact matches, get top-rated providers
    const shops = matchingShops.length > 0 
      ? matchingShops 
      : mockProviders.sort((a, b) => b.rating - a.rating).slice(0, 5);

    return Response.json({
      summary: aiResult.summary,
      recommendations: aiResult.recommendations || [],
      suggestedCategory,
      shops,
    });
  } catch (error) {
    console.error('[v0] KathaAI API error:', error);
    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
