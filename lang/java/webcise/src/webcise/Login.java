package webcise;

import java.io.IOException;

import javax.json.Json;
import javax.json.JsonException;
import javax.json.stream.JsonGenerator;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * urlPatternsの大文字小文字が区別されるのでLoginでリクエストすると
 * 404エラーになる。
 */
@WebServlet(name = "Login", urlPatterns = {"/login"})
public class Login extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse res)
		throws ServletException, IOException {
		String validName = "admin";
		String validPassword = "secret";

		String name = req.getParameter("name");
		String password = req.getParameter("password");

		if (validName.equals(name) && validPassword.equals(password)) {
			try (JsonGenerator generator =
				Json.createGeneratorFactory(null).createGenerator(res.getWriter())) {
				generator.writeStartObject();
				generator.writeStartObject("result");
				generator.write("name", name);
				generator.write("message", "Welcome " + name + "!");
				generator.writeEnd();
				generator.writeEnd();
			} catch (JsonException exception) {
				exception.printStackTrace(System.err);
				res.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					exception.getMessage());
			}
		} else {
			res.sendError(HttpServletResponse.SC_UNAUTHORIZED,
				"Invalid accounts!");
		}
	}

}
