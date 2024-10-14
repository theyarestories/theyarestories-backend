import { Query } from "@/interfaces/express/Query";
import structuredClone from "@ungap/structured-clone";
import parseNumbersAndBooleans from "./data-formatting/parseBooleanAndNumberStrings";

function removeReservedParams(query: Query): Query {
  // Fields to exclude
  const reservedParams = ["select", "sort", "page", "limit", "search"];
  const queryCopy = structuredClone(query);
  reservedParams.forEach((param) => delete queryCopy[param]);
  return queryCopy;
}

function addDollarSignToOperators(query: Query): Query {
  let queryString = JSON.stringify(query);
  queryString = queryString.replace(
    /\b(lt|lte|gt|gte|in|text|search)\b/g,
    (match) => "$" + match
  );
  const newQuery = JSON.parse(queryString);
  return newQuery;
}

export default function getMongoDBFormattedQuery(query: Query) {
  let formattedQuery = structuredClone(query);
  formattedQuery = removeReservedParams(formattedQuery);
  formattedQuery = addDollarSignToOperators(formattedQuery);
  formattedQuery = parseNumbersAndBooleans(formattedQuery);
  return formattedQuery;
}
