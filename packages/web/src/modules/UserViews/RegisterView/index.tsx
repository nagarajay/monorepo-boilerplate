import React from "react";
import { Formik, FormikProps, Form, Field } from "formik";
import { registerSchema } from "@monorepo/common";
import { useRegister } from "@monorepo/controller";

interface MyFormValues {
  fullname: string;
  email: string;
  password: string;
  // newsletter: boolean;
}

interface Props {
  email: string;
}

export default () => {
  const { submit } = useRegister();
  return (
    <>
      <h1>Register Form</h1>
      <Formik
        initialValues={{
          fullname: "",
          email: "",
          password: ""
          // newsletter: false
        }}
        onSubmit={async (values: MyFormValues, { setErrors, resetForm }) => {
          const error = await submit(values);

          if (error) {
            setErrors({ password: error.email });
          } else {
            resetForm();
          }
        }}
        validationSchema={registerSchema}
        render={({
          values,
          // Very Imp to use isSubmitting
          isSubmitting,
          errors,
          touched
        }: FormikProps<MyFormValues>) => (
          <Form>
            <div>
              <Field type="text" name="fullname" placeholder="Fullname" />
              {errors.fullname && touched.fullname && (
                <span>{errors.fullname}</span>
              )}
            </div>
            <div>
              <Field type="text" name="email" placeholder="Email" />
              {errors.email && touched.email && <span>{errors.email}</span>}
            </div>
            <div>
              <Field type="password" name="password" placeholder="Password" />
              {errors.password && touched.password && (
                <span>{errors.password}</span>
              )}
            </div>

            {/* <label>
              <Field
                type="checkbox"
                name="newsletter"
                checked={values.newsletter}
              />
              Join our newsletter
            </label> */}
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      />
    </>
  );
};
