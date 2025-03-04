-- Insert data into the department table
INSERT INTO department (name) VALUES
('Engineering'),
('Human Resources'),
('Marketing');

-- Insert data into the role table
INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 80000, 1),
('HR Manager', 60000, 2),
('Marketing Specialist', 50000, 3),
('DevOps Engineer', 85000, 1),
('Recruiter', 55000, 2),
('Content Creator', 45000, 3);

-- Insert data into the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Emily', 'Jones', 3, NULL),
('Michael', 'Brown', 1, 1),
('Sarah', 'Davis', 3, 3),
('David', 'Wilson', 4, 1),
('Laura', 'Taylor', 5, 2),
('James', 'Anderson', 6, 3),
('Linda', 'Thomas', 1, 1),
('Robert', 'Jackson', 4, 1),
('Patricia', 'White', 2, NULL),
('Charles', 'Harris', 5, 2),
('Barbara', 'Martin', 3, 3),
('Daniel', 'Thompson', 6, 3),
('Jennifer', 'Garcia', 1, 1),
('Matthew', 'Martinez', 4, 1),
('Elizabeth', 'Robinson', 2, NULL),
('Anthony', 'Clark', 5, 2),
('Susan', 'Rodriguez', 3, 3),
('Christopher', 'Lewis', 6, 3);