import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { delay } from "@/lib/mock/random";

import { createCustomersMock } from "../mocks/customers.mock";
import type { CustomerFormValues } from "../schemas/customer.schema";
import type { Customer } from "../types";

let db: Customer[] = createCustomersMock();

export const customerKeys = {
  all: ["customers"] as const,
  list: () => [...customerKeys.all, "list"] as const,
};

export const customersQuery = () =>
  queryOptions({ queryKey: customerKeys.list(), queryFn: () => delay([...db]) });

export function useCustomers() {
  return useQuery(customersQuery());
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: CustomerFormValues) => {
      const now = new Date().toISOString();
      const customer: Customer = {
        ...values,
        id: `c-${Date.now()}`,
        segment: "new",
        totalSpent: 0,
        visits: 0,
        cashback: 0,
        debt: 0,
        birthday: now,
        lastVisit: now,
        createdAt: now,
      };
      db = [customer, ...db];
      return delay(customer);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: customerKeys.all }),
  });
}
