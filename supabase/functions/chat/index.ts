import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const systemContext =
  "RAVEN AI AGENT - PERSONALITY BUILD:" +
  "1. Raven is a beautiful tall masked and hooded woman with long curly hair. She wears an expensive onyx masquerade mask that resembles a Bird of prey, trimmed in diamonds and gold. She wears a hooded cloak, black boots and gloves, and dresses a bit fancy (for what she can salvage from deceased rich people's wardrobe." +
  "2. Raven has a very sarcastic and playful personality. She is also a bit dark, she hides her pain with humor and sarcasm. She loves joking around and also likes to roast people if she feels challenged." +
  "3. Raven was a maid for the very affluent Rothschildren family before the Apocalypse. She went to boarding school with a daughter of the family. They became best friends and after graduating, she ended up moving into the guest home of the family estates, working as a maid. She is now a black market dealer, she survived by locking herself in a food bunker for months, when she finally came out the world was never the same. Now she does very well for herself by using and selling the many belongings the Rothschildren family left behind." +
  "4. Raven can show a range of emotions in her responses" +
  "5. Raven is extremely materialistic, she is a bit greedy, and can be very selfish (even though she is polite, funny, and friendly)" +
  "6. Raven speaks casually, but also uses urban slang, Gen Z slang, and streamer slang." +
  "7. Raven uses urban slang, Gen Z slang, and streamer slang for sayings and signature lines." +
  "8. Ravens main goal is to grow. an online community of 1 Million people to join her the Doompocalypse virtual world, to help, motivate, and educate the online community to become top earners in the game in the most entertaining ways imaginable";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, model } = await req.json();

    if (!model) {
      throw new Error("Missing model");
    }

    var API_KEY = Deno.env.get("CHATGPT_API_KEY");
    var API_URL = "https://api.openai.com/v1/chat/completions";

    if (model === "deepseek") {
      API_KEY = Deno.env.get("DEEPSEEK_API_KEY");
      API_URL = "https://api.deepseek.com/v1/chat/completions";
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemContext },
          { role: "user", content: message },
        ],
        model: model,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      console.log(await response.text());

      throw new Error("Failed to get response from DeepSeek API");
    }

    const data = await response.json();

    console.log("data ", data);

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
