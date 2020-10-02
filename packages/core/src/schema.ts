import { SchemaComposer } from "graphql-compose";

export default async function schema(sources: any[]) {
  const schemaComposer = new SchemaComposer();

  sources.forEach(async source => {
    try {
      const importedSource = await import(source.name);
      const options = {...source.options, ...schemaComposer};
      importedSource.init(options);
    }
    catch(err) {
      console.error(err);
    }
  });

  return schemaComposer.buildSchema();
}
