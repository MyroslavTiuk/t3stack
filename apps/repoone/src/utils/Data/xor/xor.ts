// import _ from '_';

const xor = (b1: boolean, b2: boolean) => {
  return (b1 || b2) && !(b1 && b2);
};

export default xor;
