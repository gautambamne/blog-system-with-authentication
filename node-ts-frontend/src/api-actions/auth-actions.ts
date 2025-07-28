import { RegisterFormData } from "@/app/(auth)/register/register-form";
import axiosInstance from "@/lib/axios-interceptor"
import { ApiError } from "next/dist/server/api-utils";


export const AuthActions = {
    login : async (data : {identifier: string, password: string}) : Promise<IUserLoginResponse> => {
       try {
        const response = await axiosInstance.post<ApiResponse<IUserLoginResponse>>('/auth/login' , data);
        if(response.data.data){
            return response.data.data
        } else {
            throw response.data.apiError
        }
       } catch (error) {
         if(error instanceof ApiError){
            throw error;
         }
         throw error; 
       }
    },
    register :  async (data :RegisterFormData ) : Promise<{
        message : string,
        user : IUser
    }> => {
       try {
        const response = await axiosInstance.post<ApiResponse<{
        message : string,
        user : IUser
        }>>('/auth/register' , data);
        if(response.data.data){
            return response.data.data
        } else {
            throw response.data.apiError
        }
       } catch (error) {
         if(error instanceof ApiError){
            throw error;
         }
         throw error; 
       }
    },
    verify_email  :  async (data : {email: string, verification_code: string}) : Promise<{
        message : string,
        user : IUser
    }> => {
       try {
        const response = await axiosInstance.post<ApiResponse<{
         message : string,
        user : IUser
        }>>('/auth/verify-email' , data);
        if(response.data.data){
            return response.data.data
        } else {
            throw response.data.apiError
        }
       } catch (error) {
         if(error instanceof ApiError){
            throw error;
         }
         throw error; 
       }
    },
    resend_verification_mail :  async (email : string) : Promise<{
        message : string
    }> => {
       try {
        const response = await axiosInstance.post<ApiResponse<{
            message : string
        }>>('/auth/resend-verification' , email);
        if(response.data.data){
            return response.data.data
        } else {
            throw response.data.apiError
        }
       } catch (error) {
         if(error instanceof ApiError){
            throw error;
         }
         throw error; 
       }
    },
    refresh_token :  async () : Promise<IUserLoginResponse> => {
       try {
        const response = await axiosInstance.post<ApiResponse<IUserLoginResponse>>('/auth/refresh-token');
        if(response.data.data){
            return response.data.data
        } else {
            throw response.data.apiError
        }
       } catch (error) {
         if(error instanceof ApiError){
            throw error;
         }
         throw error; 
       }
    },
    logout :  async () : Promise<{
        message : string
    }> => {
       try {
        const response = await axiosInstance.post<ApiResponse<{
            message : string
        }>>('/auth/logout');
        if(response.data.data){
            return response.data.data
        } else {
            throw response.data.apiError
        }
       } catch (error) {
         if(error instanceof ApiError){
            throw error;
         }
         throw error; 
       }
    },
}