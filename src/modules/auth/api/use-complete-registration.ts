import { QueryKey } from "@/src/shared/api/constants/api-keys/query-key";
import { MutationKey } from "../../../shared/api/constants/api-keys/mutation-key";

import { CompleteRegistrationDto, CompleteRegistrationResponseDto } from "@/src/shared/api/types/data-contracts";
import { ApiRequest } from "@/src/shared/api/types/native-types-api";
import { api } from "@/src/shared/api/utils/axios-api-base";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner-native";


export const useCompleteRegistration = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [MutationKey.COMPLETE_REGISTRATION],
        mutationFn: completeRegistration,
        onSuccess: async (data) => {
            if (data) {
                await queryClient.invalidateQueries({
                    queryKey: [QueryKey.GET_ME],
                });

            }
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || 'An error occurred', {duration: 10000});
        }
    });
};

type SigUpRequest = ApiRequest<"AUTH.COMPLETE_REGISTRATION", void, CompleteRegistrationDto, CompleteRegistrationResponseDto>;

export const completeRegistration = async (data: CompleteRegistrationDto): Promise<CompleteRegistrationResponseDto> => {
    const response = await api.post<SigUpRequest>({
        url: "user/complete-registration",
        body: data,
    });
    return response?.data;
};
