const fetch = require('node-fetch');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');
const { mergeTopic, createReadme, createArchive } = require('./utils/index');

const url = 'https://s.weibo.com/top/summary';

const regexp = /<a href="(\/weibo\?q=[^"]+)".*?>(.+)<\/a>/g;

const start = async function () {
  const res = await fetch(url);

  if (res.status !== 200) {
    console.error(res.statusText);
    process.exit(1);
  }

  const body = await res.text();
  const matches = body.matchAll(regexp);
  const topic = Array.from(matches).map((item) => ({
    url: item[1],
    title: item[2],
  }));

  const date = dayjs(new Date()).format('YYYY-MM-DD');
  const fullPath = path.join(__dirname, 'original', `${date}.json`);

  let existedTopic = [];
  if (fs.existsSync(fullPath)) {
    existedTopic = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  }

  const allTopic = mergeTopic(topic, existedTopic);
  fs.writeFileSync(
    path.join(__dirname, 'original/', `${date}.json`),
    JSON.stringify(allTopic)
  );

  // 更新README
  const readme = createReadme(allTopic);
  fs.writeFileSync(path.join(__dirname, 'README.md'), readme);

  // 更新archive
  const archiveText = createArchive(allTopic,date)
  fs.writeFileSync(path.join(__dirname,'archive',`${date}.md`),archiveText)

};

start();
