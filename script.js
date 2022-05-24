const fs = require("fs");
const { exec } = require("child_process");

const srcBucketName =
  "dev-sdconnect-stack-devsdconnects3bucket-s3bucket-186popcyz68z3";
const destBucketName =
  "dev-sdconnect-api-stack-s3-1drgfjqjetrmm-s3bucket-1pcy4lebvxp0c";

const sourceName = "./files.txt";

function getS3CpCmd(sourceFolder) {
  return `aws s3 cp "s3://${srcBucketName}/${sourceFolder}" "s3://${destBucketName}/${sourceFolder}" --acl bucket-owner-full-control`;
}

fs.readFile(sourceName, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  data = data.replace(/\/n/g, "");
  const datas = data.split("\n");

  for (let i = 0; i < datas.length; i++) {
    const path = datas[i];

    const cmd = `${getS3CpCmd(path)}`;
    try {
      console.log(`Copying ${path}`);
      exec(cmd);
      console.log(`Success copy ${path}`);
    } catch (error) {
      console.log(error);
    }
  }
});
