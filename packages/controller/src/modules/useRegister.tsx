import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { RegisterInput } from "../generated/graphql";
import { normalizeErrors } from "../utils/normalizeErrors";

const REGISTER_MUTATION = gql`
  mutation RegisterMutation(
    $fullname: String!
    $email: String!
    $password: String!
  ) {
    register(
      data: { fullname: $fullname, email: $email, password: $password }
    ) {
      path
      message
    }
  }
`;

export const useRegister = () => {
  const [mutate] = useMutation(REGISTER_MUTATION);

  const submit = async (values: RegisterInput) => {
    const {
      data: { register }
    } = await mutate({ variables: values });

    if (register) {
      return normalizeErrors(register);
    }

    return null;
  };

  return { submit };
};
