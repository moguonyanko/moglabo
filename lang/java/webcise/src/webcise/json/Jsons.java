package webcise.json;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;

public class Jsons {
	
	public static JsonObject getEmptyJson() {
		return Json.createObjectBuilder().build();
	}
	
	public static JsonArray getEmptyArray() {
		return Json.createArrayBuilder().build();
	}
	
}
