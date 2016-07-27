package practicejsf.bean.service.foodmenu;

import practicejsf.bean.service.Noodle;
import javax.inject.Named;

import practicejsf.bean.service.FoodService;

@Noodle
@Named("noodle")
public class NoodleService implements FoodService {

	@Override
	public String getFoods() {
		return "麺";
	}
	
}
