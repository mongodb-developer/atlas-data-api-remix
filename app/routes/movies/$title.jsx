import { useLoaderData } from "remix";
import invariant from "tiny-invariant";

const axios = require('axios');

export let loader = async ({ params }) => {
  invariant(params.title, "expected params.movieId");


  var data = JSON.stringify({
    "collection": "movies",
    "database": "sample_mflix",
    "dataSource": process.env.CLUSTER_NAME,
    "filter" : {"title" : params.title}
});
            
var config = {
    method: 'post',
    url: process.env.DATA_API_BASE_URL + '/action/findOne',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': process.env.DATA_API_KEY
    },
    data : data
};
let movies = await axios(config);
console.log(JSON.stringify(movies.data.document));
var poster = 'https://image.shutterstock.com/z/stock-vector-black-linear-photo-camera-logo-like-no-image-available-flat-stroke-style-trend-modern-logotype-art-622639151.jpg' ;
if (movies?.data?.document?.poster)
{
  poster = movies.data.document.poster;
}

  return {title: params.title, plot : movies.data.document.plot, image :  poster };
};

export default function PostSlug() {
  let movie = useLoaderData();
  return (
    <div>
      <h1>{movie.title}</h1>
          {movie.plot}
          <br></br>
          <img src={movie.image}></img>
    </div>
  );
}
