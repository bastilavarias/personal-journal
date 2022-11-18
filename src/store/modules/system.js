import moment from 'moment';

const systemModule = {
    state: {
        currentDate: moment().format('MMM D YYYY'),
    },
};

export default systemModule;
