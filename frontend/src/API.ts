// src/API.ts

import {Recipe} from "./types"
//search by ingredients or a particular recipe
export const searchRecipes = async (searchTerm: string, page: number) => {
    const baseURL = new URL("http://localhost:5000/api/recipes/search");
    baseURL.searchParams.append("searchTerm", searchTerm);
    baseURL.searchParams.append("page", page.toString());
  
    const response = await fetch(baseURL.toString());
  
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
      return response.json();
  };
  // export { searchRecipes };


  //get recipe summary
  export const getRecipeSummary = async (recipeId: string) => {
    const url = new URL(`http://localhost:5000/api/recipes/${recipeId}/summary`);
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };

  //get all the favorite recipes
export const getFavoriteRecipes = async () => {
    const url = new URL(`http://localhost:5000/api/recipes/favorite`)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  };
  
  //add a new favorite recipe
export const addFavoriteRecipe = async (recipe: Recipe) => {
    const body = {
    recipeId: recipe.id,
    }
    const response = await fetch(`http://localhost:5000/api/recipes/favorite`, {
    method: 'POST',
    headers: {
    'content-type': "application/json",
    },
    body: JSON.stringify(body)
    })
    if (!response.ok) {
      throw new Error("Failed to save to Favorites")
    }
}

//remove or delete a favorite recipe
export const removeFavoriteRecipe = async(recipe: Recipe) => {
  const url = new URL(`http://localhost:5000/api/recipes/favorite`)
  const body ={
    recipeId: recipe.id,
  }
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'content-type': "applications/json"
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
}