export const TableProperties = {
  SystemLogTable: {
    MODEL: 'SystemLog',
    NAME: 'system_logs',
  },

  CountryTable: {
    MODEL: 'Country',
    NAME: 'Countries',
  },

  StatesTable: {
    MODEL: 'States',
    NAME: 'States',
    COUNTRY_INDEX: 'country_index'
  },

  CityTable: {
    MODEL: 'City',
    NAME: 'Cities',
    STATE_INDEX: 'state_index',
    COUNTRY_INDEX: 'country_city_index'
  },

  UsersTable: {
    MODEL: 'Users',
    NAME: 'Users',
    EMAIL_INDEX: 'Users_email_index'
  },

  SubcriptionTable: {
    Model: 'Subcription',
    NAME: 'Subcription',
    USERS_INDEX: 'Subcription_user_index'
  },

  OrdersTable: {
    Model: 'Orders',
    NAME: 'Orders'
  },

  UserTrialTable: {
    Model: 'UserTrial',
    NAME: 'UserTrial',
    EMAIL_INDEX: 'User_trial_email_index'
  },

  VideosTable: {
    MODEL: 'Videos',
    NAME: 'Videos',
    ID_USER: 'Id_user_index'
  }
};
