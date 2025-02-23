import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

interface Message {
  role: "user" | "assistant";
  content: string;
}

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
          { role: "system", content: "You are a helpful assistant." },
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

  try {
    const { message } = await req.json();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatgpt_key}`,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: message },
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      console.log(await response.text());

      throw new Error("Failed to get response from GPT-4-turbo API");
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
