/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, FormEvent } from "react";
import { searchRecipes } from "./API";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";

import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      // Using the searchRecipes function from the ./API module
      const data = await searchRecipes(searchTerm, 1); // let's assume page 1 to begin with

      if (!data || !data.results || data.results.length === 0) {
        setError("No recipes found. Please try a different search term.");
        setRecipes([]);
      } else {
        setRecipes(data.results);
      }
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred while fetching the recipes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          required
          placeholder="Enter a search term"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}

      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />

        // <div key={recipe.id} className="recipe">
        //   <img src={recipe.image} alt={recipe.title} />
        //   <br />
        //   <h3>{recipe.title}</h3>
        // </div>
      ))}
    </div>
  );
}

export default App;
