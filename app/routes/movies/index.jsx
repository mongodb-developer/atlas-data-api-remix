import {Form, Link, useLoaderData , useSearchParams } from "remix";

const axios = require('axios');


export let loader = async ({ request }) => {
  let url = new URL(request.url);
  let searchTerm = url.searchParams.get("searchTerm");
  console.log(searchTerm);
  var pipeline = [];
  if (searchTerm)
  {
   pipeline = [
      {
        $search: {
          index: 'default',
          text: {
            query: searchTerm,
            path: {
              'wildcard': '*'
            }
          }
        }
      },{$limit : 100}
    ]
  }
  else
  {
    pipeline = [ {$limit : 100}]
  }

  var data = JSON.stringify({
    "collection": "movies",
    "database": "sample_mflix",
    "dataSource": "Dev",
    "pipeline" : pipeline
});
    
                
    var config = {
        method: 'post',
        url: process.env.DATA_API_BASE_URL + '/action/aggregate',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': process.env.DATA_API_KEY
        },
        data : data
    };

  let movies = await axios(config);
  return movies.data.documents;
};

const getSearch = () =>{
  return "new york"
}

export default  function Movies() {
  let [searchParams, setSearchParams] = useSearchParams();
  let movies =  useLoaderData();
  return (
    <div>
      <h1>Movies</h1>
      <Form >
      <input id="searchBar" name="searchTerm" placeholder="Search movies..."/> <button type="submit" >search</button>
      </Form>
      <ul>
        {movies.map(movie => (
          <li key={movie.title}>
           <Link to={movie.title}>{movie.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}