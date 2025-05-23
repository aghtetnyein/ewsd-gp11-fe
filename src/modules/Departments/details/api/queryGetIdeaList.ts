import { AXIOS_CLIENT } from "@/lib/axios-api-client";
import { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getIdeaList = ({
  departmentId,
  categoryId,
  startDate,
  endDate,
  orderBy,
  page,
  perPage,
  isHidden,
}: {
  departmentId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  orderBy?: string;
  page?: number;
  perPage?: number;
  isHidden?: boolean;
}) => {
  const params = new URLSearchParams();

  if (departmentId) params.append("department_id", departmentId);
  if (categoryId) params.append("category_id", categoryId);
  if (startDate) params.append("start_date", startDate);
  if (endDate) params.append("end_date", endDate);
  if (orderBy) params.append("order_by", orderBy);
  if (page) params.append("page", page.toString());
  if (perPage) params.append("per_page", perPage.toString());
  if (isHidden) params.append("is_hidden", "0");

  const queryString = params.toString();

  return queryOptions({
    queryKey: [
      "getIdeaList",
      {
        departmentId,
        categoryId,
        startDate,
        endDate,
        orderBy,
        page,
        perPage,
        isHidden,
      },
    ],
    queryFn: () => AXIOS_CLIENT.get(`ideas?${queryString}`),
    select: (data) => data?.data,
  });
};

type UseGetIdeaListOptions = {
  params?: {
    departmentId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    orderBy?: string;
    page?: number;
    perPage?: number;
    isHidden?: boolean;
  };
  queryConfig?: QueryConfig<typeof getIdeaList>;
};

export const useGetIdeaList = ({
  params = {},
  queryConfig,
}: UseGetIdeaListOptions) => {
  return useQuery({
    ...getIdeaList({ ...params }),
    ...queryConfig,
  });
};
