export const readTag = (setMessage,addItem)=> {
    if ("NDEFReader" in window) {
          /*global NDEFReader*/
      const reader = new NDEFReader();
      try {
        reader.scan();
        const decoder = new TextDecoder();
        reader.onreading = event => {
          addItem(decoder.decode(event.message.records[0].data));
        }
      } catch(error) {
        setMessage(error.message);
      }
    } else {
        setMessage("Web NFC 未能支援");
    }
  } 
/*
  export const readTag = (setMessage,addItem) => {
    if ("NDEFReader" in window) {
          /*global NDEFReader*//*
      const reader = new NDEFReader();
      try {
        reader.scan();
        reader.onreading = event => {
          const decoder = new TextDecoder();
          addItem(decoder.decode(event.message.records[0].data));
        }
      } catch(error) {
        setMessage(error.message);
        return "error";
      }
    } else {
        setMessage("Web NFC 未能支援");
    }
  }
  */
 export async function writeTag() {
    if ("NDEFWriter" in window) {
          /*global NDEFWriter*/
      const writer = new NDEFWriter();
      try {
        await writer.write("What Web Can Do Today");
        consoleLog("NDEF message written!");
      } catch(error) {
        consoleLog(error);
      }
    } else {
      consoleLog("Web NFC is not supported.");
    }
  }
  
  function consoleLog(data) {
    var logElement = document.getElementById('log');
    logElement.innerHTML += data + '\n';
  }