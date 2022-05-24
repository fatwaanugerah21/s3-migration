const { exec } = require("child_process");

const fileSource = "./files.txt";

const srcBucketName =
  "dev-sdconnect-stack-devsdconnects3bucket-s3bucket-186popcyz68z3";

function getLsCmd(bucketName) {
  return `aws s3 ls s3://${bucketName} --recursive | awk '{$1=$2=$3=""; print $0}' | sed 's/^[ \t]*//' > ${fileSource}`;
}

exec(getLsCmd(srcBucketName));
