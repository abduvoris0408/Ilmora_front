/** Umumiy fixture — header'dagi filial tanlagich va Boshqaruv → Filiallar sahifasi ishlatadi */
export interface Branch {
  id: string;
  name: string;
  address: string;
  type: "store" | "warehouse";
  employees: number;
  monthlyRevenue: number;
  manager: string;
  active: boolean;
}

export const BRANCHES: Branch[] = [
  {
    id: "b-1",
    name: "Chilonzor",
    address: "Toshkent, Chilonzor tumani, Bunyodkor ko'chasi 12",
    type: "store",
    employees: 14,
    monthlyRevenue: 486_500_000,
    manager: "Sardor Yusupov",
    active: true,
  },
  {
    id: "b-2",
    name: "Yunusobod",
    address: "Toshkent, Yunusobod tumani, Amir Temur ko'chasi 108",
    type: "store",
    employees: 11,
    monthlyRevenue: 392_000_000,
    manager: "Madina Rahimova",
    active: true,
  },
  {
    id: "b-3",
    name: "Samarqand Darvoza",
    address: "Toshkent, Shayxontohur tumani, Samarqand Darvoza SM",
    type: "store",
    employees: 9,
    monthlyRevenue: 318_200_000,
    manager: "Otabek Nazarov",
    active: true,
  },
  {
    id: "b-4",
    name: "Markaziy ombor",
    address: "Toshkent viloyati, Zangiota tumani",
    type: "warehouse",
    employees: 6,
    monthlyRevenue: 0,
    manager: "Rustam Qodirov",
    active: true,
  },
];
