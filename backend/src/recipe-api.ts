const API_KEY = process.env.API_KEY;

//search function for ingredients or a particular recipe
export const searchRecipes = async (searchTerm: string, page: number) => {
    if (!API_KEY) {
      throw new Error("API key not found");
    }

    const baseURL = "https://api.spoonacular.com/recipes/complexSearch";
    const url = new URL(baseURL);
  
    const queryParams = {
      apiKey: API_KEY,
      query: searchTerm,
      number: '10',
      offset: ((page - 1) * 10).toString(),
    };
    url.search = new URLSearchParams(queryParams).toString();
  
    try {
      const searchResponse = await fetch(url.toString());
      const resultsJson = await searchResponse.json();
      return resultsJson;
    } catch (error) {
      console.error(error);
    }
  };

  //get summary of the recipe
  export const getRecipeSummary = async (recipeId: string) => {
    if (!API_KEY) {
      throw new Error("API key not found");
    }
    const baseURL = "https://api.spoonacular.com/recipes/";
    const url = new URL(`${baseURL}${recipeId}/summary`, baseURL)
    const params ={apiKey: API_KEY}
    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url.toString());
    const json = await response.json();
    return json;
  }

  //fetch favorite recipe(s)
  export const getFavoriteRecipesByIds= async (ids: string[])=> {
    if (!API_KEY) {
      throw new Error("API key not found");
    }
    const url = new URL("https://api.spoonacular.com/recipes/informationBulk");

    url.search = new URLSearchParams({
        apiKey: API_KEY,
        ids: ids.join(","),
      }).toString()
const response = await fetch(url)
const json = await response.json()
return {result: json}

    

  }    
