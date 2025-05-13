import OSS from 'ali-oss';
import { ossConfig } from './config';
import { message } from 'antd';

/**
 * 上传文件到阿里云 OSS
 * @param {File} file - 要上传的文件
 * @returns {Promise<string>} - 返回上传成功后的文件 URL
 */
export const uploadToOss = async (id,file) => {
  const { accessKey, accessKeySecret, bucket, region } = ossConfig;

  try {
    // 初始化 OSS 客户端
    const client = new OSS({
      region,
      accessKeyId: accessKey,
      accessKeySecret: accessKeySecret,
      bucket,
      secure: true, // 使用 HTTPS
      dir: `user/${id}/`, // 指定上传目录
    });

    // 生成文件名
    const fileName = `uploads/${Date.now()}_${file.name}`;

    // 上传文件
    const result = await client.put(fileName, file);
    message.success('上传成功！');
    console.log('上传成功:', result);
    // 返回文件的完整 URL
    return result.url;
  } catch (error) {
    console.error('上传到 OSS 失败:', error);
    throw new Error('上传失败，请稍后重试');
  }
};