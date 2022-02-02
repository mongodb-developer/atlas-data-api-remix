import { Link, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import styles from "~/styles/movie-details.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

const axios = require("axios");

export let loader = async ({ params }) => {
  invariant(params.title, "expected params.title");

  let data = JSON.stringify({
    collection: "movies",
    database: "sample_mflix",
    dataSource: process.env.CLUSTER_NAME,
    pipeline: [{$match : { title: params.title }},{
      $lookup: {
          from: 'movies',
          'let': {
              genre: '$genres',
              myTitle: "$title"
          },
          pipeline: [{
                  $match: {
                      $expr: {
                          $and: [{
                                  $eq: [
                                      '$genres',
                                      '$$genre' 
                                  ]
                              },
                              {
                                  $gt: [
                                      '$imdb.rating',
                                      0
                                  ]
                              },
                              {
                                $ne : ["$title", "$$myTitle" ]
                              }
                          ]
                      }
                  }
              },
              {
                  $group: {
                      _id: null,
                      topMovies: {
                          $topN: {
                              n: 5,
                              output: {
                                  title: '$title',
                                  rating: '$imdb.rating',
                                  poster: '$poster'
                              },
                              sortBy: {
                                  'imdb.rating': -1
                              }
                          }
                      }
                  }
              }
          ],
          as: 'topRated'
      }
  }]
    
    //{ title: params.title }
  });

  let config = {
    method: "post",
    url: process.env.DATA_API_BASE_URL + "/action/aggregate",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.DATA_API_KEY
    },
    data
  };

  let result = await axios(config);
  let movie = {}
  if (result?.data?.documents.length > 0)
  {
     movie = result?.data?.documents[0] || {};
  }
  else
  {
    movie = null
  }

  let poster = movie?.poster ||
    "https://image.shutterstock.com/z/stock-vector-black-linear-photo-camera-logo-like-no-image-available-flat-stroke-style-trend-modern-logotype-art-622639151.jpg";
  
  if (movie)
  {
    return {
      title: params.title,
      plot: movie.fullplot,
      genres: movie.genres,
      directors: movie.directors,
      year: movie.year,
      image: poster,
      topRated : movie.topRated[0]?.topMovies
    };
 }
 else
 {
  return {
    title: "no data",
    plot: "no data",
    genres: [],
    directors: [],
    year: "no data",
    image: poster,
    topRated : []
  };
 }
};

export default function MovieDetails() {
  let movie = useLoaderData();

  return (
    <div>
      <h1>{movie.title}</h1>

      {movie.genres &&
      <div className="genres-list">
        <Link to={`../movies?filter=${JSON.stringify({genres: movie.genres})}`}>
          {movie.genres?.join(" / ")}
        </Link>
      </div>
      }

      <div className="movie-details">
        <div>
          <p>
            {movie.plot}
          </p>

          {movie.year &&
          <p>
            Year: <Link to={`../movies?filter=${JSON.stringify({ year: movie.year})}`}>{movie.year}</Link>
          </p>
          }

          {movie.directors &&
          <p>
            Directors: <Link to={`../movies?filter=${JSON.stringify({ directors: movie.directors})}`}>{movie.directors.join(" / ")}</Link>
          </p>
          }
        </div>

        <div className="movie-poster-container">
          <img className="movie-poster" alt={movie.title} src={movie.image}></img>
        </div>
      </div>

      <h3>Related Movies</h3>
      <div className="related-movies-container">

          {movie.topRated.map((m) => 
            <Link to={`../movies/${m.title}`}>
              <div className="related-movie">
                  <div className="related-movie-poster-container">
                    <img alt={m.title} className="related-movie-poster" src={m.poster} /> 
                  </div>

                <div className="related-movie-heading">
                  <h4>{m.title}</h4>
                  <p>Rating: {m.rating}</p>
                </div>
              </div>
            </Link>
          )}
      </div>
                
    </div>
  );
}
