import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;
const repo = "kpfk";
const basePath = isGithubActions ? `/${repo}` : "";

const nextConfig: NextConfig = {
    basePath,
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
