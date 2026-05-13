// Mock data untuk user credentials
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    password: "Admin@123",
    name: "Admin User",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "test@example.com",
    password: "Test@123",
    name: "Test User",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "3",
    email: "user@example.com",
    password: "User@123",
    name: "Regular User",
    createdAt: new Date("2024-03-01"),
  },
];

// Simulasi database local storage
export const getRegisteredUsers = (): User[] => {
  const stored = localStorage.getItem("registeredUsers");
  if (stored) {
    return JSON.parse(stored);
  }
  return [...mockUsers];
};

export const addRegisteredUser = (user: User): void => {
  const users = getRegisteredUsers();
  users.push(user);
  localStorage.setItem("registeredUsers", JSON.stringify(users));
};

export const findUserByEmail = (email: string): User | undefined => {
  const users = getRegisteredUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

export const validateCredentials = (
  email: string,
  password: string,
): User | null => {
  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};
