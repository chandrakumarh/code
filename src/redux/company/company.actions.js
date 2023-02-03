import { SET_COMPANY_NAMES, SET_ACTIVE_STEP, SET_TEMPLATE_DATA, SET_TEMPLATE_ACTIVE_STEP } from './company.types';

export const setCompanyName = (company) => ({
  type: SET_COMPANY_NAMES,
  company
});

export const setActiveStep = (value) => ({
  type: SET_ACTIVE_STEP,
  value
});

export const setTemplateName = (company, esgData) => ({
  type: SET_TEMPLATE_DATA,
  esgData,
  company
});

export const setTemplateActiveStep = (value) => ({
  type: SET_TEMPLATE_ACTIVE_STEP,
  value
});
