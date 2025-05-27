import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Formik } from "formik";
import { toast } from "react-toastify";

import Input from "../components/form/Input";
import Textarea from "../components/form/Textarea";
import Button from "../components/Button";
import { useEditUserProfileHook } from "../hooks/useUserDataHook";
import {
  USER_BIO_MAX_LENGTH,
  USER_LOCATION_MAX_LENGTH,
} from "../constants/policies";
import { ProfileSchema } from "../util/userValidationSchema";
import { updateUser } from "../features/authSlice";

export default function CreateLedger() {
  const { token, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const notifyProfileSaveSuccess = () => toast.success("Ledger saved");
  const notifyProfileSaveError = () => toast.error("Cannot save ledger");

  const editProfile = useEditUserProfileHook(token);

  useEffect(() => {
    if (editProfile?.isSuccess) {
      notifyProfileSaveSuccess();
      dispatch(updateUser(editProfile?.data?.data));
    }
    if (editProfile?.isError) notifyProfileSaveError();
  }, [
    editProfile?.isSuccess,
    editProfile?.isError,
    editProfile?.data?.data,
    dispatch,
  ]);

  return (
    <>
      <h1 className="text-4xl font-bold text-left mb-4">Edit Profile</h1>

      <div className="bg-white rounded-xl p-4 mb-4">
        <Formik
          enableReinitialize={true}
          validationSchema={ProfileSchema}
          initialValues={{
            firstName: user?.firstName || "",
            middleName: user?.middleName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            location: user?.location || "",
            organization: user?.organization || "",
            jobTitle: user?.jobTitle || "",
            bio: user?.bio || "",
          }}
          onSubmit={async (values) => {
            editProfile.mutate(values);
          }}
        >
          {({ values }) => (
            <Form>
              <div className="my-2">
                <h3 className="text-base font-semibold text-gray-900">
                  Personal
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  This information will be displayed publicly so be careful what
                  you share
                </p>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-2">
                <Input
                  label="First Name *"
                  type="text"
                  name="firstName"
                  placeholder="First name"
                />
                <Input
                  label="Middle Name"
                  type="text"
                  name="middleName"
                  placeholder="Middle name"
                />
                <Input
                  label="Last Name *"
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                />
                <Input
                  label="Email *"
                  type="email"
                  name="email"
                  placeholder="Email"
                />

                <div>
                  <Textarea
                    label="Location"
                    placeholder="Location"
                    name="location"
                  />
                  <span
                    className={`text-sm ${
                      values?.location?.length > USER_LOCATION_MAX_LENGTH
                        ? "text-red-500"
                        : null
                    }`}
                  >
                    ({values?.location?.length}/{USER_LOCATION_MAX_LENGTH})
                  </span>
                </div>
              </div>

              <h3 className="text-base font-semibold text-gray-900 mt-4 mb-2">
                Professional
              </h3>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-2">
                <Input
                  label="Organization"
                  type="text"
                  name="organization"
                  placeholder="Organization"
                />

                <Input
                  label="Job Title"
                  type="text"
                  name="jobTitle"
                  placeholder="Job title"
                />

                <div>
                  <Textarea label="Bio" placeholder="Bio" name="bio" />
                  <span
                    className={`text-sm ${
                      values?.bio?.length > USER_BIO_MAX_LENGTH
                        ? "text-red-500"
                        : null
                    }`}
                  >
                    ({values?.bio?.length}/{USER_BIO_MAX_LENGTH})
                  </span>
                </div>
              </div>

              <p className="text-red-500 text-sm text-left">
                {editProfile?.isError &&
                  editProfile?.error?.response?.data?.error?.message}
              </p>

              <Button
                type="submit"
                className="h-12 w-auto px-4 mt-2"
                isLoading={editProfile.isPending}
              >
                {editProfile?.isSuccess
                  ? "Saved 🎉"
                  : editProfile?.isPending
                  ? "Saving..."
                  : "Save"}
              </Button>

              <Button
                type="reset"
                className="h-12 w-auto px-4 mt-2 ms-4"
                variant="secondary"
              >
                Reset
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
