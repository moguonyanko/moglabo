package exercise.net;

import java.io.IOException;
import java.net.Socket;

/**
 * 参考
 * 「Javaネットワークプログラミングの真髄」
 */
public class MyEchoConnectionHandler extends MyConnectionHandler {

    public MyEchoConnectionHandler(Socket socket) {
        super(socket);
    }
    
    @Override
    void handleConversation() {
        try (var socket = getSocket()) {
            var in = socket.getInputStream();
            var out = socket.getOutputStream();
            
            var buffer = new byte[8192];
            var count = 0;
            while ((count = in.read(buffer)) >= 0) {
                out.write(buffer, 0, count);
                out.flush();
            }
        } catch (IOException ie) {
            ie.printStackTrace();
        }
    }
    
}
