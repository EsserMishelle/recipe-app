"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const recipeAPI = __importStar(require("./recipe-api"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const recipe_api_1 = require("./recipe-api");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const prismaClient = new client_1.PrismaClient();
app.use((req, res, next) => {
    if (req.path.endsWith('.js')) {
        res.type('application/javascript');
    }
    next();
});
//search route
app.get("/api/recipes/search", async (req, res) => {
    const searchTerm = req.query.searchTerm;
    const page = parseInt(req.query.page);
    const results = await recipeAPI.searchRecipes(searchTerm, page);
    return res.json(results);
});
//summary route
app.get("/api/recipes/:recipeId/summary", async (req, res) => {
    const recipeId = req.params.recipeId;
    const results = await recipeAPI.getRecipeSummary(recipeId);
    res.json(results);
});
//add a favorite recipe route
app.post('/api/recipes/favorite', async (req, res) => {
    const { recipeId } = req.body;
    try {
        const favoriteRecipe = await prismaClient.favoriteRecipe.create({
            data: { recipeId }
        });
        res.status(201).json(favoriteRecipe);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "something went wrong, can't add a favorite recipe" });
    }
});
//get a favorite recipe route
app.get('/api/recipes/favorite', async (_req, res) => {
    try {
        const favoriteRecipes = await prismaClient.favoriteRecipe.findMany();
        const recipeIds = favoriteRecipes.map((recipe) => recipe.recipeId.toString());
        const favorites = await (0, recipe_api_1.getFavoriteRecipesByIds)(recipeIds);
        res.json(favorites);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "something went wrong, can't get the favorite recipe" });
    }
});
//delete or remove a favorite recipe
app.delete("/api/recipes/favorite", async (req, res) => {
    const { recipeId } = req.body;
    try {
        await prismaClient.favoriteRecipe.delete({
            where: { recipeId },
        });
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "something went wrong, can't delete the favorite recipe" });
    }
});
//server listening to port
app.listen(5000, () => {
    console.log("Server running on localhost:5000");
});
