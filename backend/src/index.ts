import 'dotenv/config'
import * as recipeAPI from "./recipe-api"

import express from "express";
import cors from "cors";
import {PrismaClient} from '@prisma/client'
import { getFavoriteRecipesByIds } from "./recipe-api"

const app = express();

app.use(express.json());
app.use(cors());

const prismaClient= new PrismaClient()


//search route
app.get("/api/recipes/search", async (req, res) => {
  const searchTerm = req.query.searchTerm as string;
  const page = parseInt(req.query.page as string);
  const results = await recipeAPI.searchRecipes(searchTerm, page);

  return res.json(results);
});

//summary route
app.get("/api/recipes/:recipeId/summary", async (req, res) => {
  const recipeId = req.params.recipeId
  const results = await recipeAPI.getRecipeSummary(recipeId)
  res.json(results)
})

//add a favorite recipe route
app.post('/api/recipes/favorite', async(req, res)=> {
  const {recipeId} =req.body
  try{
  const favoriteRecipe = await prismaClient.favoriteRecipe.create({
  data: {recipeId}
})
  res.status(201).json(favoriteRecipe)
  } catch(error) {
    console.error(error);
    res.status(500).json({error: "something went wrong, can't add a favorite recipe"})
  }
})

//get a favorite recipe route
app.get('/api/recipes/favorite', async(req, res) => {
try{
    const favoriteRecipes= await prismaClient.favoriteRecipe.findMany()
     const recipeIds= favoriteRecipes.map((recipe)=> 
      recipe.recipeId.toString()
    );
    const favorites= await getFavoriteRecipesByIds(recipeIds);
    res.json(favorites);
    } catch(error) {
    console.error(error);
    res.status(500).json({error: "something went wrong, can't get the favorite recipe"})
  }
})

//delete or remove a favorite recipe
app.delete("/api/recipes/favorite", async (req,res)=> {
  const {recipeId} = req.body
  try {
  await prismaClient.favoriteRecipe.delete({
    where: {recipeId},
  })
  res.status(204).send()
  } catch(error) {
    console.error(error);
    res.status(500).json({error: "something went wrong, can't delete the favorite recipe"})
  }


})



//server listening to port
app.listen(5000, () => {
  console.log("Server running on localhost:5000");
});