package webcise;

import java.io.IOException;
import java.io.PrintWriter;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * サーブレット呼び出しではServerSentEventsのopenイベントしか発生させることができない。
 */
@WebServlet(name = "ServerSender", urlPatterns = {"/ServerSender"})
public class ServerSender extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        /**
         * text/event-stream以外のContent-Typeを返すとクライアント側でエラーになる。
         */
        response.setContentType("text/event-stream");
        try (PrintWriter out = response.getWriter()) {
            JsonObjectBuilder builder = Json.createObjectBuilder();
            JsonObjectBuilder jb = Json.createObjectBuilder();
            JsonArrayBuilder ab = Json.createArrayBuilder();
            ab.add(200);
            jb.add("code", ab);
            builder.add("status", jb);
            JsonObject json = builder.build();
            out.print(json.toString());
        }
    }

}
