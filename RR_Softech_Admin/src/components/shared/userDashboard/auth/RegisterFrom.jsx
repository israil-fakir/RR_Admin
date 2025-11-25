import React from "react";
import { toast } from "react-toastify";
import { registerUser } from "../../../../api/auth";
import CommonForm from "../../../common/CommonForm";
import { handleApiError } from "../../../../utils/UserDashboard/services/handleApiError";
import { registerFields } from "../../../../utils/UserDashboard/services/registerFields";

export default function RegisterFrom({ setMode }) {
  
  async function handleRegister(values) {
    try {
      const payload = {
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        role: "CUSTOMER",
      };
      await registerUser(payload);
      toast.success("Registration successful! Please log in to continue.");
      setMode("login");
    } catch (err) {
      handleApiError(err, "Registration failed. Please try again.");
      throw err;
    }
  }
  return (
    <>
      <h3 className="text-2xl font-bold mb-2 text-center">Sign Up</h3>
      <CommonForm
        fields={registerFields}
        submitLabel="Register"
        onSubmit={handleRegister}
        extraFooter={
          <div className="text-sm mt-2 flex justify-between">
            <button
              onClick={() => setMode("login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Have account? Login
            </button>
          </div>
        }
      />
    </>
  );
}
