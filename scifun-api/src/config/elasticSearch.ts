import "dotenv/config"; 
import { Client } from "@elastic/elasticsearch";

const esClient = new Client({
  node: process.env.ES_NODE as string,
  auth: {
    apiKey: process.env.ES_API_KEY as string,
  },
});

export const connectES = async () => {
  try {
    await esClient.ping();
    console.log("Elasticsearch connected!");
  } catch (err) {
    console.error("Elasticsearch connection error:", err);
    process.exit(1);
  }
};

export { esClient };
