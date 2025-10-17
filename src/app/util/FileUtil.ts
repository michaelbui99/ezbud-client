

export async function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (fileReader.result === null) {
        reject();
      }

      if (fileReader.result instanceof ArrayBuffer) {
        const decoder = new TextDecoder("utf-8");
        try {
          const res = decoder.decode(fileReader.result);
          resolve(res);
        } catch (e) {
          reject(e);
        }
      } else {
        resolve(fileReader.result as string);
      }
    }
    fileReader.readAsText(file);
  });
}
