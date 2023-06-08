/* eslint-disable @typescript-eslint/restrict-plus-operands */
// import { REFRESH_TOKEN_EXPIRED } from "@/constant/keyLocalStorage";

import userStore from "@/store/user";

const options: () => RequestInit = () => {
  const accessToken = userStore.getState().accessToken;
  return {
    // credentials: "include", // send cookies // enable this if you want to use refresh token
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  };
};

const HTTPServices = {
  // GET
  get: async (endpoint: string, params?: Record<string, string> | URLSearchParams) => {
    let apiUrl: string = endpoint;
    const searchParams: URLSearchParams = new URLSearchParams(params);

    const searchParamsEntries = searchParams.entries();

    for (const [key, value] of searchParamsEntries) {
      if (value === "") searchParams.delete(key);
    }

    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    if (searchParams) apiUrl = apiUrl + "?" + searchParams;

    const res = await fetch(apiUrl, {
      ...options(),
      method: "GET",
    });

    // response interceptor
    return responseInterceptor(res);
  },
  // POST
  post: async (endpoint: string, data?: object) => {
    const apiUrl: string = endpoint;
    const res = await fetch(apiUrl, {
      ...options(),
      method: "POST",
      body: JSON.stringify(data),
    });

    // response interceptor
    return responseInterceptor(res);
  },

  // POST FOR UPLOAD FILE
  post2: async (endpoint: string, data?: FormData) => {
    const apiUrl: string = endpoint;
    const res = await fetch(apiUrl, {
      credentials: "include",
      body: data,
      method: "POST",
    });

    // response interceptor
    return responseInterceptor(res);
  },

  // PATCH
  patch: async (endpoint: string, data?: object) => {
    const apiUrl: string = endpoint;
    const res = await fetch(apiUrl, {
      ...options(),
      method: "PATCH",
      body: JSON.stringify(data),
    });

    // response interceptor
    return responseInterceptor(res);
  },

  // UPDATE
  put: async (endpoint: string, data?: object) => {
    const apiUrl: string = endpoint;
    const res = await fetch(apiUrl, {
      ...options(),
      method: "PUT",
      body: JSON.stringify(data),
    });
    return responseInterceptor(res);
  },

  // DELETE
  delete: async (endpoint: string, data?: object) => {
    const apiUrl: string = endpoint;
    const res = await fetch(apiUrl, {
      ...options(),
      method: "DELETE",
      body: JSON.stringify(data),
    });
    // response interceptor
    return responseInterceptor(res);
  },
};

const responseInterceptor = (response: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // const res = await response.json();

  // Handle token expired
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  // if (res.status_code === 401 && res.message === "Token expired") {
  //   UserServices.refreshToken()
  //     .then(res => {
  //       // Handle refresh token expired
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //       if (res.status_code === 401 || res.message === "User not found") {
  //         localStorage.setItem(REFRESH_TOKEN_EXPIRED, JSON.stringify(true));
  //       }
  //     })
  //     .catch(console.log);
  // }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.json();
};

export default HTTPServices;
