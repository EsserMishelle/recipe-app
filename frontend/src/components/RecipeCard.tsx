import { Recipe } from "../types";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface Props {
  recipe: Recipe;
  isFavorite: boolean;
  onClick: () => void;
  onFavoriteButtonClick: (recipe: Recipe) => void;
}

export default function RecipeCard({
  recipe,
  onClick,
  onFavoriteButtonClick,
  isFavorite,
}: Props) {
  return (
    <div className="recipe-card" onClick={onClick}>
      <img src={recipe.image} alt={recipe.title} />
      <div className="recipe-card-title">
        <span
          onClick={(event) => {
            event.stopPropagation();
            onFavoriteButtonClick(recipe);
          }}
        >
          {isFavorite ? (
            <AiFillHeart size={25} color="red" />
          ) : (
            <AiOutlineHeart size={25} />
          )}
        </span>
        <h3>{recipe.title}</h3>
      </div>
    </div>
  );
}
