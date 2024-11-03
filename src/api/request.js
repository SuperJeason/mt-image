// service.js
import axios from 'axios';

const EXPIRATION_TIME = 60 * 60 * 1000; // 一小时的毫秒数

export const getOneWordService = async () => {
    const localData = localStorage.getItem('oneWord') || [];
    let parsedData;

    // 解析 JSON 并处理可能的错误
    try {
        parsedData = JSON.parse(localData);
    } catch (error) {
        parsedData = null; // 解析失败时将其设为 null
    }

    if (parsedData && Date.now() - parsedData.timestamp < EXPIRATION_TIME) {
        return parsedData.word; // 如果存在且未过期，返回本地存储的单词
    } else {
        const response = await axios.get("https://v1.hitokoto.cn/?c=f&encode=text");
        const word = response.data; // 直接获取字符串内容
        const dataToStore = {
            word: word,
            timestamp: Date.now(), // 存储当前时间戳
        };
        localStorage.setItem('oneWord', JSON.stringify(dataToStore)); // 存储到本地
        return word; // 返回获取到的单词
    }
};


// 上传文件服务
export const uploadFileToServerService = async (file) => {
    const formData = new FormData();
    const fileToUpload = file.raw || file; // 处理文件对象
    formData.append('file', fileToUpload);

    try {
        const response = await axios.post('https://pic-up.meituan.com/extrastorage/new/video?isHttps=true', formData, {
            headers: {
                'token': 'AgFgJGo9QvCAGivDwhosgc_8EKXcc7qEd6-9b1vTouUTxU5ylBVnXb_Zx1-4a7Y7lcCIL6Mw-oY28QAAAADoIwAAuHTMayhCRZZ4RUpkD2e2NtWuuk4n-yCPQAxdtpL8Vu4bb0K36ucPguaapdZi1vcn',
            }
        });
        return response.data.data.originalLink; // 返回上传的链接
    } catch (error) {
        console.error('上传失败:', error);
        throw error; // 重新抛出错误以供调用者处理
    }
};
