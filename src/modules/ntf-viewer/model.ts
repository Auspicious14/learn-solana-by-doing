export interface INFT {
  id: string;
  name: string;
  symbol?: string;
  description?: string;
  image?: string;
  collection?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  uri?: string;
  creators: Array<{
    address: string;
    verified: boolean;
    share: number;
  }>;
  royalty?: {
    basis_points: number;
  };
}
