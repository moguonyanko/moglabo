package webcise;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

@WebServlet(name = "Upload", urlPatterns = {"/Upload"})
@MultipartConfig(fileSizeThreshold = 5000000, maxFileSize = 10000000, location = "E:/tmp")
public class Upload extends HttpServlet {

	private static final Pattern SEMICOLON_PATTERN = Pattern.compile(";");
	private static final Pattern EQ_PATTERN = Pattern.compile("=");
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
		response.setContentType("application/json;charset=UTF-8");

		Part part = request.getPart("samplefile");
		/* @todo Shift-JISのファイル名が文字化けする。 */
		String fileName = getFilename(part);
		
		if(!fileName.isEmpty()){
			part.write(fileName);
			StringBuilder json = new StringBuilder();
			String msg = "アップロード成功";
			json.append("{").
				append("\n\"status\":").append(200).append(",").
				append("\n\"message\":\"").append(msg).append("\"").
				append("\n}");
			PrintWriter out = response.getWriter();
			out.println(json.toString());
		}else{
			throw new IllegalArgumentException("ファイル名が見つかりません！");
		}
	}

	private String getFilename(Part part) {
		/* Content-Disposition: form-data; name="content"; filename="FILE_NAME" */
		String pairs[] = SEMICOLON_PATTERN.split(part.getHeader("Content-Disposition"));
		
		for (String pair : pairs) {
			if (pair.trim().startsWith("filename")) {
				String[] keyValue = EQ_PATTERN.split(pair);
				String fileName = keyValue[1].replace("\"", "");
				return fileName;
			}
		}
		
		return "";
	}
}
