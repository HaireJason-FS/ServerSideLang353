// Pokemon API base
const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Fetches Pokemon data from TWO endpoints and returns a compiled object.
 * Required output shape:
 * { name, height, weight, types, flavorText, habitat, isLegendary }
 */
async function getPokemonData(pokemonId) {
  try {
    // --- 1) First endpoint: /pokemon/{id}
    const pokemonRes = await fetch(`${BASE_URL}/pokemon/${pokemonId}`);

    if (!pokemonRes.ok) {
      throw new Error(`Pokemon endpoint failed: ${pokemonRes.status} ${pokemonRes.statusText}`);
    }

    const pokemonData = await pokemonRes.json();

    const name = pokemonData.name;
    const height = pokemonData.height;
    const weight = pokemonData.weight;

    // Types come in like: [{ slot, type: { name, url } }, ...]
    const types = pokemonData.types.map((t) => t.type.name);

    // --- 2) Second endpoint: /pokemon-species/{id}
    const speciesRes = await fetch(`${BASE_URL}/pokemon-species/${pokemonId}`);

    if (!speciesRes.ok) {
      throw new Error(`Species endpoint failed: ${speciesRes.status} ${speciesRes.statusText}`);
    }

    const speciesData = await speciesRes.json();

    // Habitat can be null for some Pokémon, so fallback safely
    const habitat = speciesData.habitat ? speciesData.habitat.name : "unknown";

    const isLegendary = speciesData.is_legendary;

    // Find the first English flavor text entry
    const englishEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );

    // Flavor text often contains weird whitespace/newlines in the API
    const flavorText = englishEntry
      ? englishEntry.flavor_text.replace(/\f/g, " ").replace(/\n/g, " ").replace(/\s+/g, " ").trim()
      : "No English flavor text found.";

    // Return required object format
    return {
      name,
      height,
      weight,
      types,
      flavorText,
      habitat,
      isLegendary,
    };
  } catch (err) {
    console.error("Error in getPokemonData:", err.message);
    // You can either re-throw or return null; re-throw is usually better for grading/debugging.
    throw err;
  }
}

/**
 * Generates a random Pokemon ID (1-151), fetches its data, logs it nicely.
 */
async function assignmentTask() {
  try {
    const randomId = Math.floor(Math.random() * 151) + 1;

    const data = await getPokemonData(randomId);

    console.log("Random Pokémon ID:", randomId);
    console.log("Compiled Pokémon Data:", data);

    // Optional: display it in a more readable way:
    console.log(`
Name: ${data.name}
Height: ${data.height}
Weight: ${data.weight}
Types: ${data.types.join(", ")}
Habitat: ${data.habitat}
Legendary: ${data.isLegendary ? "Yes" : "No"}
Flavor Text: ${data.flavorText}
    `.trim());
  } catch (err) {
    console.error("Error in assignmentTask:", err.message);
  }
}

// Run it
assignmentTask();
