package webcise;

import java.io.IOException;
import java.util.concurrent.ThreadLocalRandom;

import javax.json.Json;
import javax.json.stream.JsonGenerator;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "RandomNumber", urlPatterns = {"/RandomNumber"})
public class RandomNumber extends HttpServlet {

    private int getRandomNumber(int bound) {
        return ThreadLocalRandom.current().nextInt(bound);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        String boundParam = request.getParameter("bound");
        try (JsonGenerator generator = Json.createGeneratorFactory(null)
                .createGenerator(response.getWriter())) {
            int n = getRandomNumber(Integer.parseInt(boundParam));
            generator.writeStartObject();
            generator.write("result", n);
            generator.writeEnd();
        }
    }

}
