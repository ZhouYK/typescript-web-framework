import { gluer } from 'femo';

const person = gluer((data, state) => ({ ...state, ...data }), {
    title: '',
});

const country = gluer('China');
const demo = {
    person,
    country,
};

export default demo;
