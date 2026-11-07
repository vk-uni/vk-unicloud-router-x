/**
 * App-Plus 按原始字节保存 Base64，避免 Bitmap 重编码导致格式、透明度或动画丢失。
 */
export default async function base64ToFileApp({ base64Data, filePath }) {
  base64Data = base64Data.replace(/\s/g, '');
  const content = base64Data.replace(/=+$/, '');
  const padding = base64Data.length - content.length;
  if (/[^A-Za-z0-9+/]/.test(content) || content.length % 4 === 1 || padding > 2 || (padding > 0 && base64Data.length % 4 !== 0)) {
    throw new Error('base64 error');
  }
  // 补齐可省略的 padding，兼容 iOS 的严格解码。
  base64Data = content.padEnd(Math.ceil(content.length / 4) * 4, '=');
  const expectedSize = Math.floor((content.length * 3) / 4);
  const savePath = '_doc/vk_temp/' + filePath;
  const fileSystem = await new Promise((resolve, reject) => {
    plus.io.requestFileSystem(plus.io.PRIVATE_DOC, resolve, reject);
  });
  const directory = await new Promise((resolve, reject) => {
    fileSystem.root.getDirectory('vk_temp', { create: true }, resolve, reject);
  });
  // 与原 Bitmap.save 默认行为一致，不覆盖已有文件，也不在失败时误删已有文件。
  const entry = await new Promise((resolve, reject) => {
    directory.getFile(filePath, { create: true, exclusive: true }, resolve, reject);
  });
  try {
    const nativePath = plus.io.convertLocalFileSystemURL(savePath);
    if (plus.os.name === 'Android') {
      const bytes = plus.android.invoke('android.util.Base64', 'decode', base64Data, 0);
      if (plus.android.invoke('java.lang.reflect.Array', 'getLength', bytes) !== expectedSize) {
        throw new Error('base64 decode failed');
      }
      const stream = plus.android.newObject('java.io.FileOutputStream', nativePath);
      try {
        plus.android.invoke(stream, 'write', bytes);
      } finally {
        try {
          plus.android.invoke(stream, 'close');
        } finally {
          plus.android.autoCollection(stream);
          plus.android.autoCollection(bytes);
        }
      }
    } else if (plus.os.name === 'iOS') {
      let data = plus.ios.invoke('NSData', 'alloc');
      try {
        data = plus.ios.invoke(data, 'initWithBase64EncodedString:options:', base64Data, 0);
        if (plus.ios.invoke(data, 'length') !== expectedSize) {
          throw new Error('base64 decode failed');
        }
        const written = plus.ios.invoke(data, 'writeToFile:atomically:', nativePath, true);
        if (!written) throw new Error('base64 write file failed');
      } finally {
        plus.ios.deleteObject(data);
      }
    } else {
      throw new Error('base64ToFile: unsupported App-Plus platform');
    }
    // Native.js 部分调用失败不会抛出异常，核对实际大小后才报告成功。
    const savedFile = await new Promise((resolve, reject) => {
      entry.file(resolve, reject);
    });
    if (savedFile.size !== expectedSize) throw new Error('base64 write file incomplete');
    return { path: savePath, lastModifiedDate: new Date(), name: filePath };
  } catch (err) {
    try {
      await new Promise((resolve, reject) => {
        entry.remove(resolve, reject);
      });
    } catch (cleanupError) {
      console.warn('清理转换临时文件失败:', cleanupError);
    }
    throw err;
  }
}
