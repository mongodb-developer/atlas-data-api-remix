import { Form, Link, useLoaderData, useSearchParams, useSubmit } from "remix";

const axios = require("axios");

export let loader = async ({ request }) => {
  let url = new URL(request.url);
  let searchTerm = url.searchParams.get("searchTerm");
  let filter = JSON.parse(url.searchParams.get("filter"));

  console.log(searchTerm);
  var pipeline = [];
  if (searchTerm) {
    pipeline = [
      {
        $search: {
          index: "default",
          text: {
            query: searchTerm,
            path: {
              wildcard: "*"
            }
          }
        }
      },
      { $limit: 100 },
      { $addFields: { meta: "$$SEARCH_META" } }
    ];
  } else if (filter) {
    pipeline = [
      {
        $match: filter
      },
      { $limit: 100 }
    ];
  } else {
    pipeline = [{ $limit: 100 }];
  }

  var data = JSON.stringify({
    collection: "movies",
    database: "sample_mflix",
    dataSource: process.env.CLUSTER_NAME,
    pipeline: pipeline
  });

  var config = {
    method: "post",
    url: process.env.DATA_API_BASE_URL + "/action/aggregate",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.DATA_API_KEY
    },
    data: data
  };

  let movies = await axios(config);
  let totalFound = 0;
  if (filter) {
    totalFound = await getCountMovies(filter);
  } else {
    totalFound = await getCountMovies();
  }

  return {
    showCount: movies.data.documents.length,
    totalCount: totalFound,
    documents: movies.data.documents
  };
};

const getCountMovies = async (countFilter) => {
  let pipeline = [];
  if (countFilter) {
    pipeline = [{ $match: countFilter }, { $count: "count" }];
  } else {
    pipeline = [{ $count: "count" }];
  }

  var data = JSON.stringify({
    collection: "movies",
    database: "sample_mflix",
    dataSource: process.env.CLUSTER_NAME,
    pipeline: pipeline
  });

  var config = {
    method: "post",
    url: process.env.DATA_API_BASE_URL + "/action/aggregate",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": process.env.DATA_API_KEY
    },
    data: data
  };

  let result = await axios(config);

  return result.data.documents[0].count;
};

export default function Movies() {
  let [searchParams, setSearchParams] = useSearchParams();

  let submit = useSubmit();
  let movies = useLoaderData();
  let totalFound = movies.totalCount;
  let totalShow = movies.showCount;
  if (movies.documents[0]?.meta?.count?.lowerBound) {
    totalFound = movies.documents[0]?.meta?.count?.lowerBound;
    if (totalFound < totalShow) {
      totalShow = totalFound;
    }
  }
  return (
    <div>
      <h1>Movies</h1>
      <Form method="get">
        <input
          onChange={(e) => submit(e.currentTarget.form)}
          id="searchBar"
          name="searchTerm"
          placeholder="Search movies..."
        />
        <p>
          Showing {totalShow} of total {totalFound} movies found
        </p>
      </Form>
      <ul>
        {movies.documents.map((movie) => (
          <li key={movie.title}>
            <Link to={movie.title}>{movie.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
