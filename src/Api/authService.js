import Cookies from "js-cookie";

export const getSession = () => {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
};

export const setSession = (user, expiryTimeInSeconds) => {
  const expiry = new Date().getTime() + expiryTimeInSeconds * 1000; 
  Cookies.set('user', JSON.stringify({ ...user, expiry }), { expires: expiryTimeInSeconds / 86400 });

  // Cookies.set("user", JSON.stringify({ ...user, expiry }), {
  //   expires: expiryTimeInSeconds / 86400,
  //   domain: ".wagnistrip.com", 
  //   secure: true, 
  //   sameSite: "None",
  // });
};

export const clearSession = () => {
  Cookies.remove('user');
  // Cookies.remove("user", {
  //   domain: ".wagnistrip.com",
  //   secure: true,
  //   sameSite: "None",
  // });
};
