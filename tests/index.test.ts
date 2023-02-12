import test from 'ava';
// Import {S3Driver} from '../src/drivers/s3';

// const REGION = 'ap-northeast-1';
// const BUCKET = 'rc3-valuechain-dev-storage';
// const KEY = 'NewReviews/agoda_91482931.csv';
// const driver = new S3Driver();

// test('files', async (t) => {
//   const files = await driver.files(REGION, BUCKET);
//   console.log(files);
//   t.pass();
// });

// test('get', async t => {
//   const contents = await driver.get({
//     region: REGION,
//     bucket: BUCKET,
//     s3Key: KEY,
//   });
//   console.log(contents);
//   t.pass();
// });

// test('copy', async t => {
//   const toKey = KEY.replace('NewReviews', 'copy');
//   await driver.copy(
//     {
//       region: REGION,
//       bucket: BUCKET,
//       s3Key: KEY,
//     },
//     {
//       region: REGION,
//       bucket: BUCKET,
//       s3Key: toKey,
//     },
//     progress => {
//       console.log(progress);
//     },
//   );
//   const files = await driver.files(REGION, BUCKET);
//   console.log(files);
//   t.pass();
// });

// test('move', async t => {
//   const toKey = KEY.replace('NewReviews', 'copy');
//   await driver.move(
//     {
//       region: REGION,
//       bucket: BUCKET,
//       s3Key: KEY,
//       // S3Key: toKey,
//     },
//     {
//       region: REGION,
//       bucket: BUCKET,
//       s3Key: toKey,
//       // S3Key: KEY,
//     },
//     progress => {
//       console.log(progress);
//     },
//   );
//   const files = await driver.files(REGION, BUCKET);
//   console.log(files);
//   t.pass();
// });

// test('delete', async t => {
//   const toKey = KEY.replace('NewReviews', 'copy');
//   await driver.delete({
//     region: REGION,
//     bucket: BUCKET,
//     s3Key: toKey,
//   });
//   t.pass();
// });
