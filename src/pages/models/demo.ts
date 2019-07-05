import { gluer, gas } from 'glue-redux';

const person = gluer((data, state) => ({ ...state, ...data }), {
  title: '',
});

const country = gas(async (cou) => cou, gluer('China'));
const demo = {
  person,
  country
};

export default demo;
