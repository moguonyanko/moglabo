package practicejsf.bean;

import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

import practicejsf.bean.service.FoodServiceCaller;
import practicejsf.bean.service.FoodServiceManager;

@Named
@RequestScoped
public class FoodShop {

	private final FoodServiceCaller caller;

	public FoodShop() {
		caller = new FoodServiceManager();
	}
	
	public List<String> getFoodMenu() {
		return caller.callFoodService();
	}
	
}
