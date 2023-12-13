import { APIPublic } from "./APIClient";
import memoize from "memoize";

const RefreshToken = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    const res = await APIPublic.post("/refresh-token", {
      accessToken,
      refreshToken,
    });
    const { data } = res;
    // console.log(res)
    if (!data?.accessToken) {
      localStorage.clear();
    }
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("expiredIn", data.expiredIn);
    // console.log(data)
    return data;
  } catch (error) {
    localStorage.clear();
  }
};

const maxAge = 10000;

const memoizedRefreshToken = memoize(RefreshToken, { maxAge });

export default memoizedRefreshToken;
