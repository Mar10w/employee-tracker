const { Client } = require('pg');
const inquirer = require('inquirer');
require('dotenv').config();

// Database connection configuration
const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

// Connect to the database
client.connect();

const mainMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Update employee managers',
        'View employees by manager',
        'View employees by department',
        'Delete departments, roles, and employees',
        'View the total utilized budget of a department',
        'Exit'
      ]
    }
  ]).then(answer => {
    switch (answer.action) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Update employee managers':
        updateEmployeeManager();
        break;
      case 'View employees by manager':
        viewEmployeesByManager();
        break;
      case 'View employees by department':
        viewEmployeesByDepartment();
        break;
      case 'Delete departments, roles, and employees':
        deleteEntity();
        break;
      case 'View the total utilized budget of a department':
        viewDepartmentBudget();
        break; 
      case 'Exit':
        client.end();
        break;
    }
  });
};

const viewAllDepartments = () => {
  client.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    mainMenu();
  });
};

const viewAllRoles = () => {
  client.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    mainMenu();
  });
};

const viewAllEmployees = () => {
  client.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    mainMenu();
  });
};

const addDepartment = () => {
  inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:'
    }
  ]).then(answer => {
    client.query('INSERT INTO department (name) VALUES ($1)', [answer.name], (err, res) => {
      if (err) throw err;
      console.log('Department added successfully');
      mainMenu();
    });
  });
};

const addRole = () => {
  inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'Enter the title of the role:'
    },
    {
      name: 'salary',
      type: 'input',
      message: 'Enter the salary of the role:'
    },
    {
      name: 'department_id',
      type: 'input',
      message: 'Enter the department ID for the role:'
    }
  ]).then(answer => {
    client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answer.title, answer.salary, answer.department_id], (err, res) => {
      if (err) throw err;
      console.log('Role added successfully');
      mainMenu();
    });
  });
};

const addEmployee = () => {
  inquirer.prompt([
    {
      name: 'first_name',
      type: 'input',
      message: 'Enter the first name of the employee:'
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'Enter the last name of the employee:'
    },
    {
      name: 'role_id',
      type: 'input',
      message: 'Enter the role ID for the employee:'
    },
    {
      name: 'manager_id',
      type: 'input',
      message: 'Enter the manager ID for the employee (if any):'
    }
  ]).then(answer => {
    client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], (err, res) => {
      if (err) throw err;
      console.log('Employee added successfully');
      mainMenu();
    });
  });
};

const updateEmployeeRole = () => {
  inquirer.prompt([
    {
      name: 'employee_id',
      type: 'input',
      message: 'Enter the ID of the employee you want to update:'
    },
    {
      name: 'role_id',
      type: 'input',
      message: 'Enter the new role ID for the employee:'
    }
  ]).then(answer => {
    client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answer.role_id, answer.employee_id], (err, res) => {
      if (err) throw err;
      console.log('Employee role updated successfully');
      mainMenu();
    });
  });
};

const updateEmployeeManager = () => {
    inquirer.prompt([
      {
        name: 'employee_id',
        type: 'input',
        message: 'Enter the ID of the employee you want to update:'
      },
      {
        name: 'manager_id',
        type: 'input',
        message: 'Enter the new manager ID for the employee:'
      }
    ]).then(answer => {
      client.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [answer.manager_id, answer.employee_id], (err, res) => {
        if (err) throw err;
        console.log('Employee manager updated successfully');
        mainMenu();
      });
    });
  };
  
  const viewEmployeesByManager = () => {
    inquirer.prompt([
      {
        name: 'manager_id',
        type: 'input',
        message: 'Enter the manager ID to view their employees:'
      }
    ]).then(answer => {
      client.query('SELECT * FROM employee WHERE manager_id = $1', [answer.manager_id], (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
      });
    });
  };
  
  const viewEmployeesByDepartment = () => {
    inquirer.prompt([
      {
        name: 'department_id',
        type: 'input',
        message: 'Enter the department ID to view its employees:'
      }
    ]).then(answer => {
      client.query(`
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, e.manager_id
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        WHERE d.id = $1
      `, [answer.department_id], (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
      });
    });
  };
  
  const deleteEntity = () => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'entity',
        message: 'What would you like to delete?',
        choices: ['Department', 'Role', 'Employee']
      },
      {
        name: 'id',
        type: 'input',
        message: 'Enter the ID of the entity you want to delete:'
      }
    ]).then(answer => {
      let query = '';
      switch (answer.entity) {
        case 'Department':
          query = 'DELETE FROM department WHERE id = $1';
          break;
        case 'Role':
          query = 'DELETE FROM role WHERE id = $1';
          break;
        case 'Employee':
          query = 'DELETE FROM employee WHERE id = $1';
          break;
      }
      client.query(query, [answer.id], (err, res) => {
        if (err) throw err;
        console.log(`${answer.entity} deleted successfully`);
        mainMenu();
      });
    });
  };
  
  const viewDepartmentBudget = () => {
    inquirer.prompt([
      {
        name: 'department_id',
        type: 'input',
        message: 'Enter the department ID to view its total utilized budget:'
      }
    ]).then(answer => {
      client.query(`
        SELECT d.name AS department, SUM(r.salary) AS total_budget
        FROM employee e
        JOIN role r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        WHERE d.id = $1
        GROUP BY d.name
      `, [answer.department_id], (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
      });
    });
  };
  
// Start the application
mainMenu();