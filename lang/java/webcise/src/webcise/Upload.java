package webcise;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

import javax.json.Json;
import javax.json.JsonException;
import javax.json.stream.JsonGenerator;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

@WebServlet(name = "Upload", urlPatterns = {"/Upload"})
@MultipartConfig(fileSizeThreshold = 5000000, maxFileSize = 10000000, 
	location = "E:/tmp")
public class Upload extends HttpServlet {

	private static final Pattern SEMICOLON_PATTERN = Pattern.compile(";");
	private static final Pattern EQ_PATTERN = Pattern.compile("=");

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
		response.setContentType("application/json;charset=UTF-8");

		Part part = request.getPart("samplefile");
		String fileName = request.getParameter("filename");
		if (fileName == null || fileName.isEmpty()) {
			fileName = getFilename(part);
		}
		/**
		 * ファイル名にマルチバイト文字が含まれる時にエンコードしないと
		 * 書き出されるファイルのファイル名が文字化けする。
		 */
		fileName = encodeFileName(fileName);

		if (!fileName.isEmpty()) {
			part.write(fileName);
			String msg = "アップロード成功";
			try (JsonGenerator generator =
				Json.createGeneratorFactory(null).createGenerator(response.getWriter())) {
				generator.writeStartObject();
				generator.write("status", HttpServletResponse.SC_OK);
				generator.write("message", msg);
				generator.writeEnd();
			} catch (JsonException exception) {
				exception.printStackTrace(System.err);
				response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
					exception.getMessage());
			}
		} else {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST,
				"ファイル名が見つかりません！");
		}
	}

	private String getFilename(Part part) {
		/*
		 * Content-Disposition: form-data; name="content"; filename="FILE_NAME"
		 */
		String pairs[] =
			SEMICOLON_PATTERN.split(part.getHeader("Content-Disposition"));

		for (String pair : pairs) {
			if (pair.trim().startsWith("filename")) {
				String[] keyValue = EQ_PATTERN.split(pair);
				String fileName = keyValue[1].replace("\"", "");
				return fileName;
			}
		}

		return "";
	}

	private String encodeFileName(String fileName)
		throws ServletException, IOException {
		/**
		 * POSTリクエスト内のパラメータをISO_8859_1でバイト列に変換する。
		 * Tomcat8.5でもこの時の文字エンコーディングはISO_8859_1を使う
		 * 必要がある。GETリクエストのパラメータを処理する際はUTF-8を使う。
		 * http://tomcat.apache.org/migration-8.html#URIEncoding
		 */
		String serverEncoding = StandardCharsets.ISO_8859_1.name();
		byte[] fileNameBytes = fileName.getBytes(serverEncoding);
		/**
		 * HttpServletRequestの文字エンコーディングはnullになっている。
		 * FormDataのパラメータはUTF-8で送られてくるものと見なしている。
		 */
		//String requestEncoding = request.getCharacterEncoding();
		String requestEncoding = StandardCharsets.UTF_8.name();
		return new String(fileNameBytes, requestEncoding);
	}
}
