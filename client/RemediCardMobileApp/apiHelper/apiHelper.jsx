import axios from 'axios';

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
  
const commonHeader = {
    "Content-Type": "application/json",
    // "Authorization": localStorage.getItem("token") || " "
}
  
const _get = async (url, responseType) => {
    return await axios.get(url, {
        headers: commonHeader,
        responseType: responseType
    })
}

const _post = async (url, data, contentType) => {
    let headers = commonHeader;
    if (contentType) {
        headers["Content-Type"] = contentType;
    }
    return await axios.post(url, 
        data, 
        headers
    )
}

const _put = async (url, data, contentType) => {
    let headers = commonHeader;
    if (contentType) {
        headers["Content-Type"] = contentType;
    }
    return await axios.put(url, 
        data, 
        headers
    )
}

const _patch = async (url, data, contentType) => {
    let headers = commonHeader;
    if (contentType) {
        headers["Content-Type"] = contentType;
    }
    return await axios.patch(url, 
        data, 
        headers
    )
}

const _delete = async (url) => {
    return await axios.delete(url, {
        headers: commonHeader
    })
}

const getFetcher = async (url, responseType="json", isRaw=true) => {
    const res = await _get(url, responseType)
    await _handleError(res)
    return isRaw ? res : res.json();
}

const postFetcher = async (url, data, contentType="application/json", isRaw=true) => {
    const res = await _post(url, data, contentType)
    await _handleError(res)
    return isRaw ? res : res.json()
}

const putFetcher = async (url, data, contentType="application/json", isRaw=true) => {
    const res = await _put(url, data, contentType)
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
  