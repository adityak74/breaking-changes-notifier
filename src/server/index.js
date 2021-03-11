/* eslint-disable camelcase */
const express = require('express');
const { Octokit } = require('@octokit/core');

const app = express();

app.use(express.static('dist'));

app.get('/api/repo/:owner/:name/changes/breaking', async (req, res) => {
  const { name, owner } = req.params;
  const octokit = new Octokit();
  const response = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner,
    per_page: 100,
    repo: name,
  });
  const repoData = { name, owner, data: [] };
  response.data.forEach((release) => {
    const {
      body,
      published_at,
      tag_name,
    } = release;
    if (body.toLocaleLowerCase().indexOf('breaking changes')) {
      const diffs = [...body.matchAll(/([\s\S]*?)(```diff)([\s\S]*?)(```)([\s\S]*?)/g)];
      repoData.data.push({
        release: tag_name,
        publishedAt: published_at,
        diffs: diffs.map(diff => [diff[2], diff[3], diff[4]].join('\n')),
      });
    }
  });
  return res.send(repoData);
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
