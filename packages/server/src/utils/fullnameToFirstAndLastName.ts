export const firstLetterCap = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const fullnameToFirstName = (str: string) => {
  const firstname = firstLetterCap(str.split(" ")[0]);
  return firstname;
};

export const fullnameToLastName = (str: string) => {
  let lastname = "";
  if (str.split(" ").length > 1) {
    lastname = firstLetterCap(str.split(" ")[str.split(" ").length - 1]);
  }

  return lastname;
};
