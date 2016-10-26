package webcise.json;

import javax.json.Json;
import javax.json.JsonObject;

public class Jsons {
	
	public static JsonObject getEmptyJson() {
		return Json.createObjectBuilder().build();
	}
	
}
