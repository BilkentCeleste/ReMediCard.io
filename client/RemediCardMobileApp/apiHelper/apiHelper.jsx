import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

/**
 * @author Faruk Uçgun
 * @date 18.12.2024
 * @abstract: This is a helper file for api calls
 */

const _handleError = async (res) => {
    if (res.status !== 200) {
        throw new Error("Something went wrong")
    }
}

const getCommonHeaders = async () => {
    const token = await SecureStore.getItemAsync("token") || "";
    return {
        "Content-Type": "application/json",
        "Authorization": token
    }
}

const _get = async (url, responseType) => {
    let headers = await getCommonHeaders();

    return await axios.get(url, {
        headers: headers,
        responseType: responseType
    })
}

const _post = async (url, data, contentType, onUploadProgress) => {
    let headers = await getCommonHeaders();
    if (contentType) {
        headers["Content-Type"] = contentType;
    }
    return await axios.post(url,
        data,
        {headers, onUploadProgress}
    )
}

const _put = async (url, data, contentType, onUploadProgress) => {
    let headers = await getCommonHeaders();

    if (contentType) {
        headers["Content-Type"] = contentType;
    }
    return await axios.put(url, 
        data,
        {headers, onUploadProgress}
    )
}

const _patch = async (url, data, contentType) => {
    let headers = await getCommonHeaders();

    if (contentType) {
        headers["Content-Type"] = contentType;
    }
    return await axios.patch(url, 
        data,
        {headers}
    )
}

const _delete = async (url) => {
    let headers = await getCommonHeaders();

    return await axios.delete(url, {
        headers: headers
    })
}

const getFetcher = async (url, responseType = "json", isRaw = true) => {
  const res = await _get(url, responseType);
  await _handleError(res);
  return isRaw ? res : res.json();
};

const postFetcher = async (url, data={}, contentType="application/json", onUploadProgress, isRaw=true) => {
    const res = await _post(url, data, contentType, onUploadProgress)
    await _handleError(res)
    return isRaw ? res : res.json()
}

const putFetcher = async (url, data, contentType="application/json", onUploadProgress, isRaw=true) => {
    const res = await _put(url, data, contentType, onUploadProgress)
    await _handleError(res)
    return isRaw ? res : res.json()
}

const patchFetcher = async (url, data, contentType="application/json", isRaw=true) => {
    const res = await _patch(url, data, contentType)
    await _handleError(res)
    return isRaw ? res : res.json()
}

const deleteFetcher = async (url, isRaw=true) => {
    const res = await _delete(url)
    await _handleError(res)
    return isRaw ? res : res.json()
}

export { getFetcher, postFetcher, putFetcher, patchFetcher, deleteFetcher }
  