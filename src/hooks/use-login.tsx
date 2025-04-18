import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../lib/constant";

type LoginInput = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
};

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async (data) => {
      const res = await axios.post(`${BASE_URL}/auth/login`, data);
      console.log(res.data);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.access_token);
    },
  });
};
