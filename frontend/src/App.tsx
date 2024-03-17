/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, FormEvent } from "react";
import { searchRecipes } from "./API";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";
import * as api from "./API";
import { AiOutlineSearch } from "react-icons/ai";
type Tabs = "search" | "favorites";

import "./App.css";
import { useEffect } from "react";

function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string>("");
  const [, setIsLoading] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [selectedTab, setSelectedTab] = useState<Tabs>("search");

  const pageNumber = useRef(1);

  //fetch favorite recipes from the backend when app loads, store them in a new state
  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const favoriteRecipes = await api.getFavoriteRecipes();
        setFavoriteRecipes(
          Array.isArray(favoriteRecipes.results) ? favoriteRecipes.results : []
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchFavoriteRecipes();
  }, []);

  //button submit to search
  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);
    setError("");
    // setRecipes(recipes.results)
    pageNumber.current = 1;

    try {
      // Using the searchRecipes from the ./API
      const data = await searchRecipes(searchTerm, pageNumber.current); // pageNumber will be 1

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

  //button view more (next page)
  const handleViewMoreClick = async () => {
    setIsLoading(true);
    try {
      pageNumber.current += 1;
      const data = await searchRecipes(searchTerm, pageNumber.current);
      if (data && data.results) {
        setRecipes((prevRecipes) => [...prevRecipes, ...data.results]);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch more recipes.");
    } finally {
      setIsLoading(false);
    }
  };

  //add favorite recipes
  const addFavoriteRecipe = async (recipe: Recipe) => {
    try {
      await api.addFavoriteRecipe(recipe);
      setFavoriteRecipes([...favoriteRecipes, recipe]);
    } catch (error) {
      console.error(error);
    }
  };

  //delete or remove favorite recipes
  const removeFavoriteRecipe = async (recipe: Recipe) => {
    try {
      await api.removeFavoriteRecipe(recipe);
      const updatedRecipes = favoriteRecipes.filter(
        (nonfavoriteRecipe) => recipe.id !== nonfavoriteRecipe.id
      );
      setFavoriteRecipes(updatedRecipes);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <img
          src="https://res.cloudinary.com/drtgrgcsq/image/upload/v1710639817/recipe-main-pic_qol27e.jpg"
          alt="recipe-main-pic"
        ></img>
        <div className="title">My Recipe App</div>
      </div>
      <div className="tabs">
        <h1
          className={selectedTab === "search" ? "tab-active" : ""}
          onClick={() => setSelectedTab("search")}
        >
          Recipe Search
        </h1>
        <h1
          className={selectedTab === "favorites" ? "tab-active" : ""}
          onClick={() => setSelectedTab("favorites")}
        >
          Favorites
        </h1>
      </div>

      {selectedTab === "search" && (
        <>
          <form onSubmit={(event) => handleSearchSubmit(event)}>
            <input
              type="text"
              required
              placeholder="Search for ingredient or a recipe name ..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            ></input>
            <button type="submit">
              <AiOutlineSearch size={40} />
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <div className="recipe-grid">
            {recipes.map((recipe: Recipe) => {
              const isFavorite =
                Array.isArray(favoriteRecipes) &&
                favoriteRecipes.some((favRecipe) => recipe.id === favRecipe.id);

              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onFavoriteButtonClick={
                    isFavorite ? removeFavoriteRecipe : addFavoriteRecipe
                  }
                  isFavorite={isFavorite}
                />
              );
            })}
          </div>
          <button className="view-more" onClick={handleViewMoreClick}>
            View More
          </button>
        </>
      )}

      {selectedTab === "favorites" && (
        <div className="recipe-grid">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavoriteButtonClick={removeFavoriteRecipe}
              isFavorite={true}
            />
          ))}
        </div>
      )}

      {selectedRecipe ? (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(undefined)}
        />
      ) : null}
    </div>
  );
}

export default App;
