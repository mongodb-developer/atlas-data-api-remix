import { Link, useLoaderData } from "remix";
import invariant from "tiny-invariant";

const axios = require("axios");

export let loader = async ({ params }) => {
  invariant(params.title, "expected params.title");

  let data = JSON.stringify({
    collection: "movies",
    database: "sample_mflix",
    dataSource: process.env.CLUSTER_NAME,
    filter: { title: params.title }
  });

  let config = {
    method: "post",
    url: process.env.DATA_API_BASE_URL + "/action/findOne",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "apiKey": process.env.DATA_API_KEY
    },
    data
  };

  let result = await axios(config);
  let movie = result?.data?.document || {};

  let poster = movie?.poster ||
    "https://image.shutterstock.com/z/stock-vector-black-linear-photo-camera-logo-like-no-image-available-flat-stroke-style-trend-modern-logotype-art-622639151.jpg";

  return {
    title: params.title,
    plot: movie.fullplot,
    genres: movie.genres,
    directors: movie.directors,
    year: movie.year,
    image: poster
  };
};

export default function MovieDetails() {
  let movie = useLoaderData();

  return (
    <div>
      <h1>{movie.title}</h1>
      {movie.plot}
      <br></br>
      <div styles="padding: 25% 0;" class="tooltip">
        <li>Year</li>
        <Link
          class="tooltiptext"
          to={"../movies?filter=" + JSON.stringify({ year: movie.year })}
        >
          {movie.year}
        </Link>
      </div>
      <br />
      <div styles="padding: 25% 0;" class="tooltip">
        <li>Genres</li>
        <Link
          class="tooltiptext"
          to={"../movies?filter=" + JSON.stringify({ genres: movie.genres })}
        >
          {movie.genres.map((genre) => {
            return genre + " | ";
          })}
        </Link>
      </div>
      <br />
      <div styles="padding: 25% 0;" class="tooltip">
        <li>Directors</li>
        <Link
          class="tooltiptext"
          to={
            "../movies?filter=" + JSON.stringify({ directors: movie.directors })
          }
        >
          {movie.directors.map((director) => {
            return director + " | ";
          })}
        </Link>
      </div>
      <br></br>
      <img src={movie.image}></img>
    </div>
  );
}
