import { SET_COMPANY_NAMES, SET_ACTIVE_STEP, SET_TEMPLATE_DATA, SET_TEMPLATE_ACTIVE_STEP } from './company.types';

const INITIAL_STATE = {
  company: null,
  activeStep: 0,
  esgTemplateData: null,
  templateData: null,
  templateActiveStep: 0
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_COMPANY_NAMES:
      return {
        ...state,
        company: action.company
      };
    case SET_ACTIVE_STEP:
      return {
        ...state,
        activeStep: action.value
      };
    case SET_TEMPLATE_DATA:
      return {
        ...state,
        templateData: action.company,
        esgTemplateData: action.esgData
      };
    case SET_TEMPLATE_ACTIVE_STEP:
      return {
        ...state,
        templateActiveStep: action.value
      };
    default:
      return state;
  }
};

export default reducer;
