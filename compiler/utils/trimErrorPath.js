export const trimCppPath = (errorStr)=>{
  return errorStr.replace(/.*?\.cpp/g, '');
}