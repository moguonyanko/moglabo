package practicejsf.bean.service.foodmenu;

import practicejsf.bean.service.Curry;
import javax.inject.Named;

import practicejsf.bean.service.FoodService;

@Curry
@Named("curry")
public class CurryService implements FoodService {

	@Override
	public String getFoods() {
		return "カレー";
	}

}
