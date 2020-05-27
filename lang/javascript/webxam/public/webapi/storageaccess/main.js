/**
 * @fileoverview Storage Access API調査用スクリプト
 */

const dumpCookie = async () => {
  const hasAccess = await document.hasStorageAccess();
  if (hasAccess) {
    await document.requestStorageAccess();
    const cookie = document.cookie;
    console.log(cookie);
  } else {
    throw new Error('Storage Access API利用不可');
  }
};

const runTest = async () => {
  try {
    await dumpCookie();
  } catch (e) {
    console.error(e);
  }
};

const init = async () => {
  await runTest();
};

init().then();
