/**
 * This file is a plugin that uses the nx build tools to prevent netlify from unneccasrily rebuild the sites on every push
 * Taken from https://www.netlify.com/blog/2020/04/21/deploying-nx-monorepos-to-netlify/
 * TODO look into using the link to configure deploys from CI instead
 */

module.exports = {
  onPreBuild: ({ utils }) => {
    const currentProject = process.env.PROJECT_NAME;
    const lastDeployedCommit = process.env.CACHED_COMMIT_REF;
    const latestCommit = 'HEAD';
    const projectHasChanged = projectChanged(
      currentProject,
      lastDeployedCommit,
      latestCommit,
    );
    if (!projectHasChanged) {
      utils.build.cancelBuild(
        `Build was cancelled because ${currentProject} was not affected by the latest changes`,
      );
    }
  },
};

function projectChanged(currentProject, fromHash, toHash) {
  //TODO dont skip the check
  return true;
  const execSync = require('child_process').execSync;
  const getAffected = `npm run --silent nx print-affected --base=${fromHash} --head=${toHash}`;
  const output = execSync(getAffected).toString();
  //get the list of changed projects from the output
  const changedProjects = JSON.parse(output).projects;
  if (changedProjects.find(project => project === currentProject)) {
    return true;
  } else {
    return false;
  }
}
