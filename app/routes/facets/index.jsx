import { Link, useLoaderData } from "remix";

const axios = require("axios");

export let loader = async ({ request }) => {
  let pipeline = [
    {
      $searchMeta: {
        facet: {
          operator: {
            range: {
              path: "year",
              gte: 900
            }
          },
          facets: {
            genresFacet: {
              type: "string",
              path: "genres"
            }
          }
        }
      }
    }
  ];

  let data = JSON.stringify({
    collection: "movies",
    database: "sample_mflix",
    dataSource: process.env.CLUSTER_NAME,
    pipeline
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

  let movies = await axios(config);

  return movies?.data?.documents[0];
};

export default function FacetSearch() {
  let facetResult = useLoaderData();

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
            {facetResult?.facet?.genresFacet.buckets.map((bucket) => (
              <tr>
                <td>
                  <div className="tooltip">
                    <Link
                      to={
                        "../movies?filter=" +
                        JSON.stringify({ genres: bucket._id })
                      }
                    >
                      {bucket._id}
                    </Link>
                    <span className="tooltiptext">
                      Press to filter by "{bucket._id}" genre
                    </span>
                  </div>
                </td>
                <td>
                  <p>{bucket.count}</p>
                </td>
              </tr>
            ))}
          </ul>
        </tbody>
      </table>
    </div>
  );
}
