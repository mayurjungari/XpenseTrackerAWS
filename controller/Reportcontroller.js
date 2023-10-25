const AWS = require('aws-sdk');
const Xtable=require('../models/expense')

const s3 = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET
});

const uploadToS3 = (data, filename) => {
  const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL:'public-read'
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3response) => {
      if (err) {
        console.error('Error uploading to S3:', err);
        reject(err);
      } else {
        console.log('Successfully uploaded to S3:', s3response.Location);
        resolve(s3response.Location);
      }
    });
  });
};

module.exports.Download = async (req, res) => {
  try {
    const expenses = await Xtable.findAll({ where: { accountID: req.user.ID } });
    const stringifiedData = JSON.stringify(expenses);
    // console.log(process.env.AWS_BUCKET_NAME)
    // console.log(process.env.IAM_USER_KEY)
    // console.log(process.env.IAM_USER_SECRET)
    const filename = `Xpense_${req.user.ID}_${new Date()}.txt`;
    const fileURL = await uploadToS3(stringifiedData, filename);
    res.status(200).json({ fileURL, success: true });
  } catch (error) {
    console.error('Error fetching or uploading data:', error);
    res.status(500).json({ success: false });
  }
};
