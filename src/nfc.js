export const readTag = setMessage=> {
    if ("NDEFReader" in window) {
          /*global NDEFReader*/
      const reader = new NDEFReader();
      return reader;
      /*
      try {
        await reader.scan();
        reader.onreading = event => {
          const decoder = new TextDecoder();
          for (const record of event.message.records) {
            consoleLog("Record type:  " + record.recordType);
            consoleLog("MIME type:    " + record.mediaType);
            consoleLog("=== data ===\n" + decoder.decode(record.data));
          }
          return decoder.decode(event.message.records[0].data);
        }
        
       
      } catch(error) {
        setMessage(error.message);
        return "error";
      }
      */
    } else {
        setMessage("Web NFC 未能支援");
        return null;
    }
  }
  
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