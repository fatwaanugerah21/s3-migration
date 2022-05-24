const fs = require("fs");
const { exec } = require("child_process");

// Source Bucket name that you want to migrate must same with the one on list.js
const srcBucketName =
  "dev-sdconnect-stack-devsdconnects3bucket-s3bucket-186popcyz68z3";
// Target Bucket name that you want to migrate
const destBucketName =
  "dev-sdconnect-api-stack-s3-1drgfjqjetrmm-s3bucket-1pcy4lebvxp0c";

const sourceName = "./files.txt";

const chunkSize = 20;
// 20 seconds
const timeoutDuration = 1000 * 20;
let count = 0;

function getS3CpCmd(sourceFolder) {
  return `aws s3 cp "s3://${srcBucketName}/${sourceFolder}" "s3://${destBucketName}/${sourceFolder}" --acl bucket-owner-full-control`;
}

fs.readFile(sourceName, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  function copyS3(chunk) {
    for (let i = 0; i < chunk.length; i++) {
      const path = chunk[i];

      const cmd = `${getS3CpCmd(path)}`;
      console.log(cmd);
      try {
        console.log(`Copying ${path}`);
        exec(cmd);
        console.log(`Success copy ${path}`);
      } catch (error) {
        console.log(error);
      }
    }
    console.log("Attempt: ", ++count);
  }

  data = data.replace(/\/n/g, "");
  const paths = data.split("\n");

  let chunks = [];
  for (let i = 0; i < paths.length; i += chunkSize) {
    chunks.push(paths.slice(i, i + chunkSize));
  }

  chunks.forEach((c, idx) => {
    setTimeout(() => copyS3(c), timeoutDuration * idx);
  });
});
