export const getCookie = (name) => {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');
  console.log("====UTIL======", cookieString)
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return null; 
}