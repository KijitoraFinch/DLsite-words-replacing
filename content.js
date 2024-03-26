// content.js
function replaceAllText(element, dict) {
    if (element.hasChildNodes()) {
        Array.from(element.childNodes).forEach(childNode => replaceAllText(childNode, dict)); // Fix the function call inside the forEach loop
    } else if (element.nodeType === Text.TEXT_NODE) {
        // Replace the text of the text node
        element.textContent = replaceTextByDict(element.textContent, dict);
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
                    break;
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
function replaceTextByDict(text, dict){
    let result = text; // Add missing variable declaration
    for (let key in dict){
        result = result.replace(key, dict[key])
    }
    return result;
}

async function loadJson() {
    const url = browser.runtime.getURL('dict.json');
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
}

async function main() {
    const targetDict = await loadJson();
    replaceAllText(document.body, reverseDict(targetDict));
    console.log('replece done!')
    console.log(reverseDict(targetDict))
}

main();
