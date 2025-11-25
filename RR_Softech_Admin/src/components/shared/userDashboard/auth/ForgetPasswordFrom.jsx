import React from "react";
import useAuth from "../../../../hooks/UserDashboard/useAuth";
import CommonForm from "../../../common/CommonForm";
import { forgetFields } from "../../../../utils/UserDashboard/services/forgetFields";
import { handleApiError } from "../../../../utils/UserDashboard/services/handleApiError";
import { forgotPassword } from "../../../../api/auth";
import { toast } from "react-toastify";


export default function ForgetPasswordFrom({ setMode }) {
  const { logout } = useAuth();

  async function handleForgetPassword(values) {
    try {
      const payload = {
        email: values.email, 
      };

      const response = await forgotPassword(payload); 

      if (response?.message) {
        toast.success("Please check you email to reset your password ")
        logout();
        setMode("login");
      }
    } catch (err) {
      handleApiError(err, "Failed to Send Email");
      throw err;
    }
  }

  return (
    <>
      <h3 className="text-2xl font-bold mb-2 text-center">Forgot password</h3>

      <CommonForm
        fields={forgetFields}
        submitLabel="Forget Password"
        onSubmit={handleForgetPassword} 
      />
    </>
  );
}
