package webcise;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.websocket.CloseReason;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.OnClose;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/myreader")
public class MyReader {

	private BufferedReader reader;

	@OnOpen
	public void createReader(Session peer) throws IOException {
		String filePath = "D:\\moglabo\\lang\\java\\webcise\\src\\webcise\\sample.txt";

		try {
			reader = new BufferedReader(new FileReader(Paths.get(filePath).toFile()));
		} catch (FileNotFoundException ex) {
			String msg = filePath + "が見つかりませんでした。セッションを終了します。";
			Logger.getLogger(MyReader.class.getName()).log(Level.SEVERE, msg, ex);
			peer.close(new CloseReason(CloseReason.CloseCodes.UNEXPECTED_CONDITION, msg));
		}
	}

	@OnMessage
	public String readFile(String message) {
		int lineSize = Integer.parseInt(message);

		StringBuilder result = new StringBuilder();
		
		try {
			result.append("{\"result\":").append("\"");
			
			while (lineSize > 0) {
				String line = reader.readLine();

				if (line != null) {
					result.append(line).append("\\n");
				} else {
					result.append("EOF");
					break;
				}

				--lineSize;
			}

			result.append("\"}");
		} catch (IOException ex) {
			result.append("{\"message\":").append(ex.getMessage()).append("}");
		}

		return result.toString();
	}

	@OnClose
	public void closeReader(Session peer) {
		if (reader != null) {
			try {
				reader.close();
			} catch (IOException ex) {
				String msg = "ファイルの終了処理でエラーが発生しました。";
				Logger.getLogger(MyReader.class.getName()).log(Level.SEVERE, msg, ex);
			}
		}
	}

}
