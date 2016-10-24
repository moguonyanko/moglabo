package webcise;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.json.Json;
import javax.json.JsonException;
import javax.json.stream.JsonGenerator;

@WebServlet(name = "ShopInfo", urlPatterns = {"/shopinfo"})
public class ShopInfo extends HttpServlet {

    private <T> void writeShop(AnyShop<T> shop, JsonGenerator generator) {
        generator.writeStartObject(shop.getName());
        generator.writeStartArray("items");
        shop.getItemNames().stream()
                .forEach(generator::write);
        generator.writeEnd();
        generator.writeEnd();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("application/json;charset=UTF-8");

        /**
         * JsonGeneratorのcloseが呼び出されなければPrintWriterには書き出されず 
         * レスポンスボディは空になる。
         */
        try (JsonGenerator generator = 
                Json.createGeneratorFactory(null).createGenerator(res.getWriter())) {
            generator.writeStartObject();
            AnyShop.getShops().forEach(shop -> writeShop(shop, generator));
            generator.writeEnd();
        } catch (JsonException exception) {
            exception.printStackTrace(System.err);
            /**
             * try-with-resources文で記述するとPrintWriterが先にcloseされる。
             * sendError前にPrintWriterがcloseされていると例外がスローされる。
             */
            res.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    exception.getMessage());
        }
    }

}
