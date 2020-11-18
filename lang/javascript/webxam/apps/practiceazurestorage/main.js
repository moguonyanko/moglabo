/**
 * @fileoverview AzureをJavScriptから利用する練習用スクリプト
 * 参考:
 * https://docs.microsoft.com/learn/modules/connect-an-app-to-azure-storage/
 */

/* eslint-env node */

// 環境変数を記述した設定ファイルを読み込む。
require('dotenv').config({
  path: 'apps/practiceazurestorage/.env'
});

const util = require('util');
const storage = require('azure-storage');
const blobService = storage.createBlobService();
const containerName = 'myimageblobs';

const createContainerAsync = util
  // 引数の関数をPromiseを返せるように変換する。
  .promisify(blobService.createContainerIfNotExists)
  .bind(blobService);

async function main() {
  try {
    const result = await createContainerAsync(containerName);
    if (result.created) {
      console.log(`Blob container[${containerName}] を作成しました`);
    } else {
      console.warn(`Blob container[${containerName}] は既に存在します`);
    }
  } catch (err) {
    console.error(err.message);
  }
}

main().then();