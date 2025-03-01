import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

// Now you can use cosineSimilarity as needed
export const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

var OPENAI_API_KEY = Deno.env.get("CHATGPT_API_KEY");
var OPENAI_API_URL_EMBEDDINGS = "https://api.openai.com/v1/embeddings";
var OPENAI_API_URL_COMPLETIONS = "https://api.openai.com/v1/chat/completions";

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
    const { message } = await req.json();

    console.log("Received message ", message);

    const response = await chatbotResponse(message);

    return new Response(
      JSON.stringify({
        query: message,
        results: response,
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
  const response = await fetch(OPENAI_API_URL_EMBEDDINGS, {
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
//     const { data, error } = await supabaseAdmin.rpc("search_similar_documents", {
//       query_embedding: queryEmbedding,
//       limit_count: 1,
//     });

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

/**
 * Computes cosine similarity between two vectors.
 * @param {Array<number>} a - First vector.
 * @param {Array<number>} b - Second vector.
 * @returns {number} - Similarity score between -1 and 1.
 */
const cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// Function to calculate cosine similarity between two vectors
function cosineSimilarityold(vecA, vecB) {
  // Convert the embeddings (which are strings) to arrays of numbers
  const vectorA = JSON.parse(vecA);
  const vectorB = JSON.parse(vecB);

  // Ensure both vectors are the same length
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must have the same length.");
  }

  // Compute the dot product of the two vectors
  const dotProduct = vectorA.reduce((acc, val, idx) => acc + val * vectorB[idx], 0);

  // Compute the magnitudes of the vectors
  const magnitudeA = Math.sqrt(vectorA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((acc, val) => acc + val * val, 0));

  // Calculate the cosine similarity
  if (magnitudeA && magnitudeB) {
    return dotProduct / (magnitudeA * magnitudeB);
  } else {
    return 0; // If either magnitude is 0, return similarity of 0
  }
}

// Function to search for similar documents
async function searchSimilarDocuments(queryEmbedding) {
  try {
    // Fetch document embeddings from Supabase
    const { data: documents, error } = await supabaseAdmin
      .from("documents")
      .select("document_name, embedding, text_chunk");

    if (error) throw error;
    if (!documents.length) return { text: null, reason: "No documents found." };

    let bestMatch = null;
    let bestScore = 0;

    // Compare query embedding with stored embeddings
    documents.forEach((doc) => {
      const docEmbedding = doc.embedding;

      const score = cosineSimilarity(queryEmbedding, JSON.parse(docEmbedding));
      if (score > bestScore) {
        bestScore = score;
        bestMatch = doc;
      }
    });

    // Define similarity threshold
    const SIMILARITY_THRESHOLD = 0.5;

    console.log("bestScore ", bestScore);
    console.log("bestMatch ", bestMatch.text_chunk);

    if (bestScore > SIMILARITY_THRESHOLD) {
      return { text: bestMatch.text_chunk, reason: null };
    } else {
      console.log("Query not relevant to stored documents.");

      return { text: null, reason: "Query not relevant to stored documents." };
    }
  } catch (error) {
    console.error("Error searching documents:", error);
    return { text: null, reason: "Error retrieving documents." };
  }
}

// Function to handle user query
async function chatbotResponse(userQuery) {
  const userQueryEmbedding = await getQueryEmbedding(userQuery);
  const { text, reason } = await searchSimilarDocuments(userQueryEmbedding);

  console.log("text ", text);

  if (text && text.trim() !== "") return text;

  console.log("after text ");

  // If no relevant document is found, use GPT-4o
  try {
    const response = await fetch(OPENAI_API_URL_COMPLETIONS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemContext },
          { role: "user", content: userQuery },
        ],
        model: "gpt-4o-mini",
        max_tokens: 200,
      }),
    });

    const data = await response.json();

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating chatbot response:", error);
    return "I'm sorry, but I couldn't process your request.";
  }
}
