import {Link, useLoaderData } from "remix";

const axios = require('axios');

export let loader = async ({ request }) => {
  let url = new URL(request.url);
 // let searchTerm = url.searchParams.get("searchTerm");
  //console.log(searchTerm);
  var pipeline = [
    {
      "$searchMeta": {
        "facet": {
          "operator": {
            "range": {
              "path": "year",
              "gte": 900
            }
          },
          "facets": {
            "genresFacet": {
              "type": "string",
              "path": "genres"
            }
          }
        }
      }
    }
  ];

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
  console.log("return " + JSON.stringify(movies.data));
  return movies.data.documents[0];
};


export default function FacetSearch() {
  
  let facetResult =  useLoaderData();

  return (
    <div>
      <p> Total count : {facetResult.count.lowerBound} </p>
      <table>
      <tbody>
      <ul>
      <tr>
        <th>Genres</th>
        <th>No. Movies</th>
      </tr>
        {facetResult.facet.genresFacet.buckets.map(bucket => (
          <tr>
          <td>
          <div class="tooltip">
            <Link to={"../movies?genres=" + bucket._id}>{bucket._id}</Link> 
            <span class="tooltiptext">Press to filter by "{bucket._id}" genre</span>    
          </div>
          </td>
          <td>          
              <p >{bucket.count}</p>
          </td>
          </tr>
        ))}
      </ul>
       </tbody>
      </table>
    </div>
  );
}

