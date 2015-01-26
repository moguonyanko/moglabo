package webcise;

import javax.websocket.OnMessage;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/greeting")
public class Greeting {
	
	@OnMessage
	public String onMessage(String message) {
		return message + " 受信しました。こちらはサーバです。";
	}

}
