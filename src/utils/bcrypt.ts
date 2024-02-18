import * as bcrypt from "bcrypt";

const encript = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

const compare = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export { encript, compare };
