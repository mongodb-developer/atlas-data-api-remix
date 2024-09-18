# Notice: Repository Deprecation
This repository is deprecated and no longer actively maintained. It contains outdated code examples or practices that do not align with current MongoDB best practices. While the repository remains accessible for reference purposes, we strongly discourage its use in production environments.
Users should be aware that this repository will not receive any further updates, bug fixes, or security patches. This code may expose you to security vulnerabilities, compatibility issues with current MongoDB versions, and potential performance problems. Any implementation based on this repository is at the user's own risk.
For up-to-date resources, please refer to the [MongoDB Developer Center](https://mongodb.com/developer).


# atlas-data-api-remix

A sample app to show case the new [Remix](https://remix.run/) JS framework with [MongoDB Atlas Data Rest API](https://www.mongodb.com/developer/quickstart/atlas_data_api_introduction/)

## Prerquisities

- [Get started with Atlas](https://docs.atlas.mongodb.com/getting-started/) and prepare a cluster to work with.

- [Enable](https://docs.atlas.mongodb.com/api/data-api/) the DATA API and save the API key

- [Load sample data](https://docs.atlas.mongodb.com/sample-data/) set into the cluster (This application is using `sample_mflix` for its demo)

- For the full text search capabilities of this demo you need to create a dynamic [Atlas Search index](https://docs.atlas.mongodb.com/atlas-search/tutorial/create-index-ui/) on collection `sample_mflix.movies` (use default dynamic mappings). **Require version 4.4.11+ or 5.0.4+ of the Atlas cluster**

- Create a `.env` file in the main directory:

```
DATA_API_KEY=<API-KEY>
DATA_API_BASE_URL=<YOUR-DATA-ENDPOINT-URL>
CLUSTER_NAME=<YOUR-ATLAS-CLUSTER-NANE>
```

## Development

Install:

```
npm install
```

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode :

```sh
export DATA_API_KEY=<API-KEY>
export DATA_API_BASE_URL=<YOUR-DATA-ENDPOINT-URL>
export CLUSTER_NAME=<YOUR-ATLAS-CLUSTER-NANE>
npm start
```

## Application

Once the web server starts go into the main page and navigate to an app link.

### Movies search

- Click movies for further information
- Search key words to find movies.

### Facet search

- Click Facets Search for further information
- Click on a genre to get to movies for that genre.

## Disclaimer

Use at your own risk; not a supported MongoDB product
