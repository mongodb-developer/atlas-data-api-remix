import { useLoaderData, json, Link } from "remix";

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader = () => {
  let data = {
    resources: [
      {
        name: "Getting Started with MongoDB Atlas",
        url: "https://docs.atlas.mongodb.com/getting-started/"
      },
      {
        name: "MongoDB Atlas Data API",
        url: "https://docs.atlas.mongodb.com/api/data-api/"
      },
      {
        name: "Remix Docs",
        url: "https://remix.run/docs"
      },
      {
        name: "React Router Docs",
        url: "https://reactrouter.com/docs"
      }
    ],
    demos: [
      {
        to: "/movies",
        name: "Movie Search App"
      },
      {
        to: "/facets",
        name: "Facet Search App"
      }
    ]
  };

  // https://remix.run/api/remix#json
  return json(data);
};

// https://remix.run/api/conventions#meta
export let meta = () => {
  return {
    title: "Remix and MongoDB Atlas Starter",
    description: "Welcome to remix and MongoDB demo app!"
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let data = useLoaderData();

  return (
    <div className="remix__page">
      <main>
        <h2>Welcome to Remix and MongoDB Demo!</h2>
        <p>We arer happy that you're here. 🥳</p>
        <p>
          Feel free to take a look around the code to see how Remix and MongoDB
          does things.
        </p>
        <p>
          Check out the movie dems in this starter, and then just delete the{" "}
          <code>app/routes/movies</code> and <code>app/styles/demos</code>{" "}
          folders when you're ready to turn this into your next project.
        </p>
      </main>
      <aside>
        <h2>Demos In This App</h2>
        <ul>
          {data.demos.map((demo) => (
            <li key={demo.to} className="remix__page__resource">
              <Link to={demo.to} prefetch="intent">
                {demo.name}
              </Link>
            </li>
          ))}
        </ul>
        <h2>Resources</h2>
        <ul>
          {data.resources.map((resource) => (
            <li key={resource.url} className="remix__page__resource">
              <a href={resource.url}>{resource.name}</a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
