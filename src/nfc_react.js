import React from 'react';

const nfc_react = () => {
    const readTag = (setMessage, addItem,createInputItemObject) => {
        if ("NDEFReader" in window) {
            /*global NDEFReader*/
            const reader = new NDEFReader();
            try {
                reader.scan();
                const decoder = new TextDecoder();
                reader.onreading = event => {
                    addItem(decoder.decode(event.message.records[0].data),createInputItemObject);
                }
            } catch (error) {
                setMessage(error.message);
            }
        } else {
            setMessage("😫 錯誤 : Web NFC 未能支援");
        }
    }

    async function writeTag() {
        if ("NDEFWriter" in window) {
            /*global NDEFWriter*/
            const writer = new NDEFWriter();
            try {
                await writer.write("What Web Can Do Today");
                consoleLog("NDEF message written!");
            } catch (error) {
                consoleLog(error);
            }
        } else {
            consoleLog("Web NFC is not supported.");
        }
    }

    return [readTag,writeTag];

}

function consoleLog(data) {
    var logElement = document.getElementById('log');
    logElement.innerHTML += data + '\n';
}

export default nfc_react;


