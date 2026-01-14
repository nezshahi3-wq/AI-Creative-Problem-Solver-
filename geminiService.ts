
import { GoogleGenAI, Type } from "@google/genai";
import { TechniqueType, TECHNIQUES, FinalSolution } from "./types";

// Always use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeAndSolve(problem: string): Promise<{
  techniqueId: TechniqueType;
  analysis: string;
  solutions: FinalSolution[];
}> {
  const techniqueDescriptions = Object.values(TECHNIQUES).map(t => `- ${t.id} (${t.name}): ${t.description}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `أنت كبير مهندسي الابتكار (Chief Innovation Architect). مهمتك هي تحليل التحدي التالي واختيار الأداة الإبداعية الأكثر فاعلية لحله من قائمة الأدوات المتاحة، ثم تطبيقها ببراعة.

التحدي: "${problem}"

الأدوات المتاحة ومعايير اختيارها:
${techniqueDescriptions}

قواعد الاختيار الاستراتيجي المتقدمة:
1. للمشاكل التقنية/الهندسية المتناقضة: اختر TRIZ أو MORPHOLOGICAL_ANALYSIS.
2. لتطوير المنتجات/الخدمات القائمة: اختر SCAMPER أو ATTRIBUTE_LISTING.
3. للمشاكل التنظيمية أو القرارات الجماعية: اختر SIX_HATS أو DISNEY.
4. للابتكار الجذري في مجالات غير مسبوقة: اختر FIRST_PRINCIPLES أو SIMPLIFICATION.
5. للبحث عن أسواق جديدة: اختر BLUE_OCEAN.
6. إذا كانت المشكلة غامضة جداً: اختر CONCEPT_MAPPING أو MIND_MAPPING أو LOTUS_BLOSSOM.
7. للبحث عن الأسباب الجذرية: اختر FIVE_WHYS أو FISHBONE.
8. لكسر الجمود الذهني: اختر RANDOM_WORD أو LATERAL.
9. لتحفيز المشاركة الجماعية المتساوية: اختر BRAINWRITING.
10. لتغيير منظور التفكير: اختر REFRAMING.
11. لتوقع الفشل وتجنبه: اختر REVERSE_BRAINSTORMING.

المطلوب:
1. تحليل "بنية المشكلة" (Domain, Complexity, Goal).
2. اختيار التقنية التي توفر أكبر "رافعة إبداعية" لهذا النوع من التحديات.
3. تطبيق التقنية المختارة داخلياً لتوليد 5 حلول ابتكارية رفيعة المستوى.

يجب أن تكون المخرجات بصيغة JSON حصرياً بالهيكل التالي:
{
  "techniqueId": "ID التقنية المختار",
  "analysis": "تحليل معمق لسبب اختيار هذه التقنية تحديداً وكيف تعالج جوهر المشكلة (بالعربية)",
  "solutions": [
    {
      "title": "عنوان الحل (جذاب ومبتكر)",
      "text": "وصف تفصيلي للحل وآلية عمله وقيمته المضافة",
      "emoji": "إيموجي معبر",
      "category": "التصنيف الاستراتيجي للحل"
    }
  ]
}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          techniqueId: { type: Type.STRING },
          analysis: { type: Type.STRING },
          solutions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                text: { type: Type.STRING },
                emoji: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ['title', 'text', 'emoji', 'category']
            }
          }
        },
        required: ['techniqueId', 'analysis', 'solutions']
      }
    }
  });

  // Accessing response.text directly as a property
  return JSON.parse(response.text.trim());
}
