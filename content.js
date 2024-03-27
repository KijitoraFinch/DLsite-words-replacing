console.log('content.js start')
async function sha256(text){
    const uint8  = new TextEncoder().encode(text)
    const digest = await crypto.subtle.digest('SHA-256', uint8)
    return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2,'0')).join('')
}

async function replaceAllText(element, dict, exceptions) {
    if (element.hasChildNodes()) {
        Array.from(element.childNodes).forEach(childNode => replaceAllText(childNode, dict, exceptions)); // Fix the function call inside the forEach loop
    } else if (element.nodeType === Text.TEXT_NODE) {
        // Replace the text of the text node
        element.textContent = await replaceTextByDict(element.textContent, dict, exceptions);
    }
}

// targetDictのkey-valueを反転させ、重複があれば最初のものを使用
const reverseDict = targetDict => {
    const reversedDict = {};
    for (let key in targetDict) {
        const value = targetDict[key];
        if (Array.isArray(value)) {
            for (let i = 0; i < value.length; i++) {
                if (!(value[i] in reversedDict)) {
                    reversedDict[value[i]] = key;
                }
            }
        } else {
            if (!(value in reversedDict)) {
                reversedDict[value] = key;
            }
        }
    }
    return reversedDict;
}


async function replaceTextByDict(text, dict, exceptions) {
    let result = text;
    let exdict = {};

    for (let exception of exceptions){
        const hashed = await sha256(exception);
        exdict[hashed] = exception;
        console.log("hash is "+hashed);
        result = result.replaceAll(exception, hashed);
    };
    console.log("current result === "+result)

    Object.keys(dict).forEach((key) => {
        const value = dict[key];
        result = result.replaceAll(key, value);
    })

    Object.keys(exdict).forEach((hashed) => {
        const value = exdict[hashed];
        result = result.replaceAll(hashed, value);
    });
    console.log("finally result === "+result)
    return result;
}

async function loadJson(jsonFile) {
    const url = browser.runtime.getURL(jsonFile);
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
}

async function main() {
    console.log('start')
    const targetDict = await loadJson('dict.json');
    const defaultExceptionsJson = await loadJson('exceptions.exsample.json');
    // "true"がvalueのものをリストとする
    const exceptions = Object.keys(defaultExceptionsJson).filter((key) => defaultExceptionsJson[key]);
    console.log(exceptions);
    await replaceAllText(document.body, reverseDict(targetDict), exceptions);
    console.log('replece done!')
    console.log(reverseDict(targetDict))
}

console.log('content.js')

main();
