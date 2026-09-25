import "server-only";
import { createHomeEndpoints } from "./endpoint";
import { createServerApiClient } from "../../server-client";

export async function getHomeContentForServer() {
  return createHomeEndpoints(createServerApiClient()).getContent();
}
