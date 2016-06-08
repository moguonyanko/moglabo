package practicejsf.bean.service;

import practicejsf.bean.Customer;

/**
 * いわゆるビジネスロジックのインターフェース
 */
public interface CustomerLookupService {
	Customer findCustomer(String id);
}
