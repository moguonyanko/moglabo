package practicejsf.bean.service.foodmenu;

import practicejsf.bean.service.Sushi;
import javax.inject.Named;

import practicejsf.bean.service.FoodService;

@Sushi
@Named("sushi")
public class SushiService implements FoodService {

	@Override
	public String getFoods() {
		return "寿司";
	}

}
