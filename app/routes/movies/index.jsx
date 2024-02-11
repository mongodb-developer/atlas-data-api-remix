import { Form, Link, useLoaderData, useSearchParams, useSubmit } from "remix";

const axios = require("axios");

export let loader = async ({ request }) => {
  let url = new URL(request.url);
  let searchTerm = url.searchParams.get("searchTerm");
  let filter = JSON.parse(url.searchParams.get("filter"));

  let pipeline = [];
  if (searchTerm) {
    pipeline = [
      {
        $search: {
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
      "apiKey": process.env.DATA_API_KEY
    },
    data
  };

  let movies = await axios(config);
  let totalFound = filter ?  await getCountMovies(filter) : await getCountMovies();

  return {
    showCount: movies?.data?.documents?.length,
    totalCount: totalFound,
    documents: movies?.data?.documents
  };
};

const getCountMovies = async (countFilter) => {
  let pipeline = countFilter ?
    [{ $match: countFilter }, { $count: "count" }] :
    [{ $count: "count" }];

  let data = JSON.stringify({
    collection: "movies",
    database: "sample_mflix",
    dataSource: process.env.CLUSTER_NAME,
    pipeline: pipeline
  });

  let config = {
    method: "post",
    url: process.env.DATA_API_BASE_URL + "/action/aggregate",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "apiKey": process.env.DATA_API_KEY
    },
    data: data
  };

  let result = await axios(config);

  return result?.data?.documents[0]?.count;
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
