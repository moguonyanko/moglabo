package webcise;

import java.io.IOException;
import java.io.PrintWriter;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.servlet.AsyncContext;
import javax.servlet.AsyncEvent;
import javax.servlet.AsyncListener;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * サーブレット呼び出しではServerSentEventsのopenイベントしか発生させることができない。
 */
@WebServlet(name = "ServerSender", urlPatterns = {"/ServerSender"}, asyncSupported = true)
public class ServerSender extends HttpServlet {

    private void writeJSON(PrintWriter out) {
        JsonObjectBuilder builder = Json.createObjectBuilder();
        JsonObjectBuilder jb = Json.createObjectBuilder();
        JsonArrayBuilder ab = Json.createArrayBuilder();
        ab.add(200);
        jb.add("code", ab);
        builder.add("status", jb);
        JsonObject json = builder.build();
        out.write(json.toString());
        out.flush();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        /**
         * text/event-stream以外のContent-Typeを返すとクライアント側でエラーになる。
         */
        response.setContentType("text/event-stream");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Connection", "keep-alive");
        response.setCharacterEncoding("UTF-8");

        final AsyncContext asyncContext = request.startAsync();

        try (PrintWriter out = response.getWriter()) {
            asyncContext.addListener(new AsyncListener() {
                @Override
                public void onComplete(AsyncEvent ae) throws IOException {
                    writeJSON(out);
                }

                @Override
                public void onTimeout(AsyncEvent ae) throws IOException {
                    out.write("timeout!");
                    out.flush();
                }

                @Override
                public void onError(AsyncEvent ae) throws IOException {
                    out.write("error!");
                    out.flush();
                }

                @Override
                public void onStartAsync(AsyncEvent ae) throws IOException {
                    out.write("start sync!");
                    out.flush();
                }
            });
        }
    }

}
