package practicejsf.bean.service.simple;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import practicejsf.bean.Customer;
import practicejsf.bean.service.CustomerLookupService;
import practicejsf.util.Faces;

/**
 * いわゆるビジネスロジックの実装
 */
public class CustomerSimpleMap implements CustomerLookupService {

	private final Map<String, Customer> customers = new HashMap<>();

	private static final List<Customer> SAMPLE_CUSTOMERS = Arrays.asList(
		new Customer("id001", "Usao", "Foo", -1000.50),
		new Customer("id002", "Mog", "Bar", 7654.32),
		new Customer("id003", "Pusuta", "Baz", 20000.88)
	);

	public CustomerSimpleMap() {
		SAMPLE_CUSTOMERS.forEach(c -> addCustomer(c));
		printOwnClassName();
	}

	private void addCustomer(Customer customer) {
		customers.put(customer.getId(), customer);
	}

	@Override
	public Customer findCustomer(String id) {
		if(!Faces.isNullOrEmpty(id)){
			return customers.get(id);
		}else{
			return null;
		}
	}
	
	protected final void printOwnClassName() {
		System.out.println(this.getClass().getSimpleName() + " initialized!");
	}

}
