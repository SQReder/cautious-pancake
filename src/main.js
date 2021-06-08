import {toVFile} from "to-vfile";
import {reporter} from "vfile-reporter";
import unified from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import doc from "rehype-document";
import format from "rehype-format";
import html from "rehype-stringify";

unified()
  .use(markdown)
  .use(remark2rehype)
  .use(doc)
  .use(format)
  .use(html)
  .process(toVFile.readSync('example.md'), function (err, file) {
    console.error(reporter(err || file))
    console.log(String(file))
  })
