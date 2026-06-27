import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

// @ts-ignore
const StarRating = ({ rating }) => (

    <div className={"flex items-center gap-1 text-sm text-secondary-dark"}>
        {[1,2,3,4,5].map((star) => {
            if (rating >= star) {
                return <FaStar key={star} />;
            }
            if (rating >= star - 0.5) {
                return <FaStarHalfAlt key={star} />;
            }
            return <FaRegStar key={star} />;
        })}
        <span className={"text-xs font-bold text-white ml-1"}>
            {rating.toFixed(1)}
        </span>
    </div>
);

export default StarRating;