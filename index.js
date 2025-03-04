const { Client } = require('pg');
const inquirer = require('inquirer');

// Database connection configuration
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'employee_tracker',
  password: 'password',
  port: 5432,
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

// Start the application
mainMenu();