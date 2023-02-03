const BASE_URL = "https://dwhl0ooap1.execute-api.eu-central-1.amazonaws.com/dev"

const ApiConstants = {
    BASE_URL: BASE_URL,
    LOGIN: "/login",
    MY_ACCOUNT: "/myAccount",
    REGISTER: "/account/register",
    UPDATE_ACCOUNT:(userId) => `/account/${userId}`,
    DELETE_COMPANY:(companyId) => `/delete/${companyId}`,
    COMPANY_LIST: "/company/list",
    PORTFOLIO_LIST: "/portfolio/list",
    CREATE_DATAFILES: "/datafiles",
    UPDATE_PASSWORD: "/updatepassword"
}

export default ApiConstants