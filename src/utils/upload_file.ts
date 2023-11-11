export const upload = (file: any, url: string, callback: Function) => {
  file.mv(url, callback)
}
