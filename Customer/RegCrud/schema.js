const Sequelize = require("sequelize");
const mysql = require("mysql");
require('dotenv').config()

//Establish connection to the database
const initialize = async (host, username, password, database) => {
  const sqlConn = await mysql.createConnection({
    user: username,
    host: host,
    password: password,
    dateString: true,
  });
  sqlConn.query(`create database if not exists ${database}`, (err, results) => {
    if (err) {
      console.log({ err });
      sqlConn.end();
    } else {
      console.log(results);
      sqlConn.end();
    }
  });
};

//create database if it doesn't exist
initialize(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB);

//creating models by sequelize
const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
});

//Adding columns for query interface
//const queryInterface = sequelize.getQueryInterface();

//customer location table
const queryInterface = sequelize.getQueryInterface();

//customer location table
const Location = sequelize.define(
  "location",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ward: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    district: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    region: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Dar es Salaam"
    },
  },
  {}
);

//Occupation table
const Occupation = sequelize.define("occupation", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  occupation: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
});

//domestic workers table
const DomesticWorkers = sequelize.define("Domesticworkers", {
  domId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Joyce",
    get() {
      const midname = this.getDataValue("middlename");
      const lastname = this.getDataValue("lastname");
      return `${this.getDataValue("firstname")} ${midname} ${lastname}`;
    },
  },
  middlename: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "Emanuel",
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Msholwa",
  },
  gender: {
    type: Sequelize.CHAR,
    allowNull: false,
    defaultValue: "M",
    validate: {
      checkGender(value) {
        let array = ["F", "M"];
        if (array.indexOf(value) === -1) {
          throw new Error("Wrong value");
        }
      },
    },
  },
  birthdate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
});

Location.hasMany(DomesticWorkers, {
  allowNull: false
})
DomesticWorkers.belongsTo(Location, {
  allowNull: false
})

Location.hasMany(DomesticWorkers, {
  allowNull: false,
  as: 'homeLocation'
})
DomesticWorkers.belongsTo(Location, {
  allowNull: false,
  as: 'homeLocation'
})

//referee table
const Referee = sequelize.define("referee", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Hosea",
    get() {
      const midname = this.getDataValue("middlename");
      const lastname = this.getDataValue("lastname");
      return `${this.getDataValue("firstname")} ${midname} ${lastname}`;
    },
  },
  middlename: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Dickson",
  },
  gender: {
    type: Sequelize.CHAR,
    allowNull: false,
    defaultValue: "M",
    validate: {
      checkGender(value) {
        let array = ["F", "M"];
        if (array.indexOf(value) === -1) {
          throw new Error("Wrong value");
        }
      },
    },
  },
  birthdate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    validate: {
      isEmail: true
    }
  }
});

DomesticWorkers.hasMany(Referee, {
  allowNull: false
})
Referee.belongsTo(DomesticWorkers, {
  allowNull: false
})

Location.hasMany(Referee, {
  allowNull: false
})
Referee.belongsTo(Location, {
  allowNull: false
})

Occupation.hasMany(Referee, {
  allowNull: false
})
Referee.belongsTo(Occupation, {
  allowNull: false
})

//Customer table
const Customer = sequelize.define("customer", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Hosea",
    get() {
      const midname = this.getDataValue("middlename");
      const lastname = this.getDataValue("lastname");
      return `${this.getDataValue("firstname")} ${midname} ${lastname}`;
    },
  },
  middlename: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  lastname: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "Dickson",
  },
  gender: {
    type: Sequelize.CHAR,
    allowNull: false,
    defaultValue: "M",
    validate: {
      checkGender(value) {
        let array = ["F", "M"];
        if (array.indexOf(value) === -1) {
          throw new Error("Wrong value");
        }
      },
    },
  },
  birthdate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    validate: {
      isEmail: true
    }
  },
  role: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'customer'
  },
});
Customer.hasMany(DomesticWorkers, {
  allowNull: false
})
DomesticWorkers.belongsTo(Customer, {
  allowNull: false
})

Location.hasMany(Customer, {
  allowNull: false
})
Customer.belongsTo(Location, {
  allowNull: false
})

Occupation.hasMany(Customer, {
  allowNull: false
})
Customer.belongsTo(Occupation, {
  allowNull: false
})
//dom_worker history table
const DomWorkerHistory = sequelize.define("DomWorkerHistory");

Customer.hasMany(DomWorkerHistory, {
  allowNull: false
})
DomWorkerHistory.belongsTo(Customer, {
  allowNull: false
})

DomesticWorkers.hasMany(DomWorkerHistory, {
  allowNull: false
})
DomWorkerHistory.belongsTo(DomesticWorkers, {
  allowNull: false
})

//Contracts
const Contracts = sequelize.define("contracts", {
  contractRef: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  startDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  endDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

Customer.hasMany(Contracts, {
  allowNull: false
})
Contracts.belongsTo(Customer, {
  allowNull: false
})

DomesticWorkers.hasMany(Contracts, {
  allowNull: false
})
Contracts.belongsTo(DomesticWorkers, {
  allowNull: false
})

//payment table
const Payment = sequelize.define("payments", {
  paymentRef: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "pending",
    validate: {
      checkStatus(value) {
        let state = ["pending", "paid"];
        if (state.indexOf(value) === -1) {
          throw new Error("Not on of the status");
        }
      },
    },
  },
});

Customer.hasMany(Payment, {
  allowNull: false
})
Payment.belongsTo(Customer, {
  allowNull: false
})
DomesticWorkers.hasMany(Payment, {
  allowNull: false
})
Payment.belongsTo(DomesticWorkers, {
  allowNull: false
})

//problem Report
const ProblemReports = sequelize.define("problemReport", {
  // timeCreated: {
  //   type: Sequelize.DATE,
  //   allowNull: false,
  // },
  category: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      checkCategory(value) {
        let catArray = ["service", "behaviour"];
        if (catArray.indexOf(value) === -1) {
          throw new Error("Not one of the category");
        }
      },
    },
  },
  level: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      checkCategory(value) {
        let levelArray = ["low", "medium", "critical"];
        if (levelArray.indexOf(value) === -1) {
          throw new Error("Not one of the level");
        }
      },
    },
  },
  report: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

Customer.hasMany(ProblemReports, {
  allowNull: false
})
ProblemReports.belongsTo(Customer, {
  allowNull: false
})

DomesticWorkers.hasMany(ProblemReports, {
  allowNull: false
})
ProblemReports.belongsTo(DomesticWorkers, {
  allowNull: false
})

//sequelize.close()

// queryInterface
//   .addColumn("payments", "domId", {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

DomesticWorkers.hasMany(Payment, {
  allowNull: false
})
Payment.belongsTo(DomesticWorkers, {
  allowNull: false
})

const db = {
  sqlize: sequelize,
  customer: Customer,
  domWorker: DomesticWorkers,
  referee: Referee,
  domWorkerHistory: DomWorkerHistory,
  payment: Payment,
  report: ProblemReports,
  contract: Contracts,
  occupation: Occupation,
  location: Location,
  Sequelize: Sequelize,
};

module.exports = db;

sequelize.sync();
