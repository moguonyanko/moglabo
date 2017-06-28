package webcise;

import java.nio.charset.StandardCharsets;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class SSE {

    private static final String SSE_CONTENT_TYPE = "text/event-stream";

    public static boolean isSSERequest(HttpServletRequest request) {
        return SSE_CONTENT_TYPE.equals(request.getHeader("Accept"));
    }

    /**
     * text/event-stream以外のContent-Typeを返すとクライアント側でエラーになる。
     */
    public static void setSSEResponseAttributes(HttpServletResponse response) {
        response.setContentType("text/event-stream");
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Connection", "keep-alive");
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
    }

}
