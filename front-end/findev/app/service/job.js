import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { localUrl } from "../../utils/path";

export const jobApi = createApi({
    reducerPath: "jobApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${localUrl}/jobs`,
    }),
    endpoints: (builder) => ({
        // get all jobs ex: /jobs
        // with pagination ex: /jobs?page=1&count_per_page=10
        // handle if page or countPerPage is null
        getJobs: builder.query({
            query: ({ page = 1, countPerPage = 10 }) => `?page=${page}&count_per_page=${countPerPage}`,
        }),
        // get job detail with id ex: /jobs/1
        getJobDetail: builder.query({
            query: (id) => `/${id}`,
        }),
    }),
});

export const { useGetJobs, useGetJobDetailQuery } = jobApi;