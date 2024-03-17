/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, FormEvent } from "react";
import { searchRecipes } from "./API";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal";
import * as api from "./API";

type Tabs = "search" | "favorites";

import "./App.css";
import { useEffect } from "react";

function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
        setFavoriteRecipes(favoriteRecipes.results);
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
        <img src="/hero-image.jpg"></img>
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
          className={selectedTab === "favourites" ? "tab-active" : ""}
          onClick={() => setSelectedTab("favourites")}
        >
          Favourites
        </h1>
      </div>

      {selectedTab === "search" && (
        <>
          <form onSubmit={(event) => handleSearchSubmit(event)}>
            <input
              type="text"
              required
              placeholder="Enter a search term ..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            ></input>
            <button type="submit">
              <AiOutlineSearch size={40} />
            </button>
          </form>

          <div className="recipe-grid">
            {recipes.map((recipe) => {
              const isFavourite = favouriteRecipes.some(
                (favRecipe) => recipe.id === favRecipe.id
              );

              return (
                <RecipeCard
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onFavouriteButtonClick={
                    isFavourite ? removeFavouriteRecipe : addFavouriteRecipe
                  }
                  isFavourite={isFavourite}
                />
              );
            })}
          </div>

          <button className="view-more-button" onClick={handleViewMoreClick}>
            View More
          </button>
        </>
      )}

      {selectedTab === "favourites" && (
        <div className="recipe-grid">
          {favouriteRecipes.map((recipe) => (
            <RecipeCard
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavouriteButtonClick={removeFavouriteRecipe}
              isFavourite={true}
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
