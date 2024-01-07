import { H } from "@highlight-run/node";

const environmentsMap = {
  dev: "development",
  stg: "staging",
  prd: "production",
};

export default function initHighlight() {
  H.init({
    projectID: process.env.HIGHLIGHT_PROJECT_ID,
    serviceName: "they-are-stories-backend",
    environment: environmentsMap[process.env.DOPPLER_ENVIRONMENT],
  });
}
