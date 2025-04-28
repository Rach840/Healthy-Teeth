declare module "#auth-utils" {
  interface User {
    id: number;
    firstName: string;
    lastName: string;
    surName: string;
    gender: string;
    snils: string;
    email: string;
    password: string;
    birth: Date;
    phone: string;
  }

  interface UserSession {
    // Add your own fields
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export {};
