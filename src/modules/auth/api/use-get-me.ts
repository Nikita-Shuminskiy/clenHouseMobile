import { useAppQuery } from "@/src/shared/api/api-hooks/use-app-query";
import { QueryKey } from "@/src/shared/api/constants/api-keys/query-key";
import { IUserDto } from "@/src/shared/api/types/data-contracts";
import { ApiRequest } from "@/src/shared/api/types/native-types-api";
import { api } from "@/src/shared/api/utils/axios-api-base";


export const useGetMe = () => {
    return useAppQuery(QueryKey.GET_ME, [], getMe, {
        retry: false,
        enabled: true,
        staleTime: 0,
    });
};
type GetMeRequest = ApiRequest<"AUTH.GET_ME", void, IUserDto, any>;

export const getMe = async (): Promise<IUserDto> => {
    const res = await api.get<GetMeRequest>({
        url: "auth/me",
    });
    return res.data
};
