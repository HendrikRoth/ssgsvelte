import express from "express";

import graphqlServer from "./graphql";
import appServer from "./server";
import generateSchema from "./schema";
import { stop } from "./utils";

export default async function ssgsvelte(config) {
  const app = express();

  const _options = config.ssgsvelteOptions || {};
  const _plugins = config.ssgsveltePlugins || [];

  const serverPort = _options.appServerPort || process.env.PORT || 3000;
  const graphqlPort = _options.graphqlServerPort || process.env.GRAPHQL_PORT || 3001;
  const queryName = _options.queryName || process.env.QUERY_NAME || "QUERY";
  const resName = _options.resName || process.env.RES_NAME || "QUERYRES";

  const schema = await generateSchema(_plugins);

  const graphql = await graphqlServer({
    port: graphqlPort,
    schema,
    graphiql: _options.graphiql || process.env.GRAPHIQL || false
  });

  await readRoutes({});

  const server = await appServer({
    port: serverPort
  });

  process.on("SIGTERM", () => {
    stop({ server: server, name: "app" });
    stop({ server: graphql, name: "graphql" });
  });
}
