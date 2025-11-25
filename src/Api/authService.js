import Cookies from "js-cookie";

export const getSession = () => {
  const user = Cookies.get("user");
  return user ? JSON.parse(user) : null;
};

export const setSession = (user, expiryTimeInSeconds) => {
  const expiry = new Date().getTime() + expiryTimeInSeconds * 1000; // Calculate expiry time in milliseconds
  Cookies.set('user', JSON.stringify({ ...user, expiry }), { expires: expiryTimeInSeconds / 86400 }); // Convert seconds to days

  // Cookies.set("user", JSON.stringify({ ...user, expiry }), {
  //   expires: expiryTimeInSeconds / 86400, // convert seconds -> days
  //   domain: ".wagnistrip.com", // ✅ share cookie across subdomains
  //   secure: true, // ✅ only over HTTPS
  //   sameSite: "None", // ✅ required for cross-subdomain cookies
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
