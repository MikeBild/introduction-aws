import { S3 } from 'aws-sdk';

module.exports.handler = async (event: any, context: any) => {
  const s3 = new S3({ region: 'eu-central-1' });

  const folders = await fetchFolders(s3);
  const folderFilesPromises = folders.map((folder) =>
    fetchFolderFiles(s3, folder)
  );
  const allFilesInFolder = await Promise.all(folderFilesPromises);

  const allFilesInFolderContentPromises = allFilesInFolder.map(
    ({ folder, files }) => fetchFolderFilesContent(s3, folder, files)
  );
  const allFilesInFolderContent = await Promise.all(
    allFilesInFolderContentPromises
  );

  const report = generateSummaryReport(allFilesInFolderContent);

  await s3
    .putObject({
      Bucket: 'time-tracker-reports',
      Key: 'summary.json',
      Body: JSON.stringify(report),
    })
    .promise();

  return report;
};

function generateSummaryReport(entries: Array<any>) {
  return entries.reduce((state: any, entry: any) => {
    const [
      name,
    ] = Object.keys(entry);

    if (!state[name]) state[name] = {};

    state[name].count = entry[name].length;

    state[name].hours = entry[name].reduce(
      (sum: number, x: any) => sum + x.content.hours,
      0
    );

    return state;
  }, {});
}

async function fetchFolders(s3: S3) {
  const { CommonPrefixes: folders } = await s3
    .listObjectsV2({
      Bucket: 'time-tracker-requests',
      Delimiter: '/',
      MaxKeys: 25,
    })
    .promise();
  return folders.map(({ Prefix: folder }) => folder.replace('/', ''));
}

async function fetchFolderFiles(s3: S3, folder: string) {
  const { Contents: contents } = await s3
    .listObjectsV2({
      Bucket: 'time-tracker-requests',
      MaxKeys: 25,
      Prefix: `${folder}/`,
    })
    .promise();

  return {
    folder,
    files:
      contents
        .map((content) => content.Key.replace(`${folder}/`, ''))
        .filter(Boolean),
  };
}

async function fetchFolderFilesContent(
  s3: S3,
  folder: string,
  files: Array<string>
) {
  const keys = files.map((file) => `${folder}/${file}`);
  const allFolderFilesContentPromises = keys.map((key) =>
    s3
      .getObject({ Key: key, Bucket: 'time-tracker-requests' })
      .promise()
      .then((content) => ({
        key,
        content: JSON.parse(content.Body.toString()),
      }))
  );
  const allFolderFilesContent = await Promise.all(
    allFolderFilesContentPromises
  );

  return {
    [folder]: allFolderFilesContent,
  };
}
