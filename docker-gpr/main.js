const exec = require("@actions/exec");
const core = require("@actions/core");

async function run() {
  try {
    const token = core.getInput("repo-token");
    const username = process.env.GITHUB_ACTOR;
    const imageName = core.getInput("image-name");
    const githubRepo = process.env.GITHUB_REPOSITORY;
    const tag = process.env.GITHUB_SHA;

    await exec.exec(
      `docker login docker.pkg.github.com -u ${username} -p ${token}`
    );
    await exec.exec(
      `echo docker build -t docker.pkg.github.com/$(echo "${githubRepo}/${imageName}" | tr '[:upper:]' '[:lower:]'):${tag.slice(
        tag.length - 3
      )} .`
    );
    await exec.exec(
      `docker push docker.pkg.github.com/${githubRepo}/${imageName}:${tag.slice(
        tag.length - 3
      )}`
    );
  } catch (error) {
    console.error(error);
  }
}

run();
