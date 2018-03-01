package webcise;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(name = "ModuleScript", urlPatterns = {"/ModuleScript"})
public class ModuleScript extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/javascript;charset=UTF-8");
        
        Cookie cookie = new Cookie("modulekey", "modulevalue");
        response.addCookie(cookie);

        try (PrintWriter out = response.getWriter()) {
            out.println("const helloModule = () => {");
            out.println("return 'Hello!'");
            out.println("};");
            out.println("export default helloModule;");
        }
    }

}
