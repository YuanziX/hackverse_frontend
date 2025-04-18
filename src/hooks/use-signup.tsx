import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../lib/constant";

type SignupInput = {
  email: string;
  password: string;
};

export const useSignup = () => {
  return useMutation<void, Error, SignupInput>({
    mutationFn: async (data) => {
      const res = await axios.post(`${BASE_URL}/auth/signup`, data);
      console.log(res.data);
    },
    onSuccess: (_) => {},
    onError: (error) => {
      return error;
    },
  });
};
