import {Form, Link, useLoaderData , useSearchParams, useSubmit } from "remix";

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
    "dataSource": process.env.CLUSTER_NAME,
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
  let submit = useSubmit();
  let movies =  useLoaderData();
  return (
    <div>
      <h1>Movies</h1>
      <Form method="get">
        <input onChange={e => submit(e.currentTarget.form)}
        id="searchBar" name="searchTerm" placeholder="Search movies..."/>
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
