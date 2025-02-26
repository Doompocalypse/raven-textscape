import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

export const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

var OPENAI_API_KEY = Deno.env.get("CHATGPT_API_KEY");
var OPENAI_API_URL = "https://api.openai.com/v1/embeddings";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    console.log("Recevied message ", message);

    // Step 1: Generate vector embedding for the user message
    const queryEmbedding = await getQueryEmbedding(message);

    // Step 2: Search for similar documents in Supabase
    const similarDocuments = await searchSimilarDocuments(queryEmbedding);

    console.log("similarDocuments ", similarDocuments);

    // Step 3: Return the most relevant documents
    if (similarDocuments.length === 0) {
      return new Response(JSON.stringify({ message: "No relevant documents found." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        query: message,
        results: similarDocuments[0],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
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

// Function to generate query embedding using OpenAI API
async function getQueryEmbedding(query) {
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: query,
    }),
  });

  const { data } = await response.json();

  return data[0].embedding;
}

// async function searchSimilarDocuments(queryEmbedding) {
//   try {
//     const { data, error } = await supabaseAdmin
//       .from("documents")
//       .select("document_name, embedding")
//       .order("embedding <->", { ascending: true, foreignTable: queryEmbedding }) // Sort by distance to query embedding
//       .limit(5); // Get the top 5 most similar results

//     if (error) {
//       console.error("Supabase Error:", error);
//       throw new Error("Error fetching documents from Supabase");
//     }

//     return data;
//   } catch (error) {
//     console.error("Error in searchSimilarDocuments:", error);
//     throw error; // Rethrow the error for further handling
//   }
// }

async function searchSimilarDocuments(queryEmbedding) {
  try {
    const { data, error } = await supabaseAdmin.rpc("search_similar_documents", {
      query_embedding: queryEmbedding,
      limit_count: 1,
    });

    if (error) {
      console.error("Supabase Error:", error);
      throw new Error("Error fetching documents from Supabase");
    }

    return data;
  } catch (error) {
    console.error("Error in searchSimilarDocuments:", error);
    throw error; // Rethrow the error for further handling
  }
}
