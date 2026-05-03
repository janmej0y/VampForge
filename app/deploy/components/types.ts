export type DeploymentEnvironment = "production" | "preview";

export type DeploymentStep = {
  id: string;
  label: string;
  description: string;
};

export type DeploymentHistoryItem = {
  id: string;
  date: string;
  status: "Pushed" | "Preview" | "Failed";
  url: string;
  environment: DeploymentEnvironment;
};

export type DeploymentStatusType = "idle" | "deploying" | "success";

export type DeploymentFormData = {
  templateName: string;
  portfolioName: string;
  lastUpdated: string;
  subdomain: string;
  customDomain: string;
  githubRepoName: string;
  githubConnected: boolean;
  githubUsername: string;
  environment: DeploymentEnvironment;
};
