package webcise.json;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

import javax.json.Json;
import javax.json.stream.JsonGenerator;
import javax.json.stream.JsonGeneratorFactory;
import javax.json.stream.JsonParser;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "ShopItems", urlPatterns = {"/shopitems"})
public class ShopItems extends HttpServlet {
	
	private JsonParser.Event printResult(HttpServletResponse res,
		JsonParser parser, JsonParser.Event evt) throws IOException {
		JsonParser.Event event = evt;
		PrintWriter out = res.getWriter();
		JsonGeneratorFactory factory = Json.createGeneratorFactory(null);
		try (JsonGenerator generator = factory.createGenerator(out)) {
			generator.writeStartArray();
			while (parser.hasNext()) {
				event = parser.next();
				if (event.equals(JsonParser.Event.VALUE_STRING)) {
					String itemName = parser.getString();
					generator.write(itemName);
				} else if (event.equals(JsonParser.Event.END_ARRAY)) {
					break;
				}
			}
			generator.writeEnd();
		}

		return event;
	}
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse res)
		throws ServletException, IOException {
		res.setContentType("application/json");

		String path = "/WEB-INF/resources/sample1.json";

		try (InputStream in = req.getServletContext().getResourceAsStream(path);
			JsonParser parser = Json.createParser(in)) {

			boolean detected = false;
			
			while (parser.hasNext()) {
				JsonParser.Event event = parser.next();
				
				while (parser.hasNext() &&
					!(event.equals(JsonParser.Event.KEY_NAME) &&
					parser.getString().matches("name"))) {
					event = parser.next();
				}

				if (parser.hasNext()) {
					event = parser.next();
					String targetShopName = req.getParameter("shopname");

					if (event.equals(JsonParser.Event.VALUE_STRING) &&
						parser.getString().matches(targetShopName)) {
						while (parser.hasNext() &&
							!(event.equals(JsonParser.Event.KEY_NAME) &&
							parser.getString().matches("items"))) {
							event = parser.next();
						}

						if (event.equals(JsonParser.Event.KEY_NAME) &&
							parser.getString().matches("items")) {
							printResult(res, parser, event);
							detected = true;
						}
					}
				}
			}
			
			if(!detected){
				PrintWriter out = res.getWriter();
				out.print(Jsons.getEmptyArray().toString());
			}
		}
	}

}
