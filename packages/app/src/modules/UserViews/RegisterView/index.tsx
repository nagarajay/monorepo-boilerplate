import React from "react";
import { Formik, FormikProps, Field } from "formik";
import { registerSchema } from "@monorepo/common";
import { useRegister } from "@monorepo/controller";
import { View, Button, TextInput, Text, Alert } from "react-native";

interface MyFormValues {
  fullname: string;
  email: string;
  password: string;
}

interface Props {
  email: string;
}

export default () => {
  const { submit } = useRegister();
  return (
    <View style={{ marginTop: 200, marginLeft: 50, marginRight: 50 }}>
      <Text>Register Form</Text>
      <Formik
        initialValues={{
          fullname: "",
          email: "",
          password: ""
        }}
        // onSubmit={values => Alert.alert(JSON.stringify(values))}
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
          touched,
          handleSubmit,
          handleChange,
          setFieldTouched,
          isValid
        }: FormikProps<MyFormValues>) => (
          <View>
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              placeholder={"Fullname"}
              onChangeText={handleChange("fullname")}
              onBlur={() => setFieldTouched("fullname")}
              value={values.fullname}
            />
            {errors.fullname && touched.fullname && (
              <Text style={{ fontSize: 10, color: "red" }}>
                {errors.fullname}
              </Text>
            )}
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              placeholder={"E-Mail"}
              onChangeText={handleChange("email")}
              onBlur={() => setFieldTouched("email")}
              autoCapitalize="none"
              value={values.email}
            />
            {errors.email && touched.email && (
              <Text style={{ fontSize: 10, color: "red" }}>{errors.email}</Text>
            )}
            <TextInput
              style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
              placeholder={"Password"}
              onChangeText={handleChange("password")}
              onBlur={() => setFieldTouched("password")}
              autoCapitalize="none"
              value={values.password}
              secureTextEntry={true}
            />
            {errors.password && touched.password && (
              <Text style={{ fontSize: 10, color: "red" }}>
                {errors.password}
              </Text>
            )}

            <Button
              title="Submit"
              onPress={handleSubmit as any}
              disabled={!isValid || isSubmitting}
              color="#ff4040"
            />
          </View>
        )}
      />
    </View>
  );
};
