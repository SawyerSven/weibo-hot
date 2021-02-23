const fs = require('fs');
const path = require('path')

exports.mergeTopic = (topic, oldTopic) => {
  const obj = {};
  for (const w of topic.concat(oldTopic)) {
    obj[w.url] = w.title;
  }
  return Object.entries(obj).map(([url, title]) => ({
    url,
    title,
  }));
};

exports.createReadme = (topic)=>{
  const readme = fs.readFileSync(path.resolve(__dirname,'../README.md'),'utf-8');
  return readme.replace(/<!-- BEGIN -->[\W\w]*<!-- END -->/,this.createList(topic))
}


exports.createList = (topic)=>{
  return `<!-- BEGIN -->
  <!-- 最后更新时间${new Date()} -->
  ${
    topic.map(item=>`1. [${item.title}](https://s.weibo.com/${item.url})`).join("\n")
  }
  <!-- END -->
  `
}


exports.createArchive = (topic,date)=>{
  return `# ${date}
  共 ${topic.length}条\n
  ${this.createList(topic)}
  `
}