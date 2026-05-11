import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Get user id from token
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if premium
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("is_premium, dietary_preferences")
      .eq("id", user.id)
      .single();

    if (!profile?.is_premium) {
       return new Response(JSON.stringify({ error: "Premium feature only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get all recipes
    const { data: recipes } = await supabaseClient
      .from("recipes")
      .select("id, title, ingredients");

    if (!recipes || recipes.length === 0) {
      throw new Error("No recipes found");
    }

    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    let planData: any = {};

    if (geminiKey) {
       // Call Gemini
       const prompt = `You are a professional chef. Create a weekly meal plan for 7 days (Пн, Вт, Ср, Чт, Пт, Сб, Вс) for 3 meals (Завтрак, Обед, Ужин).
       The user's dietary preferences are: ${profile.dietary_preferences?.join(', ') || 'None'}.
       You MUST ONLY use recipes from the following list. Respond with a JSON object where keys are days, values are objects with keys as meals, and the final value is the recipe ID.
       Recipes:
       ${JSON.stringify(recipes)}

       Return ONLY JSON, no markdown formatting.`;

       const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           contents: [{ parts: [{ text: prompt }] }],
         }),
       });

       const data = await response.json();
       if (data.candidates && data.candidates[0].content.parts[0].text) {
         try {
            let jsonString = data.candidates[0].content.parts[0].text;
            // Clean up possible markdown code blocks
            jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
            planData = JSON.parse(jsonString);
         } catch(e) {
            console.error("Failed to parse Gemini JSON", e);
            throw new Error("AI generated invalid JSON");
         }
       } else {
           throw new Error("AI generation failed");
       }
    } else {
        // Fallback Mock AI Generation if no GEMINI_API_KEY is provided
        const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
        const MEALS = ["Завтрак", "Обед", "Ужин"];

        await new Promise(resolve => setTimeout(resolve, 1500));

        DAYS.forEach(day => {
          planData[day] = {};
          MEALS.forEach(meal => {
            const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
            planData[day][meal] = randomRecipe.id;
          });
        });
    }

    // Save plan to db
    const { error: upsertError } = await supabaseClient
      .from('weekly_plans')
      .upsert({ user_id: user.id, plan_data: planData }, { onConflict: 'user_id' });

    await supabaseClient.from('weekly_plans').delete().eq('user_id', user.id);
    const { data: newPlan, error: insertError } = await supabaseClient
      .from('weekly_plans')
      .insert({ user_id: user.id, plan_data: planData })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ plan: newPlan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});