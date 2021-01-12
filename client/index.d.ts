interface IUser {
  email: string;
  emailVerified: boolean;
  id: number;
  name: string;
  token: string;
}

interface IFile {
  name: string;
  uuid: string;
  size: number;
}

interface Feature {
  id: string;
  slug: string;
  name: string;
  description: string;
  value: string;
}

interface Usage {
  id: string;
  feature: Feature;
  used: number;
}

interface Plan {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
  price: string;
  priceFormatter: string;
  currency: string;
  features: Feature[];
}

interface ISubscription {
  id: string;
  name: string;
  description?: any;
  startsAt: Date;
  plan: Plan;
  usages: Usage[];
}
